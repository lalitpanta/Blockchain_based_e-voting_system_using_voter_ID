document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('candidateForm');
  const messageDiv = document.getElementById('message'); // Reference the existing message div










// //ishmirti

//   const emailInput = document.getElementById('email'); 
//   const emailError = document.getElementById('emailError');
  
//   const contactInput = document.getElementById('contact');
//   const contactError = document.getElementById('contactError');
  
// //   const idInput = document.getElementById('id');
// //   const idError = document.getElementById('idError');
  
//   const voterIdInput = document.getElementById('voter_id');
//   const voterIdError = document.getElementById('voterIdError');

//   const candidateIdInput = document.getElementById('candidateId');
//   const candidateIdError = document.getElementById('candidateIdError');

//   const citizenshipInput = document.getElementById('citizenship_no');
//   const citizenshipError = document.getElementById('citizenshipError');

//   const neaMembershipInput = document.getElementById('nea_membership_no');
//   const neaError = document.getElementById('nea_Error');

 

//     // Calculate the minimum eligible date for 18+ (date of birth and voter id issued date ko lagi)
//     const today = new Date();
//     const minEligibleDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

//     // Function to validate date input
//     function validateDate(inputField, errorField, maxDate) {
//         inputField.max = maxDate.toISOString().split('T')[0]; // Set the max date
//         inputField.addEventListener('change', function() {
//             const selectedDate = new Date(this.value);
//             if (selectedDate > maxDate) {
//                 errorField.style.display = 'block';
//                 this.value = ""; // Clear invalid input
//             } else {
//                 errorField.style.display = 'none';
//             }
//         });
//     }
//     const dobInput = document.getElementById('dob');
//     const dobError = document.getElementById('dobError');
//     validateDate(dobInput, dobError, minEligibleDate);
  




//     // yo chai citizenship number ko lagi 
//     citizenshipInput.addEventListener('input', () => {
//         const citizenshipPattern = /^\d{2}-\d{2}-\d{2}-\d{5}$/;
//         if (citizenshipPattern.test(citizenshipInput.value) || citizenshipInput.value.trim() === "") {
//             citizenshipError.style.display = 'none';
//         }
//     });
    
//     citizenshipInput.addEventListener('blur', () => {
//         const citizenshipPattern = /^\d{2}-\d{2}-\d{2}-\d{5}$/;
//         if (!citizenshipPattern.test(citizenshipInput.value) && citizenshipInput.value.trim() !== "") {
//             citizenshipError.style.display = 'block';
//         }
//     });
    


//     //nea membership ko lagi 
//     neaMembershipInput.addEventListener('input', () => {
//         const neaValue = neaMembershipInput.value.trim();
//         if (neaValue.length <= 6) {
//             neaError.style.display = 'none';
//         }
//     });
    
//     neaMembershipInput.addEventListener('blur', () => {
//         const neaValue = neaMembershipInput.value.trim();
//         if (neaValue === "") {
//             neaError.style.display = 'none';
//         } else if (neaValue.length !== 6) {
//             neaError.style.display = 'block';
//         } else {
//             neaError.style.display = 'none';
//         }
//     });




//   // email ko lagi 
//     emailInput.addEventListener('input', () => {
//         const emailPattern = /^[a-zA-Z]+[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
//         if (emailPattern.test(emailInput.value) || emailInput.value.trim() === "") {
//             emailError.style.display = 'none';
//         }
//     });

//     emailInput.addEventListener('blur', () => {
//         const emailPattern = /^[a-zA-Z]+[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
//         if (!emailPattern.test(emailInput.value) && emailInput.value.trim() !== "") {
//             emailError.style.display = 'block';
//         }
//     });



//   // yo chai contact  ko lagi
//     contactInput.addEventListener('input', () => {
//         const contactPattern = /^98\d{8}$/;
//         if (contactPattern.test(contactInput.value) || contactInput.value.trim() === "") {
//             contactError.style.display = 'none';
//         }
//     });

//     contactInput.addEventListener('blur', () => {
//         const contactPattern = /^98\d{8}$/;
//         if (!contactPattern.test(contactInput.value) && contactInput.value.trim() !== "") {
//             contactError.style.display = 'block';
//         }
//     });




  
//   // yo chai ID validity ko lagi
//     // idInput.addEventListener('input', () => {
//     //     const idValue = idInput.value.trim();
//     //     if (idValue.length <= 6) {
//     //         idError.style.display = 'none';
//     //     }
//     // });

//     // idInput.addEventListener('blur', () => {
//     //     const idValue = idInput.value.trim();
//     //     if (idValue === "") {
//     //         idError.style.display = 'none';
//     //     } else if (idValue.length !== 6) {
//     //         idError.textContent = "ID must be exactly 6 digits";
//     //         idError.style.display = 'block';
//     //     } else {
//     //         idError.style.display = 'none';
//     //     }
//     // });



//   // yo chai voter id ko validity
//     voterIdInput.addEventListener('input', () => {
//         const voterId = voterIdInput.value.trim();
//         if (voterId.length <= 6) {
//             voterIdError.style.display = 'none';
//         }
//     });

//     voterIdInput.addEventListener('blur', () => {
//         const voterId = voterIdInput.value.trim();
//         if (voterId === "") {
//             voterIdError.style.display = 'none';
//         } else if (voterId.length !== 6) {
//             voterIdError.textContent = "Voter ID must be exactly 6 digits";
//             voterIdError.style.display = 'block';
//         } else {
//             voterIdError.style.display = 'none';
//         }
//     });


// // yo chai candidate id ko lagi
//     candidateIdInput.addEventListener('input', () => {
//         const candidateId = candidateIdInput.value.trim();
//         if (candidateId.length <= 6) {
//             candidateIdError.style.display = 'none';
//         }
//     });

//     candidateIdInput.addEventListener('blur', () => {
//         const candidateId = candidateIdInput.value.trim();
//         if (candidateId === "") {
//             candidateIdError.style.display = 'none';
//         } else if (candidateId.length !== 6) {
//             candidateIdError.textContent = "Candidate ID must be exactly 6 digits";
//             candidateIdError.style.display = 'block';
//         } else {
//             candidateIdError.style.display = 'none';
//         }
//     });
//     //ishmirti










  form.addEventListener('submit', function(event) {
      event.preventDefault(); 

      messageDiv.textContent = ''; // aagadi ko message Clear garxa

      const formData = new FormData(form); // Get form data
      const jsonData = {};

      // FormData bata  JSON ma convert garxa
      formData.forEach((value, key) => {
          jsonData[key] = value;
      });

      console.log('Posted Data:', jsonData); 

      const requiredFields = [
        'citizenship_no', 'name', 'dob', 'gender','nea_membership_no',
        'voter_id','position', 'contact', 'email', 'candidate_id',
        'party', 'voting_date', 'start_time', 'ending_time'
    ];

      
      for (const field of requiredFields) {
          if (!jsonData[field]) {
              messageDiv.textContent = `Please fill out the required field: ${field.replace(/_/g, ' ').toUpperCase()}`;
              messageDiv.style.color = 'red';
              return;
          }
      }

      const apiUrl = 'http://localhost:3000/addCandidateInfo'; 

      const requestOptions = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(jsonData) 
      };

      fetch(apiUrl, requestOptions)
          .then(response => {
              if (!response.ok) {
                  return response.json().then(errData => {
                      console.error('Server error:', errData);
                      throw new Error(errData.message || 'An error occurred. Please try again.');
                  });
              }
              return response.json();
          })
          .then(data => {
              console.log('Data posted successfully:', data);
              messageDiv.textContent = data.message || 'Candidate added successfully';
              messageDiv.style.color = 'green';
              form.reset();
          })
          .catch(error => {
              console.error('There was a problem with your fetch operation:', error);
              messageDiv.textContent = error.message;
              messageDiv.style.color = 'red';
          });
  });
});
