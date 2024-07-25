var balance = 0;
var expense = 0;
var income = 0;
var transactions = [];
var form = document.getElementById('form');
var displayElement = document.getElementById('value'); // the displayed value
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
    this.classList.add('active-button')
    updateDisplay(balance);
});

document.getElementById('incomeBtn').addEventListener('click', function() {
    resetButtonStyles();
    this.classList.add('active-button')
    updateDisplay(income);
});

document.getElementById('expenseBtn').addEventListener('click', function() {
   resetButtonStyles();
   this.classList.add('active-button')
    updateDisplay(expense);
});

// Display different contents based on the either new or old transaction clicked
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
            var id = document.createElement('div');
            id.textContent = index;

            var reasonElem = document.createElement('div');
            reasonElem.className = 'transaction-detail text-lg font-medium';
            reasonElem.textContent = item.reason;

            var amountElem = document.createElement('div');
            amountElem.className = 'transaction-detail text-lg font-medium';
            amountElem.textContent = `$${item.amount.toFixed(2)}`;

            var typeElem = document.createElement('div');
            typeElem.className = `transaction-detail text-lg font-medium ${item.transactionType === 'income' ? 'text-green-500' : 'text-red-500'}`;
            typeElem.textContent = item.transactionType === 'income' ? '+' : '-';
           
            var delElem = document.createElement('button');
            delElem.className = `del-btn`;
            delElem.textContent = 'Delete';

            // Append elements based on transaction type
            transactionDiv.appendChild(id);
            transactionDiv.appendChild(reasonElem);
            transactionDiv.appendChild(amountElem);
            transactionDiv.appendChild(typeElem);
            transactionDiv.appendChild(delElem);

            transactionContentDiv.appendChild(transactionDiv);
        });
    }
}



// handle the "ny transactions button click"
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
})
renderTransactions();
