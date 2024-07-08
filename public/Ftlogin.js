async function login(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
        const response = await axios.post('/user/login', { email, password });
        alert('Login successful');
        console.log(response.data);
        localStorage.setItem('token',response.data.token);
          window.location.href = 'hi.html';
    } catch (error) {
        document.getElementById('errorMessage').innerHTML = error.response ? 
            error.response.data : 'An unexpected error occurred';
    }
}

function showForgotPassword() {
    const loginForm = document.querySelector('form');
    const forgotPassword = document.getElementById('forgotPassword');

    loginForm.style.display = 'none';
    forgotPassword.style.display = 'block';
}
  


async function forgotPassword(event) {
    try {
       
        event.preventDefault(); 

        const forgotEmail = document.getElementById('forgotEmail').value;
       console.log(forgotEmail);
       const response = await axios.post('/password/forgotpassword', {
        email: forgotEmail 
      });

        alert(`${response.data}  ${forgotEmail}`)
        console.log(response.data);
        window.location.href = 'login.html';
    } catch (error) {
       
        console.error('Error:', error.response ? error.response.data : 'An unexpected error occurred');
    }
}