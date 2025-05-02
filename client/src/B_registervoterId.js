// let web3;
//   let contract;

//   document.addEventListener("DOMContentLoaded", async () => {
//     if (window.ethereum) {
     
//       web3 = new Web3(window.ethereum);

//       try {
   
//         const response = await fetch('http://localhost:3000/api/contract');
//         const data = await response.json();
        
     
//         if (!data.contractAddress || data.contractAddress === 'No address found') {
//           alert("Contract address not found. Please check the backend.");
//           return;
//         }

    
//         const contractAddress = data.contractAddress;

//         const abi = [
//           {
//             "inputs": [{ "internalType": "uint256", "name": "_voterID", "type": "uint256" }],
//             "name": "registerVoter",
//             "outputs": [],
//             "stateMutability": "nonpayable",
//             "type": "function"
//           }
//         ];

//         contract = new web3.eth.Contract(abi, contractAddress);

//         console.log("Web3 initialized and contract loaded");
//       } catch (error) {
//         console.error("Error fetching contract address from API:", error);
//         alert("Failed to fetch contract address from the server.");
//       }
//     } else {
//       alert("MetaMask is not installed. Please install MetaMask to use this app.");
//       console.error("MetaMask not found");
//     }
//   });

//   async function registerVoter() {
//     try {
    
//       if (!web3 || !contract) {
//         alert("Web3 is not initialized. Please refresh the page.");
//         return;
//       }

    
//       await window.ethereum.request({ method: "eth_requestAccounts" });

  
//       const accounts = await web3.eth.getAccounts();
//       const account = accounts[0];

//       // Get the voter ID from the form input
//       const voterIdInput = document.getElementById("voter_id");
//       const voterID = parseInt(voterIdInput.value);

//       // Ensure voter ID is valid
//       if (isNaN(voterID) || voterID <= 0) {
//         alert("Please enter a valid voter ID.");
//         return;
//       }

//       // Call the smart contract function to register the voter
//       await contract.methods.registerVoter(voterID).send({ from: account });
      
//       alert(`Voter ID ${voterID} registered successfully.`);
//       window.location.href = '/client/public/B_Vote_candidate.html'; // Redirect to login page
//     } catch (error) {
//       console.error("Error registering voter:", error);
//       alert("Failed to register voter. Please try again.");
//     }
//   }
  













  