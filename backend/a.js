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






const app = express();
const port = 3000;






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


const contractAddress = '0x71D37c6a81dACB6B67908F9e03873BAE783906d3'; 
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
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
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
app.post('/signin', (req, res) => {
    const { voter_id, dob } = req.body;

    if (voter_id && dob) {
        const query = `
            SELECT 
                name
            FROM voter 
            WHERE voter_id = ? AND dob = ?`;

        db.query(query, [voter_id, dob], (error, results) => {
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
                       
                        name: user.name,
                    }
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
        citizenship_no, name, dob, gender, father_name, mother_name, provience,
        district, Municipality, ward_no, voter_id, issued_date, issued_name,
        authorizer_position, contact, email, document = null
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
                    citizenship_no, name, dob, gender, father_name, mother_name, provience,
                    district, Municipality, ward_no, voter_id, issued_date, issued_name,
                    authorizer_position, contact, email, document
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(insertSql, [
                citizenship_no, name, dob, gender, father_name, mother_name, provience,
                district, Municipality, ward_no, voter_id, issued_date, issued_name,
                authorizer_position, contact, email, document
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
        citizenship_no, name, dob, gender, father_name, mother_name, provience,
        district, Municipality, ward_no, voter_id, issued_date, issued_name,
        authorizer_position, contact, email, candidate_id, party_name,
        voting_date, start_time, ending_time, document = null
    } = req.body;

    const searchSql = 'SELECT * FROM candidate WHERE email = ? OR voter_id = ? OR candidate_id = ?';
    db.query(searchSql, [email, voter_id, candidate_id], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length > 0) {
            return res.status(409).send({ message: "Candidate already exists." });
        } else {
            const insertSql = `
                INSERT INTO candidate (
                    citizenship_no, name, dob, gender, father_name, mother_name, provience,
                    district, Municipality, ward_no, voter_id, issued_date, issued_name,
                    authorizer_position, contact, email, candidate_id, party_name, 
                    voting_date, start_time, ending_time, document
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(insertSql, [
                citizenship_no, name, dob, gender, father_name, mother_name, provience,
                district, Municipality, ward_no, voter_id, issued_date, issued_name,
                authorizer_position, contact, email, candidate_id, party_name,
                voting_date, start_time, ending_time, document
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
        }
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
        father_name: voter.father_name,
        mother_name: voter.mother_name,
        province: voter.province,
        district: voter.district,
        municipality: voter.municipality,
        ward_no: voter.ward_no,
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
      doc.text(`Email: ${voter.email}`, textStartX, textStartY + lineSpacing * 12);
      doc.text(`Name: ${voter.name}`, textStartX, textStartY + lineSpacing *2);
      doc.text(`Date of Birth: ${voter.dob}`, textStartX, textStartY + lineSpacing * 10);
      doc.text(`Gender: ${voter.gender}`, textStartX, textStartY + lineSpacing * 3);
      doc.text(`Father's Name: ${voter.father_name}`, textStartX, textStartY + lineSpacing * 4);
      doc.text(`Mother's Name: ${voter.mother_name}`, textStartX, textStartY + lineSpacing * 5);
      doc.text(`Province: ${voter.provience}`, textStartX, textStartY + lineSpacing * 6);
      doc.text(`District: ${voter.district}`, textStartX, textStartY + lineSpacing * 7);
      doc.text(`Municipality: ${voter.municipality}`, textStartX, textStartY + lineSpacing * 8);
      doc.text(`Ward No: ${voter.ward_no}`, textStartX, textStartY + lineSpacing * 9);
      doc.text(`Contact: ${voter.contact}`, textStartX, textStartY + lineSpacing * 11);
  
     
      doc.image(qrCode, 150, 50, { fit: [80, 80] });
  
      
      doc.fontSize(8).fillColor('#888').text('Authorized by Election Commission of Nepal,Nepal Engineering Association', 20, 250, { align: 'center' });
  
     
      doc.end();
    });
  });
  


























app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
