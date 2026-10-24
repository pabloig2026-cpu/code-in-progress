/* Utilidades compartidas. Módulos clásicos sobre el namespace RC para que funcione abriendo el HTML sin servidor. */
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});

  const arsFormatter = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });

  /** 26250 -> "$26.250" */
  function formatARS(amount) {
    return '$' + arsFormatter.format(amount);
  }

  function prefersReducedMotion() {
    return typeof root.matchMedia === 'function' &&
      root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Reinicia una animación CSS de una sola vez (rebote del total, cambio de dígito, destello de agenda). */
  function replayAnimation(el, className) {
    if (!el || prefersReducedMotion()) return;
    el.classList.remove(className);
    void el.offsetWidth; // fuerza reflow para que la animación vuelva a arrancar
    el.classList.add(className);
    el.addEventListener('animationend', () => el.classList.remove(className), { once: true });
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  RC.utils = { formatARS, prefersReducedMotion, replayAnimation, pad2 };
})(typeof window !== 'undefined' ? window : globalThis);
