
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});
  const { formatARS, replayAnimation } = RC.utils;
  const { calculateOrder, clampQty, MIN_QTY, MAX_QTY } = RC.pricing;

  const ERROR_PAGE = 'error-pago.html';

  function init() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    const section = document.getElementById('checkout');
    const qtyInput = form.querySelector('#qty');
    const qtyButtons = form.querySelectorAll('[data-qty-step]');
    const payLabel = form.querySelector('[data-pay-label]');
    const errorModalEl = document.getElementById('paymentErrorModal');
    const summary = {
      line: section.querySelector('[data-summary="line"]'),
      lineAmount: section.querySelector('[data-summary="line-amount"]'),
      fee: section.querySelector('[data-summary="fee"]'),
      total: section.querySelector('[data-summary="total"]'),
    };

    const selectedPlan = () => form.querySelector('input[name="plan"]:checked').value;
    const selectedPayment = () => form.querySelector('input[name="payment"]:checked').value;

    function updateSummary() {
      const qty = clampQty(qtyInput.value);
      qtyInput.value = qty;
      qtyButtons.forEach((btn) => {
        const step = Number(btn.dataset.qtyStep);
        btn.disabled = (step < 0 && qty <= MIN_QTY) || (step > 0 && qty >= MAX_QTY);
      });

      const order = calculateOrder(selectedPlan(), qty);
      summary.line.textContent = `Entrada ${order.label} x ${order.quantity}`;
      summary.lineAmount.textContent = formatARS(order.subtotal);
      summary.fee.textContent = formatARS(order.fee);
      summary.total.textContent = formatARS(order.total);
      payLabel.textContent = `Pagar ${formatARS(order.total)}`;
      [summary.total, payLabel].forEach((el) => replayAnimation(el, 'is-bump'));
      return order;
    }

    function updatePaymentPanels() {
      const method = selectedPayment();
      form.querySelectorAll('[data-payment-panel]').forEach((panel) => {
        const active = panel.dataset.paymentPanel === method;
        panel.hidden = !active;
        panel.disabled = !active; // fieldset deshabilitado = sus campos no se validan ni se envían
      });
    }

    function selectPlan(planKey) {
      const radio = form.querySelector(`input[name="plan"][value="${planKey}"]`);
      if (!radio || radio.disabled) return;
      radio.checked = true;
      updateSummary();
    }

    function showPaymentError(order) {
      if (!errorModalEl || !root.bootstrap) {
        const params = new URLSearchParams({ plan: order.planKey, qty: String(order.quantity) });
        root.location.href = `${ERROR_PAGE}?${params}`;
        return;
      }
      const field = (key) => errorModalEl.querySelector(`[data-error="${key}"]`);
      field('line').textContent = `Entrada ${order.label} x ${order.quantity}`;
      field('line-amount').textContent = formatARS(order.subtotal);
      field('fee').textContent = formatARS(order.fee);
      field('total').textContent = formatARS(order.total);
      root.bootstrap.Modal.getOrCreateInstance(errorModalEl).show();
    }

    form.addEventListener('change', (event) => {
      if (event.target.name === 'plan' || event.target === qtyInput) updateSummary();
      if (event.target.name === 'payment') updatePaymentPanels();
    });

    qtyButtons.forEach((btn) =>
      btn.addEventListener('click', () => {
        qtyInput.value = clampQty(Number(qtyInput.value) + Number(btn.dataset.qtyStep));
        updateSummary();
      })
    );

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!RC.formValidation.validateForm(form)) return;
      showPaymentError(updateSummary());
    });

    document.querySelectorAll('[data-select-plan]').forEach((link) =>
      link.addEventListener('click', (event) => {
        if (link.getAttribute('aria-disabled') === 'true') {
          event.preventDefault();
          return;
        }
        selectPlan(link.dataset.selectPlan);
      })
    );

    document.addEventListener(RC.countdown.ENDED_EVENT, () => {
      const early = form.querySelector('input[name="plan"][value="early"]');
      early.disabled = true;
      early.closest('.ticket-option')?.classList.add('is-disabled');
      if (early.checked) selectPlan('general');
    });

    RC.formValidation.bind(form);
    updatePaymentPanels();
    updateSummary();
  }

  RC.checkout = { init };
})(window);
