let web3;
let votingContract;
let voterID = null; // Store the voter ID after it is set
let contractAddress; // Will be set after fetching from the API

const contractABI = [
  {
    "inputs": [],
    "name": "candidateCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "candidateId", "type": "uint256" }],
    "name": "getCandidate",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "party", "type": "string" },
      { "internalType": "string", "name": "position", "type": "string" },
      { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "voterID", "type": "uint256" },
      { "internalType": "uint256", "name": "candidateId", "type": "uint256" }
    ],
    "name": "vote",
    "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "registeredVoters",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];

// Fetch the contract address from the server
async function fetchContractAddress() {
  try {
    const response = await fetch('http://localhost:3000/api/contract');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    contractAddress = data.contractAddress;

    if (!contractAddress || contractAddress === 'No address found') {
      throw new Error('Contract address not found');
    }

    await initWeb3(); // Initialize Web3 after successfully fetching the contract address
  } catch (error) {
    console.error('Error fetching contract address:', error.message);
    alert('Failed to fetch contract address. Please try again later.');
  }
}

// Initialize Web3
async function initWeb3() {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      votingContract = new web3.eth.Contract(contractABI, contractAddress);
      await loadCandidates(); // Load the candidates after Web3 is initialized
    } catch (error) {
      console.error('Error initializing Web3:', error.message);
      alert('Failed to connect to MetaMask. Please try again.');
    }
  } else {
    alert("MetaMask is not installed. Please install MetaMask to use this application.");
  }
}

// Load the list of candidates grouped by party
async function loadCandidates() {
  const tableBody = document.getElementById("candidateTable").querySelector("tbody");
  tableBody.innerHTML = ""; // Clear any existing rows

  try {
    const count = await votingContract.methods.candidateCount().call();
    const candidatesByParty = {}; // Object to store candidates by party

    for (let i = 0; i < count; i++) {
      const candidate = await votingContract.methods.getCandidate(i).call();

      // Group candidates by party
      if (!candidatesByParty[candidate.party]) {
        candidatesByParty[candidate.party] = [];
      }
      candidatesByParty[candidate.party].push({
        id: i,
        name: candidate.name,
        // party: candidate.party,
        position: candidate.position,
        voteCount: candidate.voteCount
      });
    }

    // Render the candidates grouped by party
    for (const party in candidatesByParty) {
      if (candidatesByParty.hasOwnProperty(party)) {
        // Create a new row for the party name
        const partyRow = document.createElement("tr");
        const partyCell = document.createElement("td");
        partyCell.colSpan = 6; // Make the party name span across all columns
        partyCell.style.fontWeight = "bold";
        partyCell.textContent = `Party: ${party}`;
        partyRow.appendChild(partyCell);
        tableBody.appendChild(partyRow);

        // Render candidates under the party
        candidatesByParty[party].forEach(candidate => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${candidate.id}</td>
            <td>${candidate.name}</td>
      
            <td>${candidate.position}</td>
            <td>${candidate.voteCount}</td>
            <td><button onclick="voteForCandidate(${candidate.id})">Vote</button></td>
          `;
          tableBody.appendChild(row);
        });
      }
    }
  } catch (error) {
    console.error("Error fetching candidates:", error.message);
    alert("Failed to load candidates. Please try again later.");
  }
}

// Function to vote for a candidate
async function voteForCandidate(candidateId) {
  const statusElement = document.getElementById("status");

  if (!voterID) {
    statusElement.textContent = "Please set your Voter ID first!";
    return;
  }

  if (!web3 || !votingContract) {
    statusElement.textContent = "Web3 is not initialized. Please connect to MetaMask.";
    return;
  }

  try {
    const accounts = await web3.eth.getAccounts();
    await votingContract.methods.vote(voterID, candidateId).send({ from: accounts[0] });
    statusElement.textContent = `Your vote has been successfully registered for candidate ${candidateId}.`;

    await loadCandidates(); // Refresh the candidate list to show updated vote counts
  } catch (error) {
    console.error("Error voting for candidate:", error.message);
    statusElement.textContent = `Error: ${error.message}`;
  }
}

// Set Voter ID and check registration
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("setVoterID").addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form submission

    const voterInput = document.getElementById("voterID").value;
    if (!voterInput) {
      alert("Please enter a valid Voter ID!");
      return;
    }

    try {
      voterID = parseInt(voterInput, 10);
      if (isNaN(voterID)) {
        alert("Invalid Voter ID. Please enter a numeric ID.");
        return;
      }

      // Check if the voter is registered
      const isRegistered = await votingContract.methods.registeredVoters(voterID).call();
      if (isRegistered) {
        document.getElementById("status").textContent = `Voter ID set to ${voterID}. You can now cast a vote.`;
      } else {
        voterID = null; // Reset voterID
        document.getElementById("status").textContent = "This Voter ID is not registered.";
        alert("You are not registered as a voter!");
      }
    } catch (error) {
      console.error("Error verifying voter registration:", error.message);
      alert("An error occurred while verifying your registration. Please try again.");
    }
  });

  fetchContractAddress(); // Fetch the contract address and initialize Web3
});

// Countdown timer functionality
document.addEventListener('DOMContentLoaded', () => {
  const countdownDuration = 60; // Countdown duration in seconds
  const storageKey = "countdownEndTime"; // Key for localStorage
  const timerElement = document.getElementById('timer');
  const progressElement = document.getElementById('progress');

  // Retrieve or initialize the countdown end time
  let countdownEndTime = localStorage.getItem(storageKey);
  if (!countdownEndTime) {
    countdownEndTime = Date.now() + countdownDuration * 1000; // Set new end time
    localStorage.setItem(storageKey, countdownEndTime);
  } else {
    countdownEndTime = parseInt(countdownEndTime, 10); // Ensure it's a number
  }

  // Function to update the timer and progress bar
  const updateTimer = () => {
    const currentTime = Date.now();
    const timeLeft = Math.max(0, Math.floor((countdownEndTime - currentTime) / 1000)); // Calculate remaining time

    // Update the DOM elements
    timerElement.textContent = timeLeft;
    progressElement.style.width = `${(timeLeft / countdownDuration) * 100}%`;

    // Redirect if countdown ends
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      localStorage.removeItem(storageKey); // Clear the stored end time
      window.location.href = '/face_recongation/face_recognition_using_Opencv/public/index.html'; // Redirect to the target page
    }
  };

  // Run the timer every second
  const countdownInterval = setInterval(updateTimer, 1000);

  // Update the timer immediately to avoid delay
  updateTimer();
});

// Function to get the value of a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Populate the input field with the ID from the cookie and make it readonly
window.onload = function () {
  const userID = getCookie('userID');
  const inputField = document.getElementById('voterID');

  if (inputField) {
    if (userID) {
      inputField.value = userID;
    } else {
      alert('No ID found. Please login and validate first.');
    }
  } else {
    console.error('Input field with id "voterID" not found.');
  }
};