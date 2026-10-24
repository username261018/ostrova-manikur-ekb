/* Маникюр на островах · header height, menu */
(function () {
  'use strict';
  var root = document.documentElement;
  var top = document.getElementById('top');

  function setTop() { root.style.setProperty('--top-h', top.offsetHeight + 'px'); }
  setTop();
  if ('ResizeObserver' in window) new ResizeObserver(setTop).observe(top);
  else window.addEventListener('resize', setTop);

  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  function openMenu(on) {
    menu.hidden = !on;
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Закрыть меню' : 'Открыть меню');
    setTop();
  }
  btn.addEventListener('click', function () { openMenu(menu.hidden); });
  menu.addEventListener('click', function (ev) { if (ev.target.closest('a')) openMenu(false); });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && !menu.hidden) { openMenu(false); btn.focus(); }
  });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', function (m) { if (m.matches) openMenu(false); });
})();
