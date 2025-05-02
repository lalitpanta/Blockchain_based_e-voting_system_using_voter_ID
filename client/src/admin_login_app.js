// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('loginForm');
//   const message = document.getElementById('message'); 

//   form.addEventListener('submit', function (event) {
//       event.preventDefault(); 

//       const userNameInput = form.querySelector('input[name="user_name"]');
//       const emailInput = form.querySelector('input[name="email"]');
//       const passwordInput = form.querySelector('input[name="password"]');
//       const adminNoInput = form.querySelector('input[name="admin_no"]');

//       const user_name = userNameInput.value.trim();
//       const email = emailInput.value.trim();
//       const password = passwordInput.value.trim();
//       const admin_no = adminNoInput.value.trim();

//       if (user_name && email && password && admin_no) {
//           const formDataObject = { user_name, email, password, admin_no };

//           fetch('http://localhost:3000/adminlogin', {
//               method: 'POST',
//               headers: {
//                   'Content-Type': 'application/json', 
//               },
//               body: JSON.stringify(formDataObject), 
//           })
//           .then(response => {
//               if (!response.ok) {
//                   throw new Error('Network response was not ok');
//               }
//               return response.json(); 
//           })
//           .then(data => {
//               console.log('Data received from server:', data);
              
//               if (data.statusCode === 200) {
                
//                   window.location.href = '/public/p.html'; 
//               } else {
                 
//                   message.textContent = 'Login failed. Please check your credentials.';
//                   message.style.color = 'black'; 
//               }
//           })
//           .catch(error => {
//               console.error('There was a problem with your fetch operation:', error);
//               message.textContent = 'Login failed. Please try again.';
//               message.style.color = 'red'; 
//           });
//       } else {
         
//           message.textContent = 'Please provide all fields: User Name, Email, Password, and Admin No.';
//           message.style.color = 'red'; 
//       }
//   });
// });







document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const message = document.getElementById('message'); 

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const userNameInput = form.querySelector('input[name="user_name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const passwordInput = form.querySelector('input[name="password"]');
        const adminNoInput = form.querySelector('input[name="admin_no"]');

        const user_name = userNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const admin_no = adminNoInput.value.trim();

        if (user_name && email && password && admin_no) {
            const formDataObject = { user_name, email, password, admin_no };

            fetch('http://localhost:3000/adminlogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataObject),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.statusCode === 200) {
                    // Save user data to sessionStorage
                    sessionStorage.setItem('userData', JSON.stringify(data.user));
                    window.location.href = '/client/public/admin.html'; 
                } else {
                    message.textContent = 'Login failed. Please check your credentials.';
                    message.style.color = 'black';
                }
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
                message.textContent = 'Login failed. Please try again.';
                message.style.color = 'red';
            });
        } else {
            message.textContent = 'Please provide all fields: User Name, Email, Password, and Admin No.';
            message.style.color = 'red';
        }
    });
});
