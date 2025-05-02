
    const abi = [
      {
        "inputs": [],
        "name": "candidateCount",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "name": "candidates",
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
          { "internalType": "string", "name": "_name", "type": "string" },
          { "internalType": "string", "name": "_party", "type": "string" },
          { "internalType": "string", "name": "_position", "type": "string" }
        ],
        "name": "addCandidate",
        "outputs": [{ "internalType": "bool", "name": "success", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    let contractAddress;

 
    function fetchContractAddress() {
      return fetch('http://localhost:3000/api/contract')
        .then(response => response.json())
        .then(data => {
          contractAddress = data.contractAddress;
        })
        .catch(error => {
          console.error('Error fetching contract address:', error);
        });
    }

   
    document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("candidateForm");
      const messageDiv = document.getElementById("message");

     
      fetchContractAddress().then(() => {
        console.log("Contract Address loaded:", contractAddress);
      });

  
      async function validateCandidate(name, party, position) {
        const requestBody = { name, party, position };
        try {
          const response = await fetch('http://localhost:3000/validateCandidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          });
          const data = await response.json();
          return data.status === 'success';  
        } catch (error) {
          console.error('Error validating candidate:', error);
          return false;
        }
      }

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const party = document.getElementById("party").value;
        const position = document.getElementById("position").value;

        if (!name || !party || !position) {
          messageDiv.textContent = "All fields are required.";
          messageDiv.style.color = 'red';
          return;
        }

        // Step 1: Validate candidate
        const isValid = await validateCandidate(name, party, position);
        if (!isValid) {
          messageDiv.textContent = 'Invalid credentials. Please match the registration details.';
          messageDiv.style.color = 'red';

        
          if (userResponse) {
            form.reset(); // Reset the form if the user wants to try again
          } else {
            console.log("User decided not to proceed.");
          }
          return;
        }

        // Step 2: Proceed with MetaMask interaction
        if (!window.ethereum) {
          alert("No Ethereum provider found. Please install MetaMask!");
          return;
        }

        const web3 = new Web3(window.ethereum);

        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          const account = accounts[0];

          if (!contractAddress) {
            console.error('Contract address not loaded yet');
            return;
          }

          const contract = new web3.eth.Contract(abi, contractAddress);
          messageDiv.textContent = "Adding candidate...";
          const transaction = await contract.methods.addCandidate(name, party, position).send({ from: account });

          if (transaction.status) {
            messageDiv.textContent = `For ${position} position, the candidate ${name} from the Party ${party} is successfully registered to Blockchain.`;
            form.reset(); 
          } else {
            messageDiv.textContent = `Failed to add candidate "${name}".`;
          }
        } catch (error) {
          console.error("Error adding candidate:", error);
          alert('Error adding candidate: ' + error.message);
        }
      });
    });
  