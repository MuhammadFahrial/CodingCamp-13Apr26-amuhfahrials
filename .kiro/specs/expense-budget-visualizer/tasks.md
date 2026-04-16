# Implementation Plan: Expense & Budget Visualizer

## Overview

Build a single-page, no-build vanilla HTML/CSS/JS expense tracker. Implementation proceeds in layers: file structure → HTML skeleton → storage module → transaction logic → UI rendering → chart integration → validation → wiring everything together.

## Tasks

- [x] 1. Set up project file structure
  - Create `index.html` at the project root
  - Create `css/styles.css`
  - Create `js/app.js`
  - Add a `<script>` tag in `index.html` loading Chart.js from a CDN (no build step)
  - Add a `<link>` tag referencing `css/styles.css`
  - Add a `<script src="js/app.js" defer>` tag
  - _Requirements: 9.1, 9.2, 9.3, 7.2, 5.5_

- [x] 2. Build the HTML structure and base styles
  - [x] 2.1 Write the HTML layout in `index.html`
    - Balance_Display section (`<div id="balance">`)
    - Input_Form with: text input for name, number input for amount, `<select>` for Category (Food, Transport, Fun), submit button, and an error message container
    - Transaction_List (`<ul id="transaction-list">`)
    - Chart container (`<canvas id="spending-chart">`)
    - _Requirements: 1.1, 2.1, 4.1, 5.1_

  - [x] 2.2 Write base CSS in `css/styles.css`
    - Style the form, transaction list (with `overflow-y: auto` for scrollability), balance display, and chart canvas
    - _Requirements: 2.2_

- [x] 3. Implement the Storage module in `js/app.js`
  - [x] 3.1 Write `loadTransactions()` — reads and JSON-parses the transaction array from `localStorage`, returns `[]` if absent
    - _Requirements: 6.1, 6.3_

  - [x] 3.2 Write `saveTransactions(transactions)` — JSON-serializes and writes the array to `localStorage`
    - _Requirements: 6.2, 6.3_

- [x] 4. Implement core transaction logic
  - [x] 4.1 Write `addTransaction(name, amount, category)` — creates a transaction object with a unique `id` (e.g. `Date.now()`), appends it to the in-memory array, and calls `saveTransactions`
    - _Requirements: 1.2, 1.3, 6.2_

  - [x] 4.2 Write `deleteTransaction(id)` — filters the transaction out of the in-memory array and calls `saveTransactions`
    - _Requirements: 3.2, 3.3, 6.2_

  - [x] 4.3 Write `getTotalBalance(transactions)` — returns the sum of all transaction amounts
    - _Requirements: 4.1, 4.4_

  - [ ]* 4.4 Write unit tests for `getTotalBalance`
    - Empty array → 0
    - Single transaction → its amount
    - Multiple transactions → correct sum
    - _Requirements: 4.1, 4.4_

  - [x] 4.5 Write `getCategoryTotals(transactions)` — returns an object mapping each category to its summed amount (only categories with at least one transaction)
    - _Requirements: 5.1_

  - [ ]* 4.6 Write unit tests for `getCategoryTotals`
    - Empty array → empty object
    - Single category → correct total
    - Multiple categories → correct totals per category
    - _Requirements: 5.1_

- [ ] 5. Checkpoint — verify storage and logic functions work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement UI rendering functions
  - [x] 6.1 Write `renderTransactionList(transactions)` — clears and re-renders the `<ul>` with one `<li>` per transaction showing name, amount, category, and a delete button wired to `deleteTransaction`
    - _Requirements: 2.1, 2.3, 3.1, 3.2_

  - [x] 6.2 Write `renderBalance(transactions)` — updates the `#balance` element with the result of `getTotalBalance`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.3 Write `renderChart(transactions)` — uses Chart.js to draw/update a pie chart on `#spending-chart` using `getCategoryTotals`; shows a placeholder/empty state when there are no transactions
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x] 6.4 Write `renderAll(transactions)` — calls `renderTransactionList`, `renderBalance`, and `renderChart` in sequence; this is the single re-render entry point
    - _Requirements: 2.3, 4.2, 4.3, 5.2, 5.3, 8.2_

- [x] 7. Implement form validation and submission
  - [x] 7.1 Write `validateForm(name, amount)` — returns an array of error messages; checks that name is non-empty, amount is present, and amount is a positive number
    - _Requirements: 1.5, 1.6_

  - [ ]* 7.2 Write unit tests for `validateForm`
    - All fields valid → no errors
    - Empty name → error for name
    - Missing amount → error for amount
    - Zero or negative amount → error for amount
    - _Requirements: 1.5, 1.6_

  - [x] 7.3 Wire the form's `submit` event in `js/app.js`
    - Call `validateForm`; if errors exist, display them in the error container and return early
    - If valid: call `addTransaction`, call `renderAll`, reset the form, clear any error messages
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 8. Wire delete controls to re-render
  - Ensure each delete button's click handler calls `deleteTransaction` then `renderAll`
  - _Requirements: 3.2, 3.3, 4.3, 5.3, 6.2_

- [ ] 9. Implement app initialization
  - On `DOMContentLoaded`, call `loadTransactions` to populate the in-memory array, then call `renderAll`
  - _Requirements: 6.1, 4.4, 5.4, 8.1_

- [x] 10. Final checkpoint — full integration check
  - Open `index.html` directly in a browser (no server needed) and verify: add transactions, see list/balance/chart update, delete transactions, refresh page and confirm data persists
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- The app uses no build tools — Chart.js is loaded via CDN `<script>` tag
- All data stays in `localStorage` — no network requests
- `renderAll` is the single source of truth for UI updates, keeping state management simple
