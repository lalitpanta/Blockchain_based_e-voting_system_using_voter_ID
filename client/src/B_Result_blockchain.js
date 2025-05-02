// Initialize Web3 and connect to Ganache
const web3 = new Web3('http://127.0.0.1:7545');  // Connect to Ganache

let contractAddress;

// Function to fetch the contract address from the API
function fetchContractAddress() {
    return fetch('http://localhost:3000/api/contract')
        .then(response => response.json())
        .then(data => {
            contractAddress = data.contractAddress;
            console.log('Contract address fetched:', contractAddress);
        })
        .catch(error => {
            console.error('Error fetching contract address:', error);
        });
}

// Function to initialize Web3 and interact with the contract after the address is fetched
async function initializeContract() {
    await fetchContractAddress(); // Wait for the contract address to be fetched

    if (!contractAddress) {
        console.error('Contract address not loaded yet');
        return;
    }

    console.log('Using contract address:', contractAddress);

    // Now that we have the contract address, we can initialize Web3
    const contractABI = [
        {
          "inputs": [],
          "name": "candidateCount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "candidates",
          "outputs": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "party",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "position",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "voterCount",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_party",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "_position",
              "type": "string"
            }
          ],
          "name": "addCandidate",
          "outputs": [
            {
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "candidateId",
              "type": "uint256"
            }
          ],
          "name": "vote",
          "outputs": [
            {
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "candidateId",
              "type": "uint256"
            }
          ],
          "name": "getCandidate",
          "outputs": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "party",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "position",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "position",
              "type": "string"
            }
          ],
          "name": "hasVotedForPosition",
          "outputs": [
            {
              "internalType": "bool",
              "name": "result",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "voter",
              "type": "address"
            }
          ],
          "name": "hasVoted",
          "outputs": [
            {
              "internalType": "bool",
              "name": "result",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ];

    
    const contract = new web3.eth.Contract(contractABI, contractAddress);

   
    try {
        const candidateCount = await contract.methods.candidateCount().call();
        console.log('Number of candidates:', candidateCount);
    } catch (error) {
        console.error('Error interacting with the contract:', error);
    }

    
    await displayCandidates(contract);
}


async function displayCandidates(contract) {
    try {
        const candidateCount = await contract.methods.candidateCount().call();
        console.log("Total number of candidates:", candidateCount);

        const candidatesByPosition = {};

        
        for (let i = 0; i < candidateCount; i++) {
            const candidate = await contract.methods.getCandidate(i).call();

            
            if (!candidatesByPosition[candidate.position]) {
                candidatesByPosition[candidate.position] = [];
            }
            candidatesByPosition[candidate.position].push(candidate);
        }

        const candidateContainer = document.getElementById("candidateContainer");
        candidateContainer.innerHTML = "";  // Clear existing content

        for (const position in candidatesByPosition) {
            const positionGroup = candidatesByPosition[position];

            const positionGroupElement = document.createElement("div");
            positionGroupElement.className = "position-group";

            const positionTitle = document.createElement("div");
            positionTitle.className = "position-title";
            positionTitle.textContent = position;
            positionGroupElement.appendChild(positionTitle);

            const candidateRow = document.createElement("div");
            candidateRow.className = "candidate-row";

            positionGroup.forEach(candidate => {
                const candidateElement = document.createElement("div");
                candidateElement.className = "candidate";
                candidateElement.innerHTML = `
                 <img src="https://www.w3schools.com/w3images/avatar2.png" alt="${candidate.name}'s photo" style="border-radius: 50%; width: 100px; height: 100px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                  <p>Candidate Name: <strong>${candidate.name}</strong></p>
                  <p>Party: ${candidate.party}</p>
                  <p>Vote Count: ${candidate.voteCount}</p>
                `;
                candidateRow.appendChild(candidateElement);
            });

            positionGroupElement.appendChild(candidateRow);
            candidateContainer.appendChild(positionGroupElement);
        }
    } catch (error) {
        console.error("Error fetching candidates:", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    initializeContract();
});
