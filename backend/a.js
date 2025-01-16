const express = require('express');
const Web3 = require('web3');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const pdfkit = require('pdfkit');
const QRCode = require('qrcode');
const { exec } = require('child_process');



const jwt = require("jsonwebtoken");


const app = express();
const port = 3000;
const SECRET_KEY = "your_secret_key";





// ishmirti
const  Queue  = require('bull');
const redisConfig = {
    host: '127.0.0.1', 
    port: 6379,        
    password: ''       
};
const queue = new Queue('voteQueue', { redis: redisConfig });
let transactionCounter = 0;
let currentSecond = Math.floor(Date.now()/1000);
//ishmirti







app.use(cors());
app.use(express.json());
app.use(bodyParser.json());












let contractAddress;
const axios = require('axios');

// yeta nai contract address chaiyeko huna le yetai fetch gareko
async function getContractAddress() {
    try {
        const response = await axios.get('http://localhost:3000/api/contract');
        const contractAddress = response.data.contractAddress || 'No address found';
        return contractAddress;
    } catch (error) {
        console.error('Error fetching contract address:', error);
        return 'Error fetching contract address';
    }
}


async function useContractAddress() {
    const contractAddress = await getContractAddress();
    console.log('my contract address is :', contractAddress);
}


useContractAddress();












// const contractAddress = '0x7F46dfD6BF293D2347f9EfdaB16c5929B51f8394'; 
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
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
    "type": "function",
    "constant": true
  }
];

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'myvoter' 
});

//message dinxa database connection ko
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1); 
    }
    console.log('Database connected!');
});

// ganache ko rpc link block chain provide garxa
const web3 = new Web3('http://127.0.0.1:7545'); 
const contract = new web3.eth.Contract(contractABI, contractAddress);











// alert message dinxa blockchain sanga connect vako  xa ki nai vanera
web3.eth.getBlockNumber()
    .then(blockNumber => console.log(`Connected to blockchain. Current block: ${blockNumber}`))
    .catch(err => {
        console.error('Error connecting to the blockchain:', err.message);
        process.exit(1);
    });














// yo chai contract address ko lagi
    app.get('/api/contract-address', (req, res) => {
        res.json({ contractAddress });
    });




  








//ishmirti
queue.process(async (job) => {
    try {
        const { candidateId, voterAccount } = job.data;

        console.log(`Processing vote for Candidate ID: ${candidateId}, Voter Account: ${voterAccount}`);

        // Process the transaction on the blockchain
        await contract.methods.vote(candidateId).send({ from: voterAccount });

        // Fetch updated vote count from the blockchain
        const updatedCandidate = await contract.methods.candidates(candidateId).call();
        const { voteCount } = updatedCandidate;

        // Update the database
        const sql = 'UPDATE mycandidate SET voteCount = ? WHERE id = ?';
        db.query(sql, [voteCount, candidateId], (err) => {
            if (err) {
                console.error('Error updating vote count in database:', err.message);
                throw new Error('Database update failed');
            }
        });

        console.log(`Vote successfully processed for Candidate ID: ${candidateId}, Updated Vote Count: ${voteCount}`);
        return { message: 'Vote processed successfully', voteCount };
    } catch (error) {
        console.error('Error processing job:', error.message);
        throw error;
    }
});

// Monitor queue events
queue.on('failed', (job, err) => {
    console.error(`Job failed with error: ${err.message}`);
});

queue.on('completed', (job, result) => {
    console.log(`Job completed successfully with result: ${JSON.stringify(result)}`);
});

queue.on('added', (job) => {
    console.log(`Vote job added to the queue: ${JSON.stringify(job.data)}`);
});

//ishmirti
















// User sign-in endpoint
// app.post('/signin', (req, res) => {
//     const { voter_id, dob } = req.body;

//     if (voter_id && dob) {
//         const query = `
//             SELECT 
//                 name
//             FROM voter 
//             WHERE voter_id = ? AND dob = ?`;

//         db.query(query, [voter_id, dob], (error, results) => {
//             if (error) {
//                 console.error('Database error:', error);
//                 return res.status(500).json({ error: "Internal server error" });
//             }

//             if (results.length > 0) {
//                 const user = results[0];
//                 return res.json({
//                     statusCode: 200,
//                     message: "Login successful",
//                     user: {
                       
//                         name: user.name,
//                     }
//                 });
//             } else {
//                 return res.status(401).send("Invalid Voter ID or Date of Birth");
//             }
//         });
//     } else {
//         return res.status(400).send("Please provide both Voter ID and Date of Birth");
//     }
// });


// app.post('/signin', (req, res) => {
//     const { voter_id, dob } = req.body;

//     if (voter_id && dob) {
//         const query = `
//             SELECT 
//                 name, count 
//             FROM voter 
//             WHERE voter_id = ? AND dob = ?`;

//         db.query(query, [voter_id, dob], (error, results) => {
//             if (error) {
//                 console.error('Database error:', error);
//                 return res.status(500).json({ error: "Internal server error" });
//             }

//             if (results.length > 0) {
//                 const user = results[0];

//                 // Check if the voter has already voted
//                 if (user.count === 1) {
//                     return res.status(400).json({
//                         message: "You have already voted."
//                     });
//                 }

//                 // Update the count to 1 if the voter hasn't voted yet
//                 const updateQuery = `
//                     UPDATE voter 
//                     SET count = 1 
//                     WHERE voter_id = ?`;

//                 db.query(updateQuery, [voter_id], (updateError) => {
//                     if (updateError) {
//                         console.error('Error updating count:', updateError);
//                         return res.status(500).json({ error: "Internal server error" });
//                     }

//                     // Return success response
//                     return res.json({
//                         statusCode: 200,
//                         message: "Login successful",
//                         user: {
//                             name: user.name,
//                         }
//                     });
//                 });
//             } else {
//                 return res.status(401).send("Invalid Voter ID or Date of Birth");
//             }
//         });
//     } else {
//         return res.status(400).send("Please provide both Voter ID and Date of Birth");
//     }
// });















app.post('/signin', (req, res) => {
  const { voter_id, dob } = req.body;

  if (voter_id && dob) {
      const query = `
          SELECT 
              name, count 
          FROM voter 
          WHERE voter_id = ? AND dob = ?`;

      db.query(query, [voter_id, dob], (error, results) => {
          if (error) {
              console.error('Database error:', error);
              return res.status(500).json({ error: "Internal server error" });
          }

          if (results.length > 0) {
              const user = results[0];

              // Check if the voter has already voted
              if (user.count === 1) {
                  return res.status(400).json({
                      message: "You have already voted."
                  });
              }

              // Update the count to 1 if the voter hasn't voted yet
              const updateQuery = `
                  UPDATE voter 
                  SET count = 1 
                  WHERE voter_id = ?`;

              db.query(updateQuery, [voter_id], (updateError) => {
                  if (updateError) {
                      console.error('Error updating count:', updateError);
                      return res.status(500).json({ error: "Internal server error" });
                  }

                  // Sign the JWT token
                  const payload = { voter_id };
                  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });

                  // Return success response with JWT token
                  return res.json({
                      statusCode: 200,
                      message: "Login successful",
                      user: {
                          name: user.name,
                      },
                      token: token // Include JWT token in the response
                  });
              });
          } else {
              return res.status(401).send("Invalid Voter ID or Date of Birth");
          }
      });
  } else {
      return res.status(400).send("Please provide both Voter ID and Date of Birth");
  }
});
















// API add voter information
app.post('/addVoterInfo', (req, res) => {
    const {
        citizenship_no, name, dob, gender,nea_membership_no,voter_id, issued_date, issued_name, contact, email
    } = req.body;

    const searchSql = 'SELECT * FROM voter WHERE email = ? OR voter_id = ? OR citizenship_no = ?';
    db.query(searchSql, [email, voter_id, citizenship_no], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length > 0) {
            return res.status(409).send({ message: "Voter already exists." });
        } else {
            const insertSql = `
                INSERT INTO voter (
                    citizenship_no, name, dob, gender,nea_membership_no, voter_id, issued_date, issued_name, contact, email
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(insertSql, [
                citizenship_no, name, dob, gender, nea_membership_no,voter_id, issued_date, issued_name,  contact, email
            ], (error) => {
                if (error) {
                    console.error('Insert error:', error);
                    return res.status(500).json({ error: "Failed to add voter information" });
                }

                return res.json({
                    statusCode: 200,
                    message: "Voter added successfully"
                });
            });
        }
    });
});




// API add candidate information
app.post('/addCandidateInfo', (req, res) => {
    const {
        id, citizenship_no, name, dob, gender, nea_membership_no, voter_id,
        authorizer_position, contact, email, candidate_id, party_name,
        voting_date, start_time, ending_time
    } = req.body;

    const searchSql = 'SELECT * FROM candidate WHERE email = ? OR voter_id = ? OR candidate_id = ?';
    db.query(searchSql, [email, voter_id, candidate_id], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: "Candidate already exists." });
        }

        const insertSql = `
            INSERT INTO candidate (
                id, citizenship_no, name, dob, gender, nea_membership_no, voter_id,
                authorizer_position, contact, email, candidate_id, party_name, 
                voting_date, start_time, ending_time
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(insertSql, [
            id, citizenship_no, name, dob, gender, nea_membership_no, voter_id,
            authorizer_position, contact, email, candidate_id, party_name,
            voting_date, start_time, ending_time
        ], (error) => {
            if (error) {
                console.error('Insert error:', error);
                return res.status(500).json({ error: "Failed to add candidate information" });
            }

            return res.json({
                statusCode: 200,
                message: "Candidate added successfully"
            });
        });
    });
});










// API get all voters
app.get('/getAllVoter', (req, res) => {
    db.query('SELECT * FROM voter', (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: "Failed to fetch voters" });
        }

        // Return consistent structure
        res.json({
            statusCode: 200,
            message: "All Voter Information",
            info: results, 
        });
    });
});






// API get all candidates
app.get('/getAllCandidate', (req, res) => {
    db.query('SELECT * FROM candidate', (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: "Failed to fetch candidates" });
        }

        res.json({
            statusCode: 200,
            message: "All Candidate Information",
            info: results  
            
        });
    });
});



//  delete voter
app.post('/deleteVoter', (req, res) => {
    const { voter_id, name } = req.body;

    db.query('DELETE FROM voter WHERE voter_id = ? AND name = ?', [voter_id, name], (error, results) => {
        if (error) {
            console.error('Delete error:', error);
            return res.status(500).json({ error: "An error occurred" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "Voter not found"
            });
        }

        res.json({
            statusCode: 200,
            message: "Voter deleted successfully",
            info: results
        });
    });
});





//  delete candidate
app.post('/deleteCandidate', (req, res) => {
    const { candidate_id, name } = req.body;

    db.query('DELETE FROM candidate WHERE candidate_id = ? AND name = ?', [candidate_id, name], (error, results) => {
        if (error) {
            console.error('Delete error:', error);
            return res.status(500).json({ error: "An error occurred" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "Candidate not found"
            });
        }

        res.json({
            statusCode: 200,
            message: "Candidate deleted successfully",
            info: results
        });
    });
});







// API get the total number of candidates
app.get('/totalCandidates', (req, res) => {
    contract.methods.candidateCount().call()
        .then(count => {
            res.json({
                statusCode: 200,
                message: "Total Candidates",
                count: count
            });
        })
        .catch(err => {
            console.error('Error fetching candidate count:', err);
            res.status(500).json({ error: "Failed to fetch candidate count" });
        });
});





// API get candidate information by ID
app.get('/candidate/:id', (req, res) => {
    const candidateId = req.params.id;

    contract.methods.candidates(candidateId).call()
        .then(candidate => {
            res.json({
                statusCode: 200,
                message: "Candidate Information",
                data: candidate
            });
        })
        .catch(err => {
            console.error('Error fetching candidate:', err);
            res.status(500).json({ error: "Failed to fetch candidate" });
        });
});










// Admin login api
// app.post('/adminlogin', (req, res) => {
//     const { user_name, email, password, admin_no } = req.body;

   
//     if (user_name && email && password && admin_no != null && admin_no !== '') {
//         const query = 'SELECT * FROM loginadmin WHERE user_name = ? AND email = ? AND password = ? AND admin_no = ?';
//         db.query(query, [user_name, email, password, admin_no], (error, results) => {
//             if (error) {
//                 console.error('Database error:', error);
//                 return res.status(500).json({ error: "Internal server error" });
//             }

//             if (results.length > 0) {
//                 return res.json({
//                     statusCode: 200,
//                     message: "Login successful",
//                     user: results[0]
//                 });
//             } else {
//                 return res.status(401).json({
//                     statusCode: 401,
//                     message: "Invalid credentials"
//                 });
//             }
//         });
//     } else {
//         return res.status(400).json({
//             statusCode: 400,
//             message: "Please provide all required fields"
//         });
//     }
// });




























app.post('/adminlogin', (req, res) => {
    const { admin_no, user_name, email, password } = req.body;

    if (admin_no && user_name && email && password) {
        const query = `
            SELECT admin_no, user_name, email, password
            FROM loginadmin
            WHERE admin_no = ? AND user_name = ? AND email = ? AND password = ?`;

        db.query(query, [admin_no, user_name, email, password], (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (results.length > 0) {
                const user = results[0];
                return res.json({
                    statusCode: 200,
                    message: "Login successful",
                    user: {
                        admin_no: user.admin_no,
                        user_name: user.user_name,
                        email: user.email,
                       
                    }
                });
            } else {
                return res.status(401).send("Invalid your information");
            }
        });
    } else {
        return res.status(400).send("Please provide all required fields");
    }
});


















app.get('/fetchCandidates', async (req, res) => {
    try {
        const candidateCount = await contract.methods.candidateCount().call();
        console.log(`Total candidates: ${candidateCount}`);


        const deleteSql = 'DELETE FROM mycandidate';
        db.query(deleteSql, (err) => {
            if (err) {
                console.error('Error deleting old candidates:', err.message);
                return res.status(500).send('Error deleting old candidates');
            }
        });

    
        for (let i = 0; i < candidateCount; i++) {
            const candidate = await contract.methods.candidates(i).call();
            const { name, party, voteCount } = candidate;
            const sql = `
                INSERT INTO mycandidate (id, name, party, voteCount)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE name = ?, party = ?, voteCount = ?`;

            db.query(sql, [i, name, party, voteCount, name, party, voteCount], (err) => {
                if (err) {
                    console.error(`Error inserting candidate ${i}:`, err.message);
                    return res.status(500).send('Error inserting candidates');
                }
            });
        }

        res.json({ message: 'Candidates fetched and stored successfully!' });
    } catch (error) {
        console.error('Error fetching candidates from the blockchain:', error.message);
        res.status(500).send('Error fetching candidates');
    }
});











// api jo le vote count update garxa
// app.post('/vote', async (req, res) => {
//     const { candidateId } = req.body;

//     if (candidateId === undefined) {
//         return res.status(400).send('Candidate ID is required');
//     }

//     try {
//         const accounts = await web3.eth.getAccounts();
//         const voterAccount = accounts[0];

       
//         await contract.methods.vote(candidateId).send({ from: voterAccount });

//         const updatedCandidate = await contract.methods.candidates(candidateId).call();
//         const { voteCount } = updatedCandidate;

//         const sql = 'UPDATE mycandidate SET voteCount = ? WHERE id = ?';
//         db.query(sql, [voteCount, candidateId], (err, result) => {
//             if (err) {
//                 console.error('Error updating vote count in database:', err.message);
//                 return res.status(500).send('Error updating vote count');
//             }

//             if (result.affectedRows === 0) {
//                 return res.status(404).send('Candidate not found');
//             }

//             res.json({ message: 'Vote recorded successfully', voteCount });
//         });
//     } catch (error) {
//         console.error('Error recording vote:', error.message);
//         res.status(500).send('Error recording vote');
//     }
// });













//ishmirti
app.post('/vote', async (req, res) => {
    const { candidateId } = req.body;

    if (candidateId === undefined) {
        return res.status(400).send('Candidate ID is required');
    }

    try {
        const voterAccount = (await web3.eth.getAccounts())[0]; 

        const now = Math.floor(Date.now() / 1000);
        if (now !== currentSecond) {
            currentSecond = now;
            transactionCounter = 0; 
        }

        if (transactionCounter < 10) {
            transactionCounter++; 
            
            // Process transaction directly
            console.log(`Processing vote immediately for Candidate ID: ${candidateId}, Voter Account: ${voterAccount}`);
            await contract.methods.vote(candidateId).send({ from: voterAccount });

            // Fetch updated vote count from the blockchain
            const updatedCandidate = await contract.methods.candidates(candidateId).call();
            const { voteCount } = updatedCandidate;

      
            const sql = 'UPDATE mycandidate SET voteCount = ? WHERE id = ?';
            db.query(sql, [voteCount, candidateId], (err) => {
                if (err) {
                    console.error('Error updating vote count in database:', err.message);
                    return res.status(500).send('Error updating vote count');
                }
            });

            return res.json({ message: 'Vote recorded successfully', voteCount });
        } else {


            // Add the vote to the queue if 2 votes are already processed
            console.log(`Vote added to the queue for Candidate ID: ${candidateId}, Voter Account: ${voterAccount}`);
            await queue.add({ candidateId, voterAccount });

            return res.json({ message: 'High traffic detected. Your vote has been added to the queue.' });
        }
    } catch (error) {
        console.error('Error processing vote:', error.message);
        res.status(500).send('Error processing vote');
    }
});










// API voter ko count 1 banaune 
app.post('/check-voter', (req, res) => {
    const { voter_id } = req.body;

    if (!voter_id) {
        return res.status(400).json({ status: 'error', message: 'Voter ID is required.' });
    }

    const query = 'SELECT count FROM voter WHERE voter_id = ?';

    db.query(query, [voter_id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ status: 'error', message: 'Internal server error.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Voter ID not found.' });
        }

        const { count } = results[0];
        if (count === 0) {
            const updateQuery = 'UPDATE voter SET count = 1 WHERE voter_id = ?';
            db.query(updateQuery, [voter_id], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating count:', updateErr);
                    return res.status(500).json({ status: 'error', message: 'Failed to update count.' });
                }
            
                res.json({ status: 'redirect', message: 'Redirecting to the next page.' });
            });
        } else {
           
            res.json({ status: 'error', message: 'You have already voted.' });
        }
    });
});






















//node mailor ko ho aihle useful xaina
app.post('/send-email', (req, res) => {
    const { subject, recipient } = req.body; 

    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'cadetlalit311@gmail.com',  
            pass: 'asml empc ylwx mgzj'       
        }
    });

    const filePath = path.join(__dirname, '..', 'public', 'vote_candidate.html');
    console.log('Attempting to read HTML file at:', filePath);  

    
    fs.readFile(filePath, 'utf8', (err, htmlContent) => {
        if (err) {
            console.error('Error reading HTML file:', err);
            return res.status(500).send('Failed to read HTML file');
        }

       
        const mailOptions = {
            from: 'cadetlalit311@gmail.com', 
            to: recipient,                
            subject: subject,               
            html: htmlContent              
        };

        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Failed to send email');
            }
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        });
    });
});











app.get('/voter/:voter_id', async (req, res) => {
    const voterId = req.params.voter_id;
  
    const query = 'SELECT * FROM voter WHERE voter_id = ?';
    db.execute(query, [voterId], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Voter not found' });
      }
  
      const voter = results[0];
  
      //  QR Code generate hunxa with all details
      const qrData = {
        voter_id: voter.voter_id,
        name: voter.name,
        dob: voter.dob,
        gender: voter.gender,
        nea_membership_no:voter.nea_membership_no,
        issued_date: voter.issued_date,
        issued_name: voter.issued_name,
        authorizer_position: voter.authorizer_position,
        contact: voter.contact,
        email: voter.email
      };
  
      const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
  
     
      const doc = new pdfkit({ size: [250, 400] }); // Standard card size
      const filename = `voter-${voter.voter_id}.pdf`;
  
    
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  
     
      doc.pipe(res);
  
  
      doc.rect(0, 0, 250, 400).fill('#f0f4f8'); 
      doc.rect(10, 10, 230, 380).stroke('#2d88ff').lineWidth(2); 
  
      doc.fontSize(16).font('Helvetica-Bold').fillColor('#2d88ff')
        .text('Voter ID Card', 20, 20, { align: 'center' });
  
      doc.fontSize(10).fillColor('#000').font('Helvetica');
      const textStartX = 20;
      const textStartY = 50;
      const lineSpacing = 15;
  
      doc.text(`Voter ID: ${voter.voter_id}`, textStartX, textStartY + lineSpacing );
      doc.text(`Email: ${voter.email}`, textStartX, textStartY + lineSpacing * 7);
      doc.text(`Name: ${voter.name}`, textStartX, textStartY + lineSpacing *2);
      doc.text(`Date of Birth: ${voter.dob}`, textStartX, textStartY + lineSpacing * 5);
      doc.text(`Gender: ${voter.gender}`, textStartX, textStartY + lineSpacing * 4);
      doc.text(`nea_membership_no: ${voter.nea_membership_no}`, textStartX, textStartY + lineSpacing *3);
      doc.text(`Contact: ${voter.contact}`, textStartX, textStartY + lineSpacing * 6);
  
     
      doc.image(qrCode, 150, 50, { fit: [80, 80] });
  
      
      doc.fontSize(8).fillColor('#888').text('Authorized by Election Commission of Nepal,Nepal Engineering Association', 20, 180, { align: 'center' });
  
     
      doc.end();
    });
  });
  



















// yo duita contract address dynimically rakhna lai ho
//   app.post('/api/contract', (req, res) => {
//     const { contractAddress } = req.body;
    
//     const query = `INSERT INTO contract (contractAddress) VALUES (?) 
//                    ON DUPLICATE KEY UPDATE contractAddress = ?`;
  
//     db.query(query, [contractAddress, contractAddress], (error, results) => {
//       if (error) {
//         res.status(500).send({ message: 'Error updating contract address', error });
//       } else {
//         res.status(200).send({ message: 'Contract address updated', data: results });
//       }
//     });
//   });






app.post('/api/contract', (req, res) => {
    const { contractAddress, start_time, ending_time } = req.body;
    
    const query = `
      INSERT INTO contract (contractAddress, start_time, ending_time) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE 
        contractAddress = VALUES(contractAddress), 
        start_time = VALUES(start_time), 
        ending_time = VALUES(ending_time)`;

    db.query(query, [contractAddress, start_time, ending_time], (error, results) => {
      if (error) {
        res.status(500).send({ message: 'Error updating contract address', error });
      } else {
        res.status(200).send({ message: 'Contract address and times updated', data: results });
      }
    });
});

  

  app.get('/api/contract', (req, res) => {
    const query = 'SELECT contractAddress FROM contract ORDER BY id DESC LIMIT 1';
  
    db.query(query, (error, results) => {
      if (error) {
        res.status(500).send({ message: 'Error fetching contract address', error });
      } else {
        const contractAddress = results[0]?.contractAddress || 'No address found';
        res.status(200).send({ contractAddress });
      }
    });
  });
  


  














//search garna ko lagi banako api
  app.get('/getVoterById/:voterId', (req, res) => {
    const voterId = req.params.voterId;
    db.query('SELECT * FROM voter WHERE voter_id = ?', [voterId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: "Failed to fetch voter by ID" });
        }

        if (results.length > 0) {
            res.json({
                statusCode: 200,
                message: "Voter Information Found",
                info: results[0],
            });
        } else {
            res.status(404).json({
                statusCode: 404,
                message: "Voter not found",
            });
        }
    });
});



  











app.post("/login", (req, res) => {
    const { voter_id, dob } = req.body;
  
    // Query to find voter
    const query = "SELECT * FROM voter WHERE voter_id = ? AND dob = ?";
  
    db.query(query, [voter_id, dob], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
  
      if (results.length > 0) {
        const payload = { voter_id };
  
        // Sign the JWT token
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  
        // Return the token in the response
        res.json({ token });
      } else {
        res.status(400).json({ message: "Invalid voter_id or date of birth" });
      }
    });
  });






  // app.post('/validate', (req, res) => {
  //   const { token, voter_id } = req.body;
  
  //   console.log('Validation Request Received:', req.body);
  
  //   if (!token || !voter_id) {
  //     return res.status(400).json({ message: 'Token and ID are required.' });
  //   }
  
  //   try {
  //     // Verify the JWT token
  //     const decoded = jwt.verify(token, SECRET_KEY);
  
  //     if (decoded.voter_id === voter_id) {
  //       return res.json({ message: 'Validation successful!' });
  //     } else {
  //       return res.status(401).json({ message: 'ID does not match the token.' });
  //     }
  //   } catch (err) {
  //     return res.status(401).json({ message: 'Invalid token. Please login again.' });
  //   }
  // });
  










  app.post('/validate', (req, res) => {
    const { voter_id } = req.body;  // Only the voter_id will be passed
  
    console.log('Validation Request Received:', req.body);
  
    if (!voter_id) {
      return res.status(400).json({ message: 'Voter ID is required.' });
    }
  
    // Retrieve token from Authorization header (Authorization: Bearer <token>)
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer header
  
    if (!token) {
      return res.status(400).json({ message: 'Token is missing. Please log in again.' });
    }
  
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, SECRET_KEY);
  
      // Validate that the voter_id in the token matches the provided voter_id
      if (decoded.voter_id === voter_id) {
        return res.json({ message: 'Validation successful!' });
      } else {
        return res.status(401).json({ message: 'Voter ID does not match the token.' });
      }
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
  });
  

















app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
