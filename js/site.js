/* Маникюр на островах · header height, menu, booking panel */
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

  /* booking: same pattern as the old site widget, a panel from the left with the YCLIENTS form */
  var dlg = document.getElementById('bk');
  if (dlg && typeof dlg.showModal === 'function') {
    var frame = dlg.querySelector('.bk__frame');
    var opener = null;
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest('a[data-book]');
      if (!a || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button) return;
      ev.preventDefault();
      opener = a;
      if (!frame.getAttribute('src')) frame.setAttribute('src', frame.dataset.src);
      if (!menu.hidden) openMenu(false);
      dlg.showModal();
      root.classList.add('bk-open');
    });
    dlg.querySelector('.bk__close').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (ev) {
      if (ev.target !== dlg) return;
      var r = dlg.getBoundingClientRect();
      if (ev.clientX > r.right || ev.clientX < r.left || ev.clientY < r.top || ev.clientY > r.bottom) dlg.close();
    });
    dlg.addEventListener('close', function () {
      root.classList.remove('bk-open');
      if (opener) opener.focus();
    });
  }
})();
