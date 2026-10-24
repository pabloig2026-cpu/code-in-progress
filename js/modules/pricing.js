/* Precios y cálculo del pedido. Única fuente de verdad para checkout y página de error de pago. */
(function (root) {
  'use strict';
  const RC = (root.RC = root.RC || {});

  const PLANS = Object.freeze({
    early: { label: 'Early Bird', price: 25000 },
    general: { label: 'General', price: 35000 },
    virtual: { label: 'Virtual', price: 15000 },
  });

  const SERVICE_FEE = 0.05;
  const MIN_QTY = 1;
  const MAX_QTY = 6;

  function clampQty(qty) {
    const n = Number.parseInt(qty, 10);
    if (Number.isNaN(n)) return MIN_QTY;
    return Math.min(MAX_QTY, Math.max(MIN_QTY, n));
  }

  /** Devuelve null si el plan no existe (por ejemplo, un valor manipulado en la URL). */
  function calculateOrder(planKey, qty) {
    const plan = Object.prototype.hasOwnProperty.call(PLANS, planKey) ? PLANS[planKey] : null;
    if (!plan) return null;
    const quantity = clampQty(qty);
    const subtotal = plan.price * quantity;
    const fee = Math.round(subtotal * SERVICE_FEE);
    return { planKey, label: plan.label, unitPrice: plan.price, quantity, subtotal, fee, total: subtotal + fee };
  }

  RC.pricing = { PLANS, SERVICE_FEE, MIN_QTY, MAX_QTY, clampQty, calculateOrder };
})(typeof window !== 'undefined' ? window : globalThis);
