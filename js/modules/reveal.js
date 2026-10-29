
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});
  const { prefersReducedMotion } = RC.utils;

  const COUNT_DURATION = 1400;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function countUp(el) {
    const target = Number(el.dataset.count);
    if (prefersReducedMotion()) {
      el.textContent = target;
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / COUNT_DURATION);
      el.textContent = Math.round(target * easeOut(progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function fillProgress(el) {
    el.style.setProperty('--progress', `${el.dataset.progress}%`);
  }

  function activate(el) {
    el.classList.add('is-visible');
    el.querySelectorAll('[data-count]').forEach(countUp);
    el.querySelectorAll('[data-progress]').forEach(fillProgress);
  }

  function init() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in root)) {
      items.forEach(activate);
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          activate(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    items.forEach((item) => observer.observe(item));
  }

  RC.reveal = { init };
})(window);
