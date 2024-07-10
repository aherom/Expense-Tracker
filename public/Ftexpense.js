//add
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
        loadExpenses(); 
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}


//delete
async function deleteExpense(id) {
    try {
        const token = localStorage.getItem('token');
        await axios.post('/expense/delete', { id }, {
            headers: {
                "Authorization": `${token}`
            }});
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


const token = localStorage.getItem('token');
const isPremium = parseJwt(token).isPremium;
if (isPremium) {
  document.getElementById('rzp-button1').style.visibility = 'hidden';
  document.getElementById('message').innerHTML=`you are premium user
  <button id="Leaderboard" >Leaderboard</button><br><div id="leaderboardDisplay"></div>`;
}
else{

const PremiumButton = document.getElementById('rzp-button1');
PremiumButton.onclick =async ()=>{

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
                    
                    // Add your post-payment logic here

                    try {
                        const result =await axios.post('/Premium/success', {
                            payment_id: response.razorpay_payment_id,
                            order_id: response.razorpay_order_id
                        }, {
                            headers: { "Authorization": `${token}` }
                        });
                        alert("Payment successful");
                         PremiumButton.style.visibility="hidden";
                         document.getElementById('message').innerText="you are premium user";
                        localStorage.setItem('token',result.data.token);

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
}

async function download() {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get('/download', {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob'  // Important for downloading files
        });

        if (response.status === 201) {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'myexpense.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } else {
            throw new Error(response.data.message || 'Failed to download file');
        }
    } catch (error) {
        console.error('Download error:', error);
        // Handle error display or logging
    }
}




    