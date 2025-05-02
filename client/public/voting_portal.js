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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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

    await initWeb3(); // Initialize Web3 after fetching the contract address
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
      await loadCandidates(); // Load candidates after initializing Web3
    } catch (error) {
      console.error('Error initializing Web3:', error.message);
      alert('Failed to connect to MetaMask. Please try again.');
    }
  } else {
    alert("MetaMask is not installed. Please install MetaMask to use this application.");
  }
}

// Load candidates and display them grouped by party
async function loadCandidates() {
  try {
    const candidateCount = await votingContract.methods.candidateCount().call();
    const candidateContainer = document.getElementById("candidates");

    // Map parties to their candidates
    const partyMap = {};

    for (let i = 0; i < candidateCount; i++) {
      const candidate = await votingContract.methods.getCandidate(i).call();
      const party = candidate.party;

      if (!partyMap[party]) {
        partyMap[party] = [];
      }
      partyMap[party].push({ id: i, ...candidate });
    }

    candidateContainer.innerHTML = "";

    // Create a table for displaying candidates
    const table = document.createElement("table");
    table.border = "1";
    table.style.width = "100%";

    // Table headers
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `<th>Party</th><th>Candidates</th>`;
    table.appendChild(headerRow);

    // Populate the table with candidates
    for (const party in partyMap) {
      const row = document.createElement("tr");

      // Party column
      const partyCell = document.createElement("td");
      partyCell.textContent = party;
      row.appendChild(partyCell);

      // Candidates column
      const candidatesCell = document.createElement("td");
      candidatesCell.style.whiteSpace = "nowrap";

      partyMap[party].forEach(candidate => {
        const candidateElement = document.createElement("div");
        candidateElement.style.display = "inline-block";
        candidateElement.style.margin = "0 20px";

        candidateElement.innerHTML = `
          <p>Name: <strong>${candidate.name}</strong></p>
          <p>Position: ${candidate.position}</p>
          <p>Votes: ${candidate.voteCount}</p>
          <button onclick="vote(${candidate.id})">Vote</button>
        `;
        candidatesCell.appendChild(candidateElement);
      });

      row.appendChild(candidatesCell);
      table.appendChild(row);
    }

    candidateContainer.appendChild(table);
  } catch (error) {
    console.error("Error fetching candidates:", error);
  }
}

const predefinedAccount = "0xDFB4b6c361F5FE50318eD25CAA320D8C98A55bc4"; // Your Ganache account address

// Function to cast a vote
async function vote(candidateId) {
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    await votingContract.methods.vote(voterID, candidateId).send({ from: predefinedAccount });

    alert(`Vote cast successfully for candidate ID: ${candidateId}`);
    await loadCandidates(); // Refresh candidates after voting
  } catch (error) {
    console.error("Error casting vote:", error);
    alert("Failed to cast vote. User may have already voted or there was an issue.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchContractAddress();
});
