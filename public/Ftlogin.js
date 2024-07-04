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
