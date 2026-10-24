/* Contador Early Bird. Cuenta hacia data-deadline (hora local). Al llegar a cero emite "rc:earlybird-ended"
   para que checkout y planes reaccionen sin acoplarse a este módulo. */
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});
  const { pad2, replayAnimation } = RC.utils;

  const ENDED_EVENT = 'rc:earlybird-ended';

  function splitTime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  }

  function disableEarlyBirdPlan() {
    const card = document.querySelector('[data-plan-card="early"]');
    if (!card) return;
    card.classList.add('is-disabled');
    card.setAttribute('aria-disabled', 'true');
    const button = card.querySelector('[data-select-plan]');
    if (button) {
      button.setAttribute('aria-disabled', 'true');
      button.setAttribute('tabindex', '-1');
      button.textContent = 'Early Bird agotado';
    }
  }

  function init() {
    const el = document.querySelector('[data-deadline]');
    if (!el) return;
    const deadline = new Date(el.dataset.deadline).getTime();
    const units = {};
    el.querySelectorAll('[data-unit]').forEach((node) => (units[node.dataset.unit] = node));
    const title = document.querySelector('[data-countdown-title]');
    let timer = null;

    function finish() {
      clearInterval(timer);
      if (title) title.textContent = 'El precio especial ya terminó';
      el.classList.add('is-ended');
      disableEarlyBirdPlan();
      document.dispatchEvent(new CustomEvent(ENDED_EVENT));
    }

    function render() {
      const remaining = deadline - Date.now();
      const parts = splitTime(remaining);
      Object.entries(parts).forEach(([unit, value]) => {
        const node = units[unit];
        if (!node) return;
        const text = pad2(value);
        if (node.textContent !== text) {
          node.textContent = text;
          replayAnimation(node, 'is-tick');
        }
      });
      if (remaining <= 0) finish();
    }

    render();
    if (deadline > Date.now()) timer = setInterval(render, 1000);
  }

  RC.countdown = { init, splitTime, ENDED_EVENT };
})(window);
