async function sigup(event) {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
        const response = await axios.post('/user/Signup', { name,email, password });
        alert('account created successful');
    } catch (error) {
        document.getElementById('errorMessage').innerHTML = error.response ? 
            error.response.data : 'An unexpected error occurred';
    }
}