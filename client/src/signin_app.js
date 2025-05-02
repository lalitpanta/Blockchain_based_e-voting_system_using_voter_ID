// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('loginForm');
//     const message = document.createElement('div');
//     message.id = 'message';
//     form.appendChild(message);

//     form.addEventListener('submit', function (event) {
//         event.preventDefault(); 

//         const voter_id_input = form.querySelector('input[name="voter_id"]');
//         const dob_input = form.querySelector('input[name="dob"]');

//         if (voter_id_input && dob_input) {
//             const voter_id = voter_id_input.value.trim();
//             const dob = dob_input.value.trim();

//             if (voter_id && dob) {
//                 const formDataObject = { voter_id, dob };

//                 fetch('http://localhost:3000/signin', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(formDataObject),
//                 })
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error('Network response was not ok');
//                     }
//                     return response.json(); 
//                 })
//                 .then(data => {
//                     if (data.statusCode === 200) {
//                         sessionStorage.setItem('userData', JSON.stringify(data.user));
//                         window.location.href = '/client/public/B_register_voterid.html';
//                     } else if (data.message === "You have already voted.") {
//                         message.textContent = 'You have already voted.';
//                         message.style.color = 'red'; 
//                     } else {
//                         message.textContent = 'Login failed. Please check your Voter ID and Date of Birth.';
//                         message.style.color = 'black'; 
//                     }
//                 })
//                 .catch(error => {
//                     console.error('There was a problem with your fetch operation:', error);
//                     message.textContent = 'Login failed. Please try again.';
//                     message.style.color = 'red'; 
//                 });
//             } else {
//                 message.textContent = 'Please provide both Voter ID and Date of Birth.';
//                 message.style.color = 'red'; 
//             }
//         } else {
//             console.error('Input elements not found');
//             message.textContent = 'Error: Unable to find input fields.';
//             message.style.color = 'red';
//         }
//     });
// });



document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const message = document.createElement('div');
    message.id = 'message';
    form.appendChild(message);

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); 

        const voter_id_input = form.querySelector('input[name="voter_id"]');
        const dob_input = form.querySelector('input[name="dob"]');

        if (voter_id_input && dob_input) {
            const voter_id = voter_id_input.value.trim();
            const dob = dob_input.value.trim();

            if (voter_id && dob) {
                const formDataObject = { voter_id, dob };

                try {
                    const response = await fetch('http://localhost:3000/signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formDataObject),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        // If login is successful, store the JWT token
                        sessionStorage.setItem('jwt', data.token); // Store JWT token in sessionStorage
                        console.log('Login Successful:', data);
                       
                        window.location.href = '/client/public/B_register_voterid.html'; // Redirect to register page
                    } else {
                        // Handle different error messages
                        if (data.message === "Invalid voter_id or date of birth") {
                            message.textContent = 'Login failed. Please check your Voter ID and Date of Birth.';
                            message.style.color = 'black'; 
                        } else {
                            message.textContent = 'Error: ' + data.message;
                            message.style.color = 'red'; 
                        }
                    }
                } catch (err) {
                    console.error('Login Error:', err);
                    message.textContent = 'Login failed. Please try again.';
                    message.style.color = 'red'; 
                }
            } else {
                message.textContent = 'Please provide both Voter ID and Date of Birth.';
                message.style.color = 'red'; 
            }
        } else {
            console.error('Input elements not found');
            message.textContent = 'Error: Unable to find input fields.';
            message.style.color = 'red';
        }
    });
});






// yo le chahi back garna mildaina current page lai
 
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function(event) {
      history.pushState(null, document.title, location.href);
    });
 
