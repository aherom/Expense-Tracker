document.getElementById('filter').onchange = () => {
    const filter = document.getElementById('filter').value;
    document.getElementById('date-picker').style.display = filter === 'date' ? 'block' : 'none';
    document.getElementById('month-picker').style.display = filter === 'month' ? 'block' : 'none';
    document.getElementById('year-picker').style.display = filter === 'year' ? 'block' : 'none';
    
    if (filter === 'all') {
        loadExpenses(filter);
    }
};

document.getElementById('daily-date').onchange = () => {
    const date = document.getElementById('daily-date').value;
    loadExpenses('date', date);
};

document.getElementById('monthly-date').onchange = () => {
    const date = document.getElementById('monthly-date').value;
    loadExpenses('month', date);
};

document.getElementById('yearly-date').onchange = () => {
    const year = document.getElementById('yearly-date').value;
    loadExpenses('year', year);
};

async function loadExpenses(filter, date) {
    try {
        const token = localStorage.getItem('token');
        let response;
       
            response = await axios.get('/expense/history', {
                headers: { "Authorization": `${token}` }
            });
        
       console.log(response.data);

        const expenses = response.data;
        const expensesDiv = document.getElementById('priveios expense');
        expensesDiv.innerHTML = '';

        const ul = document.createElement('ul');

        expenses.forEach(expense => {
            if (filter === 'all' || filterCriteria(expense, filter, date)) {
            const li = document.createElement('li');
            li.textContent = `${expense.amount} - ${expense.description} - ${expense.category}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = async () => {
                await deleteExpense(expense.id);
                loadExpenses(filter, date);
            };

            li.appendChild(deleteButton);
            ul.appendChild(li);
        }//if
        });
    
        expensesDiv.appendChild(ul);
        
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

async function deleteExpense(id) {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`/expense/${id}`, {
            headers: { "Authorization": `${token}` }
        });
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}


function filterCriteria(expense, filter, date) {
    const expenseDate = new Date(expense.createdAt);
  
    switch (filter) {
      case 'date':
        return expenseDate.toISOString().split('T')[0] === date;
      case 'month':
        return `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}` === date;
      case 'year':
        return expenseDate.getFullYear() === parseInt(date);
      default:
        return true;
    }
}

// Load all expenses on page load
loadExpenses('all');