// Tests de la lógica pura (precios, formato y validación). Correr con: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');

require('../js/modules/utils.js');
require('../js/modules/pricing.js');
require('../js/modules/validators.js');
const { utils, pricing, validators, formatters } = globalThis.RC;

test('formatARS usa separador de miles argentino', () => {
  assert.equal(utils.formatARS(26250), '$26.250');
  assert.equal(utils.formatARS(15000), '$15.000');
});

test('calculateOrder suma cargo por servicio del 5%', () => {
  const order = pricing.calculateOrder('early', 1);
  assert.equal(order.subtotal, 25000);
  assert.equal(order.fee, 1250);
  assert.equal(order.total, 26250);
  assert.equal(pricing.calculateOrder('general', 2).total, 73500);
});

test('calculateOrder limita la cantidad y rechaza planes desconocidos', () => {
  assert.equal(pricing.calculateOrder('virtual', 99).quantity, 6);
  assert.equal(pricing.calculateOrder('virtual', 0).quantity, 1);
  assert.equal(pricing.calculateOrder('virtual', 'abc').quantity, 1);
  assert.equal(pricing.calculateOrder('__proto__', 1), null);
  assert.equal(pricing.calculateOrder('vip', 1), null);
});

test('validadores de datos personales', () => {
  assert.equal(validators.name('Jose Diaz'), '');
  assert.notEqual(validators.name('Jose'), '');
  assert.equal(validators.email('a@b.com'), '');
  assert.notEqual(validators.email('a@b'), '');
  assert.equal(validators.phone('+54 381 555-1234'), '');
  assert.notEqual(validators.phone('1234567'), '');
  assert.notEqual(validators.phone('12345678901234'), '');
});

test('validadores de tarjeta', () => {
  const now = new Date(2026, 9, 24); // 24/10/2026
  assert.equal(validators.cardNumber('4000 0000 0000 0002'), '');
  assert.notEqual(validators.cardNumber('4000 0000 0000'), '');
  assert.equal(validators.cardExpiry('10/26', now), '');
  assert.notEqual(validators.cardExpiry('09/26', now), '');
  assert.notEqual(validators.cardExpiry('13/30', now), '');
  assert.notEqual(validators.cardExpiry('1/30', now), '');
  assert.equal(validators.cardCvc('123'), '');
  assert.equal(validators.cardCvc('1234'), '');
  assert.notEqual(validators.cardCvc('12'), '');
});

test('validadores del formulario de sponsor', () => {
  assert.equal(validators.shortText('Al'), '');
  assert.notEqual(validators.shortText(' a '), '');
  assert.notEqual(validators.required(''), '');
  assert.equal(validators.required('oro'), '');
  assert.equal(validators.logoFile(null), '');
  assert.equal(validators.logoFile({ name: 'logo.SVG', size: 1000 }), '');
  assert.notEqual(validators.logoFile({ name: 'logo.gif', size: 1000 }), '');
  assert.notEqual(validators.logoFile({ name: 'logo.png', size: 5 * 1024 * 1024 + 1 }), '');
});

test('formateadores de tarjeta', () => {
  assert.equal(formatters.cardNumber('4000000000000002999'), '4000 0000 0000 0002');
  assert.equal(formatters.cardExpiry('1227'), '12/27');
  assert.equal(formatters.cardExpiry('1'), '1');
});
