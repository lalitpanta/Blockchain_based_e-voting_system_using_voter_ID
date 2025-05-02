



  // Fetch all candidates when the page loads
  document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3000/getAllCandidate')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const candidateDataContainer = document.getElementById('candidatedata');
            candidateDataContainer.innerHTML = ""; // Clear any existing data

            if (data.info) {
                data.info.forEach(info => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${info.citizenship_no}</td>
                        <td>${info.name}</td>
                        <td>${info.dob}</td>
                        <td>${info.gender}</td>
                        <td>${info.nea_membership_no}</td>
                        <td>${info.voter_id}</td>
                        <td>${info.position}</td>
                        <td>${info.contact}</td>
                        <td>${info.email}</td>
                        <td>${info.candidate_id}</td>
                        <td>${info.party}</td>
                        <td>${info.voting_date}</td>
                        <td>${info.start_time}</td>
                        <td>${info.ending_time}</td>
                    `;
                    candidateDataContainer.appendChild(row);
                });
            } else {
                alert("No candidates found.");
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

// Function to search a candidate by NEA Membership Number
function searchCandidate() {
    const neaMembershipNo = document.getElementById('candidate-search-bar').value.trim();

    if (!neaMembershipNo) {
        alert("Please enter an NEA Membership Number to search.");
        return;
    }

    fetch(`http://localhost:3000/getCandidateByNeaMembershipNo/${neaMembershipNo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const candidateDataContainer = document.getElementById('candidatedata');
            candidateDataContainer.innerHTML = ""; // Clear previous results

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
                    <td>${info.position}</td>
                    <td>${info.contact}</td>
                    <td>${info.email}</td>
                    <td>${info.candidate_id}</td>
                    <td>${info.party}</td>
                    <td>${info.voting_date}</td>
                    <td>${info.start_time}</td>
                    <td>${info.ending_time}</td>
                `;
                candidateDataContainer.appendChild(row);
            } else {
                alert("No candidate found with the given NEA Membership Number.");
            }
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}
