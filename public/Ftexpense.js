async function lsaveexpense(event) {
    event.preventDefault();

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    try {
        const token = localStorage.getItem('token');
        await axios.post('/expense/add', {
            amount,
            description,
            category
        }, {
            headers: { "Authorization": `${token}` }
        });
        loadExpenses(); // Reload expenses after adding a new one
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}

async function loadExpenses() {
    try {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const response = await axios.get('/expense/history', {
            headers: { "Authorization": `${token}` }
        });

        const expenses = response.data;

        const expensesDiv = document.getElementById('priveios expense');
        expensesDiv.innerHTML = ''; // Clear existing content

        const ul = document.createElement('ul');

        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.textContent = `${expense.amount} - ${expense.description} - ${expense.category}`;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = async () => {
                await deleteExpense(expense.id);
                loadExpenses(); // Reload expenses after deletion
            };
            
            li.appendChild(deleteButton);
            ul.appendChild(li);
        });

        expensesDiv.appendChild(ul);
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

async function deleteExpense(id) {
    try {
        await axios.post('/expense/delete', { id });
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

// Load expenses when the page loads
window.onload = loadExpenses;
