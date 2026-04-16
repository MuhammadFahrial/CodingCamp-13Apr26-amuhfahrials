# Requirements Document

## Introduction

The Expense & Budget Visualizer is a client-side web application that allows users to track personal expenses by adding transactions with a name, amount, and category. It displays a running total balance, a scrollable transaction list with delete capability, and a live pie chart showing spending distribution by category. All data is persisted in the browser's Local Storage. The app requires no backend, no build tools, and no framework — just HTML, CSS, and Vanilla JavaScript.

## Glossary

- **App**: The Expense & Budget Visualizer web application.
- **Transaction**: A single expense entry consisting of an item name, a monetary amount, and a category.
- **Input_Form**: The UI form used to enter and submit a new Transaction.
- **Transaction_List**: The scrollable UI component that displays all stored Transactions.
- **Balance_Display**: The UI element at the top of the App that shows the total of all Transaction amounts.
- **Chart**: The pie chart UI component that visualizes spending distribution by category.
- **Storage**: The browser's Local Storage API used to persist Transaction data client-side.
- **Category**: One of three predefined labels for a Transaction — Food, Transport, or Fun.

---

## Requirements

### Requirement 1: Add a Transaction

**User Story:** As a user, I want to fill out a form and submit a new expense, so that I can record my spending.

#### Acceptance Criteria

1. THE Input_Form SHALL provide a text field for item name, a numeric field for amount, and a dropdown selector for Category (Food, Transport, Fun).
2. WHEN the user submits the Input_Form with all fields filled, THE App SHALL add the Transaction to the Transaction_List.
3. WHEN the user submits the Input_Form with all fields filled, THE App SHALL persist the Transaction to Storage.
4. WHEN the user submits the Input_Form with all fields filled, THE Input_Form SHALL reset all fields to their default empty state.
5. IF the user submits the Input_Form with one or more empty fields, THEN THE Input_Form SHALL display a validation error message indicating which fields are missing.
6. IF the user submits the Input_Form with an amount that is not a positive number, THEN THE Input_Form SHALL display a validation error message indicating the amount is invalid.

---

### Requirement 2: View Transaction List

**User Story:** As a user, I want to see all my recorded expenses in a list, so that I can review my spending history.

#### Acceptance Criteria

1. THE Transaction_List SHALL display all stored Transactions, each showing the item name, amount, and Category.
2. WHILE the number of Transactions exceeds the visible area, THE Transaction_List SHALL be scrollable.
3. WHEN a Transaction is added or deleted, THE Transaction_List SHALL update immediately to reflect the current set of Transactions.

---

### Requirement 3: Delete a Transaction

**User Story:** As a user, I want to remove an expense from the list, so that I can correct mistakes or remove outdated entries.

#### Acceptance Criteria

1. THE Transaction_List SHALL display a delete control for each Transaction.
2. WHEN the user activates the delete control for a Transaction, THE App SHALL remove that Transaction from the Transaction_List.
3. WHEN the user activates the delete control for a Transaction, THE App SHALL remove that Transaction from Storage.

---

### Requirement 4: Display Total Balance

**User Story:** As a user, I want to see my total spending at a glance, so that I know how much I have spent overall.

#### Acceptance Criteria

1. THE Balance_Display SHALL show the sum of all Transaction amounts.
2. WHEN a Transaction is added, THE Balance_Display SHALL update to reflect the new total.
3. WHEN a Transaction is deleted, THE Balance_Display SHALL update to reflect the new total.
4. WHEN no Transactions exist, THE Balance_Display SHALL show a total of zero.

---

### Requirement 5: Visualize Spending by Category

**User Story:** As a user, I want to see a pie chart of my spending by category, so that I can understand where my money is going.

#### Acceptance Criteria

1. THE Chart SHALL display a pie chart with one segment per Category that has at least one Transaction.
2. WHEN a Transaction is added, THE Chart SHALL update to reflect the new spending distribution.
3. WHEN a Transaction is deleted, THE Chart SHALL update to reflect the new spending distribution.
4. WHEN no Transactions exist, THE Chart SHALL display an empty or placeholder state.
5. THE Chart SHALL use Chart.js or an equivalent client-side charting library loaded without a build step.

---

### Requirement 6: Persist Data Across Sessions

**User Story:** As a user, I want my transactions to be saved between browser sessions, so that I do not lose my data when I close or refresh the page.

#### Acceptance Criteria

1. WHEN the App initializes, THE App SHALL load all previously stored Transactions from Storage and render them in the Transaction_List, Balance_Display, and Chart.
2. WHEN a Transaction is added or deleted, THE App SHALL write the updated Transaction set to Storage immediately.
3. THE Storage SHALL store all Transaction data client-side only, with no data sent to any external server.

---

### Requirement 7: Browser Compatibility

**User Story:** As a user, I want the App to work in any modern browser, so that I can use it regardless of my preferred browser.

#### Acceptance Criteria

1. THE App SHALL function correctly in the current stable versions of Chrome, Firefox, Edge, and Safari.
2. THE App SHALL operate as a standalone web page without requiring installation or a backend server.

---

### Requirement 8: Performance and Responsiveness

**User Story:** As a user, I want the App to feel fast and responsive, so that adding and deleting transactions does not feel sluggish.

#### Acceptance Criteria

1. WHEN the App is opened, THE App SHALL render the initial UI within 2 seconds on a standard broadband connection.
2. WHEN a Transaction is added or deleted, THE App SHALL update the Transaction_List, Balance_Display, and Chart within 100 milliseconds.

---

### Requirement 9: Code and File Structure

**User Story:** As a developer, I want the codebase to follow a simple, predictable structure, so that the project is easy to read and maintain.

#### Acceptance Criteria

1. THE App SHALL contain exactly one CSS file located inside a `css/` directory.
2. THE App SHALL contain exactly one JavaScript file located inside a `js/` directory.
3. THE App SHALL be launchable by opening a single `index.html` file directly in a browser with no build step required.
