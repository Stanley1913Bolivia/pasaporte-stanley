(function(){
  var cfg = window.STANLEY || {};
  var override = new URLSearchParams(location.search).get('phase');
  var phase = override || cfg.PHASE || 'inscripcion';
  document.documentElement.setAttribute('data-phase', phase);
})();
