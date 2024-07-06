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
const PremiumButton = document.getElementById('rzp-button1');
PremiumButton.onclick =async ()=>{
    console.log("hiii");
    try{
         const token = localStorage.getItem('token'); 
         const response = await axios.get('/Premium/payment', {
            headers: { "Authorization": `${token}` }
            });
            const options = {
                "key": response.data.key_id,
                "amount": response.data.order.amount,
                "currency": "INR",
                "name": "Your Company Name",
                "description": "Test Transaction",
                "order_id": response.data.order.id,
                "handler": async function (response) {
                    alert("Payment successful");
                    // Add your post-payment logic here

                    try {
                        await axios.post('/Premium/success', {
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id
                        }, {
                            headers: { "Authorization": `${token}` }
                        });
                        console.log('Payment status updated');
                    } catch (error) {
                        console.error('Error updating payment status:', error);
                    }
                },
                "prefill": {
                    "name": "Your Name",
                    "email": "your-email@example.com",
                    "contact": "9999999999"
                },
               
            };
    
            const rzp1 = new Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error('Error initiating payment:', error);
        }
}

// Load expenses when the page loads
window.onload = loadExpenses;
