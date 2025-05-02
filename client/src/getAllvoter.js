


// Function to load all voters by default
function loadAllVoters() {
    fetch('http://localhost:3000/getAllVoter') 
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const userDataContainer = document.getElementById('voterdata'); 
        userDataContainer.innerHTML = "";  // Clear previous content

        data.info.forEach(info => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${info.citizenship_no}</td>
                <td>${info.name}</td>
                <td>${info.dob}</td>
                <td>${info.gender}</td>
                <td>${info.nea_membership_no}</td>
                <td>${info.voter_id}</td>
                <td>${info.issued_date}</td>
                <td>${info.issued_name}</td>
                <td>${info.contact}</td>
                <td>${info.email}</td>
                <td>
                    <button style="background-color: #007bff; color: white; border: none; padding: 10px 15px; font-size: 14px; border-radius: 5px; cursor: pointer;" onclick="printVoter('${info.voter_id}')">Print</button>
                </td>
            `;
            userDataContainer.appendChild(row);
        });
    })
    .catch(error => {
        console.error('There was a problem with fetching voters:', error);
    });
}

// Function to search a voter by Voter ID
function searchFunction() {
    const voterId = document.getElementById('search-bar').value;

    if (!voterId) {
        alert("Please enter a Voter ID to search.");
        return;
    }

    fetch(`http://localhost:3000/getVoterById/${voterId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const voterDataContainer = document.getElementById('voterdata');
            voterDataContainer.innerHTML = ""; // Clear previous results

            if (data.info) {
                const info = data.info;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${info.citizenship_no}</td>
                    <td>${info.name}</td>
                    <td>${info.dob}</td>
                    <td>${info.gender}</td>
                    <td>${info.nea_membership_no}</td>
                    <td>${info.voter_id}</td>
                    <td>${info.issued_date}</td>
                    <td>${info.issued_name}</td>
                    <td>${info.contact}</td>
                    <td>${info.email}</td>
                    <td>
                        <button style="background-color: #007bff; color: white; border: none; padding: 10px 15px; font-size: 14px; border-radius: 5px; cursor: pointer;" onclick="printVoter('${info.voter_id}')">Print</button>
                    </td>
                `;
                voterDataContainer.appendChild(row);
            } else {
                alert("No voter found with the given Voter ID.");
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

// Function to handle the print functionality
function printVoter(voterId) {
    fetch(`http://localhost:3000/voter/${voterId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `voter-${voterId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('There was a problem with fetching the voter information:', error);
        });
}

// Load all voters by default when the page loads
document.addEventListener('DOMContentLoaded', loadAllVoters);