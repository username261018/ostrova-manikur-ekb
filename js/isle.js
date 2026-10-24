/* Маникюр на островах · v2 entrance and circle reveals */
(function () {
  'use strict';
  var root = document.documentElement;
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bg = document.querySelector('.bg');
  var pops = Array.prototype.slice.call(document.querySelectorAll('.pop'));

  function finish() { root.classList.add('up', 'done'); }
  if (rm) {
    finish();
    pops.forEach(function (p) { p.classList.add('is-in', 'is-done'); });
    return;
  }
  var ended = false;
  function end() { if (!ended) { ended = true; finish(); } }
  bg.addEventListener('transitionend', function (ev) { if (ev.propertyName === 'clip-path') end(); });
  setTimeout(end, 2600);
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('up'); }); });

  function open(p) {
    if (p.classList.contains('is-in')) return;
    p.addEventListener('transitionend', function f(ev) {
      if (ev.propertyName !== 'clip-path') return;
      p.removeEventListener('transitionend', f);
      p.classList.add('is-done');
    });
    p.classList.add('is-in');
    setTimeout(function () { p.classList.add('is-done'); }, 1600);
  }
  if (!('IntersectionObserver' in window)) { pops.forEach(open); return; }
  var io = new IntersectionObserver(function (list) {
    list.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.pop').forEach(open);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reel').forEach(function (r) { io.observe(r); });
})();
