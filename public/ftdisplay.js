document.getElementById('filter').onchange = () => {
    const filter = document.getElementById('filter').value;
    document.getElementById('date-picker').style.display = filter === 'date' ? 'block' : 'none';
    document.getElementById('month-picker').style.display = filter === 'month' ? 'block' : 'none';
    document.getElementById('year-picker').style.display = filter === 'year' ? 'block' : 'none';
    
    if (filter === 'all') {
        loadExpenses(filter, null, 1, getPerPage());
    }
};

document.getElementById('daily-date').onchange = () => {
    const date = document.getElementById('daily-date').value;
    loadExpenses('date', date, 1, getPerPage());
};

document.getElementById('monthly-date').onchange = () => {
    const date = document.getElementById('monthly-date').value;
    loadExpenses('month', date, 1, getPerPage());
};

document.getElementById('yearly-date').onchange = () => {
    const year = document.getElementById('yearly-date').value;
    loadExpenses('year', year, 1, getPerPage());
};

async function loadExpenses(filter, date, page, perPage) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/expense/history', {
        headers: { "Authorization": `${token}` },
        params: { filter, date, page, perPage }
      });
  
      const { expenses, totalExpenses } = response.data;
      const expensesDiv = document.getElementById('priveios expense');
      expensesDiv.innerHTML = '';
  
      if (Array.isArray(expenses)) {
        const ul = document.createElement('ul');
        expenses.forEach(expense => {
          if (filter === 'all' || filterCriteria(expense, filter, date)) {
            const li = document.createElement('li');
            li.textContent = `${expense.amount} - ${expense.description} - ${expense.category}`;
  
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = async () => {
              await deleteExpense(expense.id);
              loadExpenses(filter, date, page, perPage);
            };
  
            li.appendChild(deleteButton);
            ul.appendChild(li);
          }
        });
  
        expensesDiv.appendChild(ul);
      } else {
        console.error('Unexpected response format for expenses:', response.data);
      }
  
      setupPagination(totalExpenses, page, perPage, filter, date);
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

function setupPagination(totalExpenses, currentPage, perPage, filter, date) {
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    const totalPages = Math.ceil(totalExpenses / perPage);

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement('button');
        button.textContent = page;
        button.onclick = () => loadExpenses(filter, date, page, perPage);
        if (page === currentPage) {
            button.disabled = true;
        }
        paginationDiv.appendChild(button);
    }
}

function getPerPage() {
    const screenWidth = window.innerWidth;
    if (screenWidth > 1200) return 40;
    if (screenWidth > 800) return 20;
    return 10;
}

// Initial load
loadExpenses('all', null, 1, getPerPage());
