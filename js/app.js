// app.js

/**
 * Loads transactions from localStorage.
 * Returns [] if the key is absent or if JSON parsing fails.
 * @returns {Array}
 */
function loadTransactions() {
  try {
    const raw = localStorage.getItem("transactions");
    if (raw === null) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

/**
 * Saves transactions to localStorage under the key "transactions".
 * Logs a console warning if the write fails (e.g. private browsing, quota exceeded).
 * @param {Array} transactions
 */
function saveTransactions(transactions) {
  try {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  } catch (e) {
    console.warn("saveTransactions: could not write to localStorage.", e);
  }
}

// In-memory transactions array (populated on DOMContentLoaded)
let transactions = [];

/**
 * Creates a new transaction and appends it to the in-memory array.
 * Persists the updated array to localStorage.
 * @param {string} name
 * @param {number} amount
 * @param {string} category - "Food" | "Transport" | "Fun"
 */
function addTransaction(name, amount, category) {
  const transaction = {
    id: Date.now(),
    name,
    amount,
    category,
  };
  transactions.push(transaction);
  saveTransactions(transactions);
}

/**
 * Removes the transaction with the given id from the in-memory array.
 * Persists the updated array to localStorage.
 * @param {number} id
 */
function deleteTransaction(id) {
  transactions = transactions.filter(function (t) {
    return t.id !== id;
  });
  saveTransactions(transactions);
}

/**
 * Returns the sum of all transaction amounts.
 * Returns 0 for an empty array.
 * @param {Array} txns
 * @returns {number}
 */
function getTotalBalance(txns) {
  return txns.reduce(function (sum, t) {
    return sum + t.amount;
  }, 0);
}

/**
 * Returns an object mapping each category to its summed amount.
 * Only includes categories that have at least one transaction.
 * Returns {} for an empty array.
 * @param {Array} txns
 * @returns {Object}
 */
function getCategoryTotals(txns) {
  return txns.reduce(function (totals, t) {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
    return totals;
  }, {});
}

// ─── Rendering Layer ────────────────────────────────────────────────────────

let chartInstance = null;

/**
 * Clears and re-renders the #transaction-list <ul>.
 * Each <li> shows: name, amount, category, and a delete button.
 * @param {Array} txns
 */
function renderTransactionList(txns) {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";

  txns.forEach(function (t) {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "tx-info";

    const nameSpan = document.createElement("span");
    nameSpan.className = "tx-name";
    nameSpan.textContent = t.name;

    const metaSpan = document.createElement("span");
    metaSpan.className = "tx-meta";
    metaSpan.textContent = t.category;

    info.appendChild(nameSpan);
    info.appendChild(metaSpan);

    const amountSpan = document.createElement("span");
    amountSpan.className = "tx-amount";
    amountSpan.textContent = "$" + t.amount.toFixed(2);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "tx-delete";
    deleteBtn.setAttribute("aria-label", "Delete " + t.name);
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteTransaction(t.id);
      renderAll(transactions);
    });

    li.appendChild(info);
    li.appendChild(amountSpan);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

/**
 * Updates the #balance element with the current total.
 * @param {Array} txns
 */
function renderBalance(txns) {
  const balanceEl = document.getElementById("balance");
  const total = getTotalBalance(txns);
  const amountEl = balanceEl.querySelector(".balance-amount");
  if (amountEl) {
    amountEl.textContent = "$" + total.toFixed(2);
  } else {
    balanceEl.textContent = "$" + total.toFixed(2);
  }
}

/**
 * Draws/updates a Chart.js pie chart on #spending-chart.
 * Destroys the previous instance before creating a new one.
 * Shows nothing when there are no transactions.
 * @param {Array} txns
 */
function renderChart(txns) {
  const totals = getCategoryTotals(txns);
  const labels = Object.keys(totals);
  const data = Object.values(totals);

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (labels.length === 0) {
    return;
  }

  if (!window.Chart) {
    console.error("renderChart: Chart.js is not loaded.");
    return;
  }

  chartInstance = new Chart(document.getElementById("spending-chart"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        { data: data, backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] },
      ],
    },
  });
}

/**
 * Re-renders all data-driven UI: list, balance, and chart.
 * This is the ONLY function that touches the DOM for data display.
 * @param {Array} txns
 */
function renderAll(txns) {
  renderTransactionList(txns);
  renderBalance(txns);
  renderChart(txns);
}

// ─── Validation Layer ────────────────────────────────────────────────────────

/**
 * Validates the form inputs and returns an array of error message strings.
 * Returns [] if all inputs are valid.
 * @param {string} name
 * @param {string} amount
 * @returns {string[]}
 */
function validateForm(name, amount) {
  const errors = [];
  if (!name.trim()) {
    errors.push("Item name is required.");
  }
  if (amount === "" || amount === null || amount === undefined) {
    errors.push("Amount is required.");
  } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
    errors.push("Amount must be a positive number.");
  }
  return errors;
}

// ─── Initialization ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function () {
  transactions = loadTransactions();
  renderAll(transactions);

  document
    .getElementById("transaction-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const amount = document.getElementById("amount").value;
      const category = document.getElementById("category").value;
      const errorMsg = document.getElementById("error-msg");

      const errors = validateForm(name, amount);

      if (errors.length > 0) {
        errorMsg.textContent = errors.join(" ");
        return;
      }

      errorMsg.textContent = "";
      addTransaction(name.trim(), parseFloat(amount), category);
      renderAll(transactions);
      e.target.reset();
    });
});
