-- =====================================================================
-- QUINIELA STANLEY — Esquema Supabase (Postgres)
-- Pegar TODO en: Supabase → SQL Editor → New query → Run.
-- Es idempotente-ish: usa "if not exists" / "or replace" donde se puede.
--
-- Modelo:
--   participantes        perfil (1 fila por usuario logueado, id = auth.uid())
--   pron_grupos          quién clasifica de cada grupo (1°/2°/3° + mejores 3°)
--   pron_partidos        llaves: quién avanza + marcador opcional (puntos extra)
--   resultados_grupos    lo REAL de grupos (lo carga el admin)
--   resultados_partidos  lo REAL de las llaves (lo carga el admin)
--   etapas               fechas de apertura/cierre por etapa (cierre = candado)
--   config               valores de puntaje (editables sin tocar código)
--   ranking (vista)      tabla de posiciones, sin datos personales sensibles
-- =====================================================================

-- ---------- ETAPAS (configuración de fechas / candado por fecha) ----------
create table if not exists public.etapas (
  id        text primary key,          -- 'grupos','r32','r16','qf','sf','final'
  nombre    text not null,
  orden     int  not null,
  apertura  timestamptz,               -- null = abierta desde siempre
  cierre    timestamptz                -- null = sin cierre (se completa con las fechas reales)
);

insert into public.etapas (id,nombre,orden) values
  ('grupos','Fase de grupos',1),
  ('r32','Dieciseisavos',2),
  ('r16','Octavos',3),
  ('qf','Cuartos',4),
  ('sf','Semifinales',5),
  ('final','Final y 3.er puesto',6)
on conflict (id) do nothing;

-- ¿La etapa está abierta para escribir ahora? (apertura <= now < cierre)
create or replace function public.etapa_abierta(_etapa text)
returns boolean language sql stable as $$
  select now() <  coalesce((select cierre   from public.etapas where id = _etapa),  'infinity'::timestamptz)
     and now() >= coalesce((select apertura from public.etapas where id = _etapa), '-infinity'::timestamptz);
$$;

-- ---------- PARTICIPANTES (perfil; id = usuario de Supabase Auth) ----------
create table if not exists public.participantes (
  id              uuid primary key references auth.users(id) on delete cascade,
  nombre          text not null,
  apellido        text not null,
  documento       text not null unique,   -- CI: garantiza una entrada por persona
  whatsapp        text not null,
  email           text not null,
  ciudad          text not null,
  posicion        text,                   -- arquero/defensa/medio/delantero/DT (del form)
  figura          text,                   -- figura del torneo (del form)
  desempate       int,                    -- goles primera fase (desempate del form)
  comprobante_url text,                   -- link al comprobante (Supabase Storage)
  creado_en       timestamptz default now()
);

-- ---------- PRONÓSTICOS DE GRUPOS ----------
create table if not exists public.pron_grupos (
  participante_id uuid not null references public.participantes(id) on delete cascade,
  grupo           text not null,                          -- 'A'..'L'
  puesto          int  not null check (puesto between 1 and 3),
  equipo          text not null,                          -- nombre de la selección
  clasifica       boolean not null default false,         -- true si 1°, 2° o mejor-3° elegido
  actualizado_en  timestamptz default now(),
  primary key (participante_id, grupo, puesto)
);

-- ---------- PRONÓSTICOS DE PARTIDOS (llaves) ----------
create table if not exists public.pron_partidos (
  participante_id uuid not null references public.participantes(id) on delete cascade,
  etapa           text not null references public.etapas(id),  -- 'r32'..'final'
  partido         text not null,                               -- clave, p.ej. 'r32-0', 'third-0'
  avanza          text,                                        -- equipo que avanza (decide cascada)
  marcador_a      int check (marcador_a between 0 and 99),     -- opcional (puntos extra)
  marcador_b      int check (marcador_b between 0 and 99),     -- opcional (puntos extra)
  actualizado_en  timestamptz default now(),
  primary key (participante_id, partido)
);

-- ---------- RESULTADOS REALES (los carga el admin con la service key) ----------
create table if not exists public.resultados_grupos (
  grupo       text not null,
  equipo      text not null,
  puesto_real int,
  clasifico   boolean,
  primary key (grupo, equipo)
);

create table if not exists public.resultados_partidos (
  partido     text primary key,
  etapa       text references public.etapas(id),
  avanza_real text,
  marcador_a  int,
  marcador_b  int
);

-- ---------- CONFIG DE PUNTAJE (editable desde la tabla, sin tocar código) ----------
create table if not exists public.config (
  clave text primary key,
  valor numeric not null
);
insert into public.config (clave,valor) values
  ('pts_clasificado',      1),   -- por cada equipo que clasifica acertado (grupos)
  ('pts_puesto_exacto',    1),   -- extra si además acertó el puesto (1°/2°/3°)
  ('pts_avanza',           3),   -- por acertar quién avanza en una llave
  ('pts_marcador_exacto',  2)    -- extra por marcador exacto de la llave
on conflict (clave) do nothing;

-- =====================================================================
-- PUNTOS Y RANKING (vistas)
-- Nota: en Supabase las vistas corren como su dueño (postgres) y NO aplican
-- el RLS de las tablas base. Por eso la vista 'ranking' expone SOLO columnas
-- no sensibles (nombre, ciudad, puntos) — nunca CI/WhatsApp/email.
-- =====================================================================
create or replace view public.v_puntos_grupos as
  select pg.participante_id,
         sum(
           (case when pg.clasifica and rg.clasifico
                 then (select valor from public.config where clave='pts_clasificado') else 0 end)
         + (case when rg.puesto_real = pg.puesto
                 then (select valor from public.config where clave='pts_puesto_exacto') else 0 end)
         ) as pts
  from public.pron_grupos pg
  join public.resultados_grupos rg
    on rg.grupo = pg.grupo and rg.equipo = pg.equipo
  group by pg.participante_id;

create or replace view public.v_puntos_partidos as
  select pp.participante_id,
         sum(
           (case when pp.avanza = rp.avanza_real
                 then (select valor from public.config where clave='pts_avanza') else 0 end)
         + (case when pp.marcador_a = rp.marcador_a and pp.marcador_b = rp.marcador_b
                 then (select valor from public.config where clave='pts_marcador_exacto') else 0 end)
         ) as pts
  from public.pron_partidos pp
  join public.resultados_partidos rp on rp.partido = pp.partido
  group by pp.participante_id;

create or replace view public.ranking as
  select p.id,
         p.nombre,
         p.ciudad,
         coalesce(g.pts,0) + coalesce(m.pts,0) as puntos
  from public.participantes p
  left join public.v_puntos_grupos   g on g.participante_id = p.id
  left join public.v_puntos_partidos m on m.participante_id = p.id
  order by puntos desc nulls last;

-- =====================================================================
-- ROW LEVEL SECURITY (cada jugador solo ve/edita lo suyo;
-- los resultados solo los escribe el admin con la service key)
-- =====================================================================
alter table public.participantes      enable row level security;
alter table public.pron_grupos        enable row level security;
alter table public.pron_partidos      enable row level security;
alter table public.etapas             enable row level security;
alter table public.config             enable row level security;
alter table public.resultados_grupos  enable row level security;
alter table public.resultados_partidos enable row level security;

-- PARTICIPANTES: cada uno su propia fila
create policy participantes_sel on public.participantes
  for select using (id = auth.uid());
create policy participantes_ins on public.participantes
  for insert with check (id = auth.uid());
create policy participantes_upd on public.participantes
  for update using (id = auth.uid()) with check (id = auth.uid());

-- PRON_GRUPOS: dueño + candado por fecha de la etapa 'grupos'
create policy prong_sel on public.pron_grupos
  for select using (participante_id = auth.uid());
create policy prong_ins on public.pron_grupos
  for insert with check (participante_id = auth.uid() and public.etapa_abierta('grupos'));
create policy prong_upd on public.pron_grupos
  for update using (participante_id = auth.uid())
  with check (participante_id = auth.uid() and public.etapa_abierta('grupos'));
create policy prong_del on public.pron_grupos
  for delete using (participante_id = auth.uid() and public.etapa_abierta('grupos'));

-- PRON_PARTIDOS: dueño + candado por fecha de la etapa del partido
create policy pronp_sel on public.pron_partidos
  for select using (participante_id = auth.uid());
create policy pronp_ins on public.pron_partidos
  for insert with check (participante_id = auth.uid() and public.etapa_abierta(etapa));
create policy pronp_upd on public.pron_partidos
  for update using (participante_id = auth.uid())
  with check (participante_id = auth.uid() and public.etapa_abierta(etapa));
create policy pronp_del on public.pron_partidos
  for delete using (participante_id = auth.uid() and public.etapa_abierta(etapa));

-- ETAPAS / CONFIG / RESULTADOS: lectura pública (el sitio los necesita),
-- escritura solo vía service key (RLS deniega al resto al no haber policy de write).
create policy etapas_sel  on public.etapas             for select using (true);
create policy config_sel  on public.config             for select using (true);
create policy resg_sel    on public.resultados_grupos  for select using (true);
create policy resp_sel    on public.resultados_partidos for select using (true);

-- Permisos sobre las vistas (para anon y usuarios logueados)
grant select on public.ranking            to anon, authenticated;
grant select on public.v_puntos_grupos    to anon, authenticated;
grant select on public.v_puntos_partidos  to anon, authenticated;

-- =====================================================================
-- FIN. Próximo paso: copiar Project URL + anon key (Settings → API)
-- y conectarlas en el front. La service key (secreta) solo para cargar
-- resultados/admin — nunca en el sitio público.
-- =====================================================================
