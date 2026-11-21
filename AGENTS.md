# ShopLedger

ShopLedger is a Node.js and Express shop billing app with a vanilla browser UI and a JSON store.

- `server.js` serves `public/`, mounts `routes/`, and serves printable invoices.
- `lib/pricing.js`, `lib/coupons.js`, and `lib/tax.js` calculate checkout totals.
- `lib/invoice.js` builds invoice figures and HTML. `lib/reports.js` reconciles invoices with orders.
- `lib/inventory.js`, `lib/orders.js`, and `lib/ledger.js` handle stock, orders, and customer credit.
- `config.js` holds shop settings, tax rates, and coupons. `lib/store.js` persists `data/db.json`.

Run `npm install` to install dependencies, `npm start` to serve the app, and `node --test` to run tests. Keep the generated lockfile out of the workshop commit.

## Workshop rules

1. Read the relevant code before editing.
2. Characterize current behavior and reproduce the bug before applying the fix.
3. Use in-memory test fixtures. Tests must never read or write `data/db.json`.
4. Make the smallest fix within the ticket scope.
5. Review the diff and test results before opening the PR.

Ticket 1 covers invoice and GST mismatches. Keep production edits in `lib/invoice.js`, with `lib/tax.js` allowed only if needed. Put invoice tests in `test/invoice.test.js` and the workshop architecture diagram in `docs/architecture.svg`.
