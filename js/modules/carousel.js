
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});

  function setup(controls) {
    const track = document.getElementById(controls.dataset.carouselControls);
    if (!track) return;
    const items = [...track.children];
    const dotsBox = controls.querySelector('.carousel-dots');
    const dots = items.map(() => dotsBox.appendChild(document.createElement('span')));

    // Índice = el ítem cuyo centro está más cerca del centro visible del track.
    function currentIndex() {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      items.forEach((item, i) => {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const bestCenter = items[best].offsetLeft + items[best].offsetWidth / 2;
        if (Math.abs(itemCenter - center) < Math.abs(bestCenter - center)) best = i;
      });
      return best;
    }

    function paint() {
      const index = currentIndex();
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    }

    function goTo(index) {
      const item = items[Math.max(0, Math.min(items.length - 1, index))];
      const left = item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2;
      track.scrollTo({ left, behavior: RC.utils.prefersReducedMotion() ? 'auto' : 'smooth' });
    }

    let frame = 0;
    track.addEventListener(
      'scroll',
      () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(paint);
      },
      { passive: true }
    );

    controls.querySelectorAll('[data-carousel-step]').forEach((btn) =>
      btn.addEventListener('click', () => goTo(currentIndex() + Number(btn.dataset.carouselStep)))
    );

    paint();
  }

  function init() {
    document.querySelectorAll('[data-carousel-controls]').forEach(setup);
  }

  RC.carousel = { init };
})(window);
