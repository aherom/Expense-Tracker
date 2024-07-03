document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
  
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const formData = new FormData(loginForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
      };
  
      axios.post('/user/Signup', data)
        .then(response => {
          if (response.data.exists) {
            document.body.innerHTML = `
              <h1>Record Exists</h1>
              <form id="login-form" action="/user/login" method="POST">
                  Enter your Email:<input type="email" name="email" value="${response.data.email}" required>
                  <br>Enter your Password:<input type="password" name="password" required>
                  <br><button type="submit">Login</button>
              </form>
            `;
          } else {
            document.body.innerHTML = response.data;
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  });
  