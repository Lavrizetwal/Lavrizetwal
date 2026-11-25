/* Zetwal — adresse dans le bas de page (une seule source pour toutes les pages) */
(function(){
  function go(){
    var f=document.querySelector('footer'); if(!f||f.querySelector('.zt-ad')) return;
    var fr=/^fr/i.test(document.documentElement.lang||'');
    var t=fr?'Route Nationale n° 1, entrée de la ruelle Jean Pierre, zone de Pont-Gaudin, Gonaïves, Haïti W.I'
            :'Wout Nasyonal #1, nan antre ri Jean Pierre a, zòn Pont-Gaudin, Gonayiv, Ayiti W.I';
    if(!document.getElementById('zt-ad-css')){
      var s=document.createElement('style'); s.id='zt-ad-css';
      s.textContent='.zt-ad{display:flex;align-items:flex-start;justify-content:center;gap:9px;flex-basis:100%;width:100%;margin:14px auto 0;padding-top:14px;border-top:1px solid rgba(212,175,55,.28);font-style:normal;font-size:.84rem;line-height:1.6;letter-spacing:.01em;text-align:center;color:inherit;opacity:.82}'+
        '.zt-ad svg{flex:none;width:16px;height:16px;margin-top:3px;stroke:#D4AF37;fill:none;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}'+
        '.zt-ad span{max-width:62ch}@media(max-width:700px){.zt-ad{margin-bottom:64px}}';
      document.head.appendChild(s);
    }
    var a=document.createElement('address'); a.className='zt-ad';
    a.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg><span></span>';
    a.querySelector('span').textContent=t;
    var box=f.querySelector('.wrap,.in')||f; box.appendChild(a);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go();
})();
