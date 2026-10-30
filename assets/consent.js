/* Consentimiento de cookies + Meta Pixel (ELIA Studio)
   El píxel solo se carga si la persona pulsa «Aceptar». La decisión se guarda
   en localStorage (clave elia_consent) durante 12 meses. */
(function () {
  var PIXEL_ID = '1654811495996696';
  var KEY = 'elia_consent';
  var MESES = 12;

  function leer() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!v || !v.ts) return null;
      if (Date.now() - v.ts > MESES * 30 * 24 * 3600 * 1000) { localStorage.removeItem(KEY); return null; }
      return v.estado;
    } catch (e) { return null; }
  }
  function guardar(estado) {
    try { localStorage.setItem(KEY, JSON.stringify({ estado: estado, ts: Date.now() })); } catch (e) {}
  }

  function cargarPixel() {
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
    if (document.body && document.body.getAttribute('data-evento-pixel')) {
      fbq('track', document.body.getAttribute('data-evento-pixel'));
    }
  }

  function banner() {
    var css = document.createElement('style');
    css.textContent =
      '#elia-cookies{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:#171A2C;color:#E4E5EC;border:1px solid #2A2D42;border-radius:16px;padding:18px 20px;' +
      'box-shadow:0 12px 40px rgba(0,0,0,.35);font-family:"Instrument Sans",system-ui,sans-serif;font-size:15px;line-height:1.5}' +
      '#elia-cookies p{margin:0}#elia-cookies a{color:#FF6B4A}' +
      '#elia-cookies .acciones{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}' +
      '#elia-cookies button{cursor:pointer;min-height:44px;padding:0 18px;border-radius:999px;font:inherit;font-weight:600}' +
      '#elia-cookies .ok{background:#FF6B4A;color:#14131A;border:0}#elia-cookies .ok:hover{background:#FF8063}' +
      '#elia-cookies .no{background:transparent;color:#E4E5EC;border:1px solid #3A3E58}#elia-cookies .no:hover{border-color:#E4E5EC}';
    document.head.appendChild(css);

    var div = document.createElement('div');
    div.id = 'elia-cookies';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-label', 'Aviso de cookies');
    div.innerHTML =
      '<p>Usamos una cookie de Meta (Facebook e Instagram) para saber qué anuncios te han traído hasta aquí y mostrarte contenido relacionado. ' +
      'Solo se instala si aceptas. <a href="/cookies.html">Más información</a>.</p>' +
      '<div class="acciones"><button type="button" class="ok">Aceptar</button><button type="button" class="no">Rechazar</button></div>';
    document.body.appendChild(div);
    div.querySelector('.ok').addEventListener('click', function () { guardar('aceptado'); div.remove(); cargarPixel(); });
    div.querySelector('.no').addEventListener('click', function () { guardar('rechazado'); div.remove(); });
  }

  function iniciar() {
    var estado = leer();
    if (estado === 'aceptado') { cargarPixel(); return; }
    if (estado === 'rechazado') return;
    banner();
  }

  /* Permite cambiar de opinión desde la página de cookies: <a href="#" data-cookies-reset> */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-cookies-reset]');
    if (!a) return;
    e.preventDefault();
    try { localStorage.removeItem(KEY); } catch (err) {}
    if (!document.getElementById('elia-cookies')) banner();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
