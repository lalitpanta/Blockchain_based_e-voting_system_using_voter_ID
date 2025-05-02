const abi = [
    {
      "inputs": [],
      "name": "candidateCount",
      "outputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalVoterCount",
      "outputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    }
    // Add other ABI methods as necessary
  ];
  
  let web3;
  let votingContract;
  
  document.addEventListener("DOMContentLoaded", () => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
  
      // Fetch the contract address from the backend
      fetch('http://localhost:3000/api/contract')
        .then(response => response.json())
        .then(data => {
          const contractAddress = data.contractAddress;
  
          if (!contractAddress || contractAddress === 'No address found') {
            alert('No contract address found.');
            return;
          }
  
          // Initialize the contract with the fetched address
          votingContract = new web3.eth.Contract(abi, contractAddress);
  
          // Request user to connect their MetaMask wallet
          window.ethereum.request({ method: "eth_requestAccounts" })
            .then(accounts => {
              console.log("Connected account:", accounts[0]);
              displayVoterCount();
            })
            .catch(error => {
              console.error("User denied account access:", error);
            });
        })
        .catch(error => {
          console.error('Error fetching contract address:', error);
          alert('Failed to fetch contract address.');
        });
    } else {
      alert("Please install MetaMask to use this application!");
    }
  });
  
  async function displayVoterCount() {
    try {
      const voterCount = await votingContract.methods.getTotalVoterCount().call();
      document.getElementById("voterCount").textContent = `Total Voter Count: ${voterCount}`;
    } catch (error) {
      document.getElementById("status").textContent = `Error: ${error.message}`;
    }
  }
  