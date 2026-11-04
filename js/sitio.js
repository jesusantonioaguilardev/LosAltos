/* Los Altos: buscador y cambio de idioma (español / inglés).
 * Usa window.LA_EN (js/i18n.js) y window.LA_INDICE (js/indice.js). Sin dependencias. */
(function () {
  'use strict';

  var EN = window.LA_EN || {};
  var INDICE = window.LA_INDICE || [];
  var CLAVE = 'la-idioma';
  var UI = {
    es: { buscar: 'Buscar...', vacio: 'Escribe para buscar...', nada: 'Sin resultados para', cerrar: 'Cerrar', titulo: 'Buscar' },
    en: { buscar: 'Search...', vacio: 'Type to search...', nada: 'No results for', cerrar: 'Close', titulo: 'Search' }
  };
  var idioma = 'es';

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function tr(s) { return idioma === 'en' && EN[s] ? EN[s] : s; }
  function sinAcentos(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  /* ---------- Idioma ---------- */
  var textos = [];   // { nodo, original }
  var atributos = []; // { el, attr, original }
  var tituloOriginal = document.title;

  function recolectar() {
    var paseo = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!norm(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        if (n.parentElement.closest('script,style,svg,noscript,.la-buscador')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (paseo.nextNode()) textos.push({ nodo: paseo.currentNode, original: paseo.currentNode.nodeValue });
    document.querySelectorAll('[alt],[placeholder],[aria-label],[title]').forEach(function (el) {
      if (el.closest('.la-buscador')) return;
      ['alt', 'placeholder', 'aria-label', 'title'].forEach(function (a) {
        if (el.hasAttribute(a) && el.getAttribute(a)) atributos.push({ el: el, attr: a, original: el.getAttribute(a) });
      });
    });
  }

  function aplicarIdioma(lang) {
    idioma = lang;
    textos.forEach(function (t) {
      var clave = norm(t.original);
      if (lang === 'en' && EN[clave]) {
        var ini = t.original.match(/^\s*/)[0], fin = t.original.match(/\s*$/)[0];
        t.nodo.nodeValue = ini + EN[clave] + fin;
      } else {
        t.nodo.nodeValue = t.original;
      }
    });
    atributos.forEach(function (a) { a.el.setAttribute(a.attr, tr(norm(a.original))); });
    document.title = tr(tituloOriginal);
    document.documentElement.lang = lang === 'en' ? 'en-US' : 'es-MX';
    actualizarBanderas();
    actualizarBuscador();
    try { localStorage.setItem(CLAVE, lang); } catch (e) { /* sin almacenamiento */ }
  }

  // En cada par de banderas, la primera es Estados Unidos y la segunda México.
  var banderas = [];
  function prepararBanderas() {
    document.querySelectorAll('a.text-2xl').forEach(function (a) {
      var par = a.parentElement.querySelectorAll(':scope > a.text-2xl');
      if (par.length !== 2) return;
      var lang = a === par[0] ? 'en' : 'es';
      a.setAttribute('role', 'button');
      a.setAttribute('tabindex', '0');
      a.setAttribute('aria-label', lang === 'en' ? 'English' : 'Español');
      a.addEventListener('click', function () { aplicarIdioma(lang); });
      a.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aplicarIdioma(lang); } });
      banderas.push({ el: a, lang: lang });
    });
  }
  function actualizarBanderas() {
    banderas.forEach(function (b) {
      var activa = b.lang === idioma;
      b.el.classList.toggle('pointer-events-none', activa);
      b.el.classList.toggle('cursor-pointer', !activa);
      b.el.setAttribute('aria-pressed', activa ? 'true' : 'false');
    });
  }

  /* ---------- Buscador ---------- */
  var caja, campo, vacio, lista, cerrarBtn, anterior;

  function crearBuscador() {
    caja = document.createElement('div');
    caja.className = 'la-buscador';
    caja.hidden = true;
    caja.innerHTML =
      '<div class="la-fondo"></div>' +
      '<div class="la-panel" role="dialog" aria-modal="true">' +
      '<div class="la-cabeza"><button type="button" class="la-cerrar">' +
      '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' +
      '</button><input type="search" class="la-campo" autocomplete="off"></div>' +
      '<div class="la-cuerpo"><p class="la-vacio font-title"></p><ul class="la-resultados"></ul></div>' +
      '<div class="la-pie"></div></div>';
    document.body.appendChild(caja);
    campo = caja.querySelector('.la-campo');
    vacio = caja.querySelector('.la-vacio');
    lista = caja.querySelector('.la-resultados');
    cerrarBtn = caja.querySelector('.la-cerrar');
    var logo = document.querySelector('header h1 a svg');
    if (logo) caja.querySelector('.la-pie').appendChild(logo.cloneNode(true));

    cerrarBtn.addEventListener('click', cerrar);
    caja.querySelector('.la-fondo').addEventListener('click', cerrar);
    campo.addEventListener('input', buscar);
    caja.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrar();
      if (e.key === 'Tab') { // mantiene el foco dentro del diálogo
        var f = caja.querySelectorAll('button, input, a[href]');
        var primero = f[0], ultimo = f[f.length - 1];
        if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
        else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
      }
    });
    actualizarBuscador();
  }

  function actualizarBuscador() {
    if (!caja) return;
    var u = UI[idioma];
    campo.placeholder = u.buscar;
    campo.setAttribute('aria-label', u.titulo);
    cerrarBtn.setAttribute('aria-label', u.cerrar);
    caja.querySelector('.la-panel').setAttribute('aria-label', u.titulo);
    buscar();
  }

  function abrir() {
    anterior = document.activeElement;
    caja.hidden = false;
    document.documentElement.classList.add('la-sin-scroll');
    campo.value = '';
    buscar();
    setTimeout(function () { campo.focus(); }, 0);
  }
  function cerrar() {
    caja.hidden = true;
    document.documentElement.classList.remove('la-sin-scroll');
    if (anterior && anterior.focus) anterior.focus();
  }

  function escapar(s) {
    return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  // Fragmento alrededor de la coincidencia, con la palabra resaltada
  function fragmento(texto, q) {
    var i = sinAcentos(texto).indexOf(q);
    if (i < 0) return escapar(texto.length > 140 ? texto.slice(0, 140) + '…' : texto);
    var desde = Math.max(0, i - 60), hasta = Math.min(texto.length, i + q.length + 80);
    return (desde ? '…' : '') + escapar(texto.slice(desde, i)) + '<mark>' + escapar(texto.slice(i, i + q.length)) + '</mark>' +
      escapar(texto.slice(i + q.length, hasta)) + (hasta < texto.length ? '…' : '');
  }

  function buscar() {
    var q = sinAcentos(norm(campo.value));
    lista.innerHTML = '';
    if (!q) { vacio.textContent = UI[idioma].vacio; vacio.hidden = false; return; }
    var res = [];
    INDICE.forEach(function (e) {
      var titulo = tr(e.titulo), textos = e.textos.map(tr), puntos = 0, mejor = null;
      if (sinAcentos(titulo).indexOf(q) >= 0) puntos += 10;
      textos.forEach(function (t) { if (sinAcentos(t).indexOf(q) >= 0) { puntos += 1; if (!mejor) mejor = t; } });
      if (puntos) res.push({ e: e, titulo: titulo, texto: mejor || textos[0] || '', puntos: puntos });
    });
    res.sort(function (a, b) { return b.puntos - a.puntos; });
    if (!res.length) {
      vacio.textContent = UI[idioma].nada + ' “' + campo.value.trim() + '”';
      vacio.hidden = false;
      return;
    }
    vacio.hidden = true;
    res.slice(0, 12).forEach(function (r) {
      var li = document.createElement('li');
      li.innerHTML = '<a href="' + escapar(r.e.url) + '"><span class="la-r-pagina">' + escapar(tr(r.e.pagina)) + '</span>' +
        '<span class="la-r-titulo">' + fragmento(r.titulo, q) + '</span>' +
        (r.texto ? '<span class="la-r-texto">' + fragmento(r.texto, q) + '</span>' : '') + '</a>';
      li.querySelector('a').addEventListener('click', cerrar);
      lista.appendChild(li);
    });
  }

  // Botones de lupa del encabezado (todos los botones salvo el de "Abrir menú")
  function prepararLupas() {
    document.querySelectorAll('header button').forEach(function (b) {
      if (/men[uú]/i.test(b.textContent)) return;
      b.setAttribute('aria-label', 'Buscar');
      b.addEventListener('click', abrir);
    });
  }

  /* ---------- Inicio ---------- */
  function iniciar() {
    prepararLupas();
    recolectar();
    crearBuscador();
    prepararBanderas();
    var guardado = 'es';
    try { guardado = localStorage.getItem(CLAVE) || 'es'; } catch (e) { /* sin almacenamiento */ }
    aplicarIdioma(guardado === 'en' ? 'en' : 'es');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
