const assert = require('node:assert/strict');
const test = require('node:test');
const invoice = require('../lib/invoice');

function makeOrder(items, coupon) {
  return { items, coupon };
}

test('an 18% line without a coupon keeps its gross amount and GST', () => {
  const result = invoice.computeInvoiceFigures(makeOrder([
    { name: 'Tea', sku: 'TEA', hsn: '0902', price: 250, qty: 2 }
  ]));
  assert.equal(result.total, 590);
  assert.deepEqual(result.rows, [
    { name: 'Tea', sku: 'TEA', hsn: '0902', price: 250, qty: 2, gstPercent: 18, line: 500, lineTax: 90 }
  ]);
});

test('SAVE10 applies before HSN-based GST on order #1002 amounts', () => {
  const result = invoice.computeInvoiceFigures(makeOrder([
    { hsn: '1006', price: 1020, qty: 1 }
  ], 'SAVE10'));
  assert.deepEqual(
    [result.subtotal, result.discount, result.tax, result.total, result.cgst, result.sgst],
    [1020, 102, 45.9, 963.9, 22.95, 22.95]
  );
  assert.equal(result.rows[0].gstPercent, 5);
  assert.equal(result.rows[0].lineTax, 45.9);
});

test('SAVE10 is capped at ₹150', () => {
  const result = invoice.computeInvoiceFigures(makeOrder([
    { hsn: '1006', price: 2240, qty: 1 }
  ], 'SAVE10'));
  assert.equal(result.discount, 150);
  assert.equal(result.tax, 104.5);
  assert.equal(result.total, 2194.5);
});

test('mixed HSN rates are applied to their own lines without a coupon', () => {
  const result = invoice.computeInvoiceFigures(makeOrder([
    { hsn: '1006', price: 100, qty: 1 },
    { hsn: '0405', price: 200, qty: 1 }
  ]));
  assert.deepEqual(result.rows.map(row => row.gstPercent), [5, 12]);
  assert.deepEqual(result.rows.map(row => row.lineTax), [5, 24]);
  assert.equal(result.total, 329);
});
