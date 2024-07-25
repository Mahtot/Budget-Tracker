var balance = parseFloat(localStorage.getItem('balance')) || 0;
var expense = parseFloat(localStorage.getItem('expense')) || 0;
var income = parseFloat(localStorage.getItem('income')) || 0;
var transactions = JSON.parse(localStorage.getItem('transactions')) || [];
var form = document.getElementById('form');
var displayElement = document.getElementById('value');
var transactionContentDiv = document.getElementById('old-transaction-content');

function resetButtonStyles() {
    document.querySelectorAll('button').forEach(button => {
        button.classList.remove('active-button');
    });
}

form.addEventListener('submit', function(event) {
    event.preventDefault();

    var reason = document.getElementById('reason').value;
    var amount = parseFloat(document.getElementById('amount').value);
    var transactionType = document.querySelector('input[name="transactionType"]:checked').value;

    if (transactionType === 'expense' && amount > balance) {
        alert('Insufficient Balance, unable to process the transaction!');
        return;
    }

    switch(transactionType) {
        case 'income':
            balance += amount;
            income += amount;
            break;
        case 'expense':
            balance -= amount;
            expense += amount;
            break;
    }

    var newTransaction = {
        reason: reason,
        amount: amount,
        transactionType: transactionType
    };

    transactions.push(newTransaction);
    saveDataToLocalStorage();
    alert('Transaction successfully saved!');
    renderTransactions(); 

    // Clear input fields after successful submission
    document.getElementById('reason').value = '';
    document.getElementById('amount').value = '';
    document.querySelector('input[name="transactionType"]:checked').checked = false; 
});

// Function to update the displayed value
function updateDisplay(value) {
    displayElement.textContent = "$" + value;
}

// Event listeners for buttons
document.getElementById('balanceBtn').addEventListener('click', function() {
    resetButtonStyles();
    this.classList.add('active-button');
    updateDisplay(balance);
});

document.getElementById('incomeBtn').addEventListener('click', function() {
    resetButtonStyles();
    this.classList.add('active-button');
    updateDisplay(income);
});

document.getElementById('expenseBtn').addEventListener('click', function() {
    resetButtonStyles();
    this.classList.add('active-button');
    updateDisplay(expense);
});

// Display different contents based on either new or old transaction clicked
document.getElementById('newTransaction').addEventListener('click', function() {
    document.getElementById('newTransaction').classList.add('active-transaction');
    document.getElementById('oldTransaction').classList.remove('active-transaction');
    document.getElementById('old-transaction-content').classList.add('hide-transaction');
    document.getElementById('form').classList.remove('hide-transaction');
});

document.getElementById('oldTransaction').addEventListener('click', function() {
    document.getElementById('oldTransaction').classList.add('active-transaction');
    document.getElementById('newTransaction').classList.remove('active-transaction');

    document.getElementById('form').classList.add('hide-transaction');
    document.getElementById('old-transaction-content').classList.remove('hide-transaction');
    renderTransactions(); 
});

// Function to render transactions
function renderTransactions() {
    transactionContentDiv.innerHTML = ''; // Clear existing content

    if (transactions.length === 0) {
        var noTransactionDiv = document.createElement('div');
        noTransactionDiv.className = 'no-transactions-message';
        noTransactionDiv.textContent = "😢 No transactions, please add your transactions here and they'll be listed below.";
        transactionContentDiv.appendChild(noTransactionDiv);
    } else {
        transactions.forEach((item, index) => {
            var transactionDiv = document.createElement('div');
            transactionDiv.className = 'transaction-item flex items-center justify-between p-3 my-2 rounded-lg shadow-md';

            // Create and style elements
            var idElem = document.createElement('div');
            idElem.className = 'transaction-id text-lg font-medium text-white';
            idElem.textContent = `${index + 1}`;

            var reasonElem = document.createElement('div');
            reasonElem.className = 'transaction-detail';
            reasonElem.textContent = item.reason;

            var amountElem = document.createElement('div');
            amountElem.className = 'transaction-detail text-lg font-medium';
            amountElem.textContent = `$${item.amount.toFixed(2)}`;

            var typeElem = document.createElement('div');
            typeElem.className = `transaction-detail text-lg font-medium ${item.transactionType === 'income' ? 'text-green-500' : 'text-red-500'}`;
            typeElem.textContent = item.transactionType === 'income' ? '+' : '-';

            // Create Edit Button
            var editElem = document.createElement('button');
            editElem.className = 'edit-btn bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors';
            editElem.textContent = 'Edit';
            editElem.addEventListener('click', function() {
                document.getElementById('reason').value = item.reason;
                document.getElementById('amount').value = item.amount;
                document.querySelector(`input[name="transactionType"][value="${item.transactionType}"]`).checked = true;

                // return to add new transaction
                document.getElementById('newTransaction').classList.add('active-transaction');
                document.getElementById('oldTransaction').classList.remove('active-transaction');
                document.getElementById('old-transaction-content').classList.add('hide-transaction');
                document.getElementById('form').classList.remove('hide-transaction');

                renderTransactions();
            });

            // Create Delete Button
            var delElem = document.createElement('button');
            delElem.className = 'del-btn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors';
            delElem.textContent = 'Delete';
            delElem.addEventListener('click', function() {
                // Remove the transaction from the list
                transactions.splice(index, 1);
                saveDataToLocalStorage();
                renderTransactions();
            });

            // Append elements to transactionDiv
            transactionDiv.appendChild(idElem);
            transactionDiv.appendChild(reasonElem);
            transactionDiv.appendChild(amountElem);
            transactionDiv.appendChild(typeElem);
            transactionDiv.appendChild(editElem);
            transactionDiv.appendChild(delElem);

            // Append transactionDiv to the container
            transactionContentDiv.appendChild(transactionDiv);
        });
    }
}

// Save data to local storage
function saveDataToLocalStorage() {
    localStorage.setItem('balance', balance);
    localStorage.setItem('expense', expense);
    localStorage.setItem('income', income);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Handle the "my transactions" button click
document.getElementById('my-transactions').addEventListener('click', function(){
    document.getElementById('oldTransaction').classList.add('active-transaction');
    document.getElementById('newTransaction').classList.remove('active-transaction');

    document.getElementById('form').classList.add('hide-transaction');
    document.getElementById('old-transaction-content').classList.remove('hide-transaction');
    renderTransactions(); 

    // Smooth scroll to the old transactions section
    document.getElementById('old-transaction-content').scrollIntoView({
        behavior: 'smooth'
    });
});

// Initial rendering of transactions and display
renderTransactions();
updateDisplay(balance);
