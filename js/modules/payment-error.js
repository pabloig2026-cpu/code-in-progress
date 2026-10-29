
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});

  function init() {
    const summary = document.querySelector('[data-error-summary]');
    if (!summary) return;
    const params = new URLSearchParams(root.location.search);
    const order = RC.pricing.calculateOrder(params.get('plan'), params.get('qty'));
    if (!order) return; // sin datos válidos queda oculto

    summary.querySelector('[data-error="line"]').textContent = `Entrada ${order.label} x ${order.quantity}`;
    summary.querySelector('[data-error="line-amount"]').textContent = RC.utils.formatARS(order.subtotal);
    summary.querySelector('[data-error="fee"]').textContent = RC.utils.formatARS(order.fee);
    summary.querySelector('[data-error="total"]').textContent = RC.utils.formatARS(order.total);
    summary.hidden = false;
  }

  RC.paymentError = { init };
})(window);
