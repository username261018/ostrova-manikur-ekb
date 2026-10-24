/* Маникюр на островах · photo reels and map on demand */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function Reel(el) {
    var track = el.querySelector('.reel__track');
    var items = Array.prototype.slice.call(track.children);
    var prev = el.querySelector('.reel__prev');
    var next = el.querySelector('.reel__next');
    var ctl = el.querySelector('.reel__ctl');
    var dotsBox = el.querySelector('.reel__dots');
    var stops = [];
    var dots = [];
    var at = 0;

    function measure() {
      var max = track.scrollWidth - track.clientWidth;
      var base = items[0].offsetLeft;
      var list = [];
      items.forEach(function (it, i) {
        var x = i === items.length - 1 ? max : Math.min(it.offsetLeft - base, max);
        if (!list.length || x - list[list.length - 1] > 2) list.push(x);
      });
      stops = list.length ? list : [0];
      if (dots.length !== stops.length) {
        dotsBox.textContent = '';
        dots = stops.map(function (_, i) {
          var d = document.createElement('button');
          d.type = 'button';
          d.className = 'reel__dot';
          d.setAttribute('aria-label', 'Фото ' + (i + 1) + ' из ' + stops.length);
          d.addEventListener('click', function () { go(i); });
          dotsBox.appendChild(d);
          return d;
        });
      }
      ctl.hidden = stops.length < 2;
    }
    function nearest() {
      var x = track.scrollLeft, best = 0;
      stops.forEach(function (s, i) { if (Math.abs(s - x) < Math.abs(stops[best] - x)) best = i; });
      return best;
    }
    function paint() {
      at = nearest();
      el.dataset.index = at;
      prev.disabled = at === 0;
      next.disabled = at === stops.length - 1;
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === at ? 'true' : 'false'); });
      var x = track.scrollLeft, w = track.clientWidth, base = items[0].offsetLeft;
      items.forEach(function (it) {
        var l = it.offsetLeft - base - x;
        var seen = l + it.offsetWidth / 2 > 0 && l + it.offsetWidth / 2 < w;
        it.inert = !seen;
        it.setAttribute('aria-hidden', seen ? 'false' : 'true');
      });
    }
    function go(i) {
      i = Math.max(0, Math.min(stops.length - 1, i));
      track.scrollTo({ left: stops[i], behavior: reduce.matches ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function () { go(nearest() - 1); });
    next.addEventListener('click', function () { go(nearest() + 1); });
    track.addEventListener('keydown', function (ev) {
      var k = ev.key;
      if (k === 'ArrowRight') go(nearest() + 1);
      else if (k === 'ArrowLeft') go(nearest() - 1);
      else if (k === 'Home') go(0);
      else if (k === 'End') go(stops.length - 1);
      else return;
      ev.preventDefault();
    });
    var t;
    track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(paint, 90); }, { passive: true });
    if ('onscrollend' in window) track.addEventListener('scrollend', paint);
    window.addEventListener('resize', function () { measure(); paint(); });
    measure();
    paint();
  }
  document.querySelectorAll('.reel').forEach(function (el) { new Reel(el); });

  document.querySelectorAll('.map__call').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = b.dataset.src;
      f.title = 'Студии «Маникюр на островах» на карте';
      f.allowFullscreen = true;
      b.replaceWith(f);
      f.focus();
    });
  });
})();
