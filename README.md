# 🗳️ Blockchain-Based Electronic Voting System

---

## 📜 Introduction

A revolutionary **blockchain-based electronic voting system** designed specifically for **developing countries like Nepal**. This technology aims to bring **fundamental reforms** to electoral systems while opening new possibilities for **digital security and transparency** in democratic processes.

**🎯 Key Vision:**
- Transform electoral systems in developing nations
- Introduce new paradigms of digital security
- Enhance transparency and trust in voting processes

---

## 🏗️ System Overview

### **🎯 Target Audience**
This system is primarily designed for **small-scale and institutional elections**, aiming to make voting processes:
- ✅ **Secure**
- ✅ **Transparent** 
- ✅ **Distributed**
- ✅ **Trustworthy**

### **🛡️ Core Principles**
- **Security First**: Multi-layered authentication and encryption
- **Transparency**: Immutable blockchain records
- **Accessibility**: User-friendly interface for all demographics
- **Scalability**: Designed for Nepal's local election structure

---

## 🔄 System Workflow

### **Phase 1: 📋 Pre-Election Setup**

#### **Voter Registration Process**
- **Election Commission** collects voter data including personal details and photos
- **Digital Voter ID Cards** issued with embedded QR codes
- **QR Code Encryption**: Sensitive information stored in encrypted format
- **Secure Database**: MySQL database for secure data storage

#### **👥 Candidate Registration**
- Candidate details securely stored in database
- **Blockchain Verification**: Details uploaded to Ethereum blockchain before voting
- **Match Validation**: Only matched records are accepted on blockchain
- **Risk Reduction**: Minimizes incorrect information risks

---

## 🔐 Authentication Process

### **🛡️ Multi-Factor Authentication System**

#### **Step 1: Biometric Verification**
- **OpenCV Library** for face recognition
- **Face Scanning**: Real-time facial scanning during voting
- **Biometric Match**: Comparison with pre-registered data
- **First-Level Authentication**: Must pass to proceed

#### **Step 2: Credential Verification**
- **Voter ID Entry**: Unique identification number
- **Date of Birth Verification**: Additional personal information
- **Final Authentication**: Combined biometric and credential check
- **Access Granted**: Successful authentication allows voting

---

## 🗳️ Voting Process

### **🎯 One-Vote Per Position System**
- **Smart Contract Enforcement**: Each voter can vote only once per position
- **MetaMask Integration**: Voting through blockchain wallet transactions
- **Transaction-based Voting**: Each vote recorded as a blockchain transaction
- **Fairness & Transparency**: Ensured through smart contract logic

### **💼 MetaMask Integration**
- **Shared MetaMask Account**: All voters use admin-provided shared account
- **User-Friendly Approach**: Eliminates individual wallet complexities
- **Centralized Management**: Simplified account administration
- **Transaction Processing**: Secure voting through blockchain transactions

---

## ⚙️ Technical Architecture

### **🔗 Blockchain Layer**
- **Network**: Ethereum (Ganache) private network
- **Smart Contracts**: Developed in Solidity language
- **Interaction**: Web3.js for frontend-blockchain communication
- **Test Environment**: Limited Test Ether for testing purposes

### **💻 Backend Layer**
- **Server**: Node.js backend API and logic
- **Database**: MySQL for voter and candidate data
- **Queue System**: Redis-based BullMQ for traffic management
- **Face Recognition**: OpenCV library for biometric authentication

### **🔄 System Flow**
- **Authentication**: OpenCV face recognition → Credential verification
- **Voting**: MetaMask transaction → Smart contract validation → Blockchain recording
- **Results**: Blockchain vote aggregation → Web3.js display → Frontend results

---

## 🛡️ Security Features

### **🔒 Immutable Records**
- **Blockchain Security**: Once recorded, data cannot be altered
- **Data Recovery**: Database backup from blockchain if compromised
- **Tamper Evidence**: Immediate detection of unauthorized changes
- **Immutable Characteristic**: One-time recorded data cannot be changed

### **🎯 Anti-Fraud Measures**
1. **Single Vote Enforcement** via Smart Contracts
2. **Multi-factor Authentication** (Face + Credentials)
3. **Encrypted QR Codes** on voter IDs
4. **Centralized Account Management**
5. **Blockchain Verification** for all transactions

---

## 📊 Results & Verification

### **🔍 Transparent Result Calculation**
- **Blockchain Vote Aggregation**: Automatic tally from blockchain
- **Smart Contract Tally**: Fair calculation through contract logic
- **Web3.js Frontend Display**: Real-time result visualization
- **Contract Address Verification**: Independent result verification

### **✅ Verification Capabilities**
- **Smart Contract Address**: Available at election start for verification
- **Dispute Resolution**: Blockchain as single source of truth
- **Audit Trail**: Complete voting history accessible
- **Data Integrity**: Even if commission members tamper with system, blockchain data remains secure

---

## 🚀 Future Enhancements

### **📅 Planned Features**
- **Remote Voting**: Enable voting from remote locations
- **Mobile Interface**: Mobile-optimized voting experience  
- **Additional Biometrics**: Enhanced authentication methods
- **Multi-language Support**: Support for regional languages
- **Advanced Features**: More biometric facilities and interfaces

---

## 👥 Development Team

### **🏫 Everest Engineering College, Sanepa, Lalitpur**

**Team Members:**
- **Smriti Acharya**
- **Kanchan Rai**
- **Lalit Pant**
- **Shirish Tripathi**

### **🔧 Technologies Used**

Blockchain:
• Ethereum (Ganache)
• Solidity Smart Contracts
• Web3.js Integration
• MetaMask Wallet

Backend:
• Node.js
• MySQL Database
• BullMQ Queue System (Redis-based)
• OpenCV Face Recognition

Security:
• Multi-factor Authentication
• QR Code Encryption
• Blockchain Immutability
• Secure Database Storage

---

## 🏆 Key Differentiators

### **🌟 Why Our System Stands Out**
1. **🇳🇵 Nepal-Specific Design**: Tailored for local election structures
2. **👥 Shared Wallet System**: Simplified user experience
3. **🔐 Enhanced Security**: Multiple authentication layers  
4. **📱 User-Friendly**: Accessible to all demographics
5. **🔍 Full Transparency**: Verifiable at every step
6. **💼 Centralized Management**: Easier administration

### **💡 Innovation Points**
- **Shared MetaMask Account**: Unique approach for easier management
- **Hybrid Architecture**: Centralized database + decentralized blockchain
- **Cost-Effective**: Practical implementation for developing nations
- **Scalable Design**: From institutional to national elections
- **Local Adaptation**: Specifically designed for Nepal's context

---

## 📋 Installation Guide

### **Prerequisites**
```bash
# Required Software
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Ganache CLI
- MetaMask Browser Extension
- Python 3.7+ (for OpenCV)

## 📋 Install Dependencies
# Install backend dependencies
npm install

# Install smart contract dependencies
cd contracts
npm install

# Install Python dependencies for OpenCV
pip install opencv-python numpy flask

## 📋 Database Setup
# Start MySQL service
sudo service mysql start

# Create database and user
mysql -u root -p
CREATE DATABASE voting_system;
CREATE USER 'voting_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON voting_system.* TO 'voting_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

## 📋 Configuration
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env

## 📋 Environment variables to configure:
DB_HOST=localhost
DB_USER=voting_user
DB_PASSWORD=secure_password
DB_NAME=voting_system
BLOCKCHAIN_NETWORK=http://localhost:7545
JWT_SECRET=your_jwt_secret_key
REDIS_HOST=localhost
REDIS_PORT=6379

## 📋 Start Services
# Start Redis server
redis-server

# Start Ganache blockchain
ganache-cli

# Deploy smart contracts
npm run deploy-contracts

# Start backend server
npm start

# Start frontend application
npm run client
# 📖 Usage Guide

This section provides detailed instructions on how to use the Blockchain-Based Electronic Voting System for different user roles.

---

## 👨‍💼 For Election Administrators

### 🔧 **Setup Election**

#### Step 1: System Initialization
1. **Login to Admin Dashboard**

2. **Configure Election Parameters**
```javascript
// Election Configuration Panel
{
  "electionName": "Local Election 2024",
  "electionType": "Municipal",
  "startDate": "2024-05-15T08:00:00",
  "endDate": "2024-05-15T17:00:00",
  "votingHours": "8:00 AM - 5:00 PM",
  "positions": [
    "Mayor",
    "Deputy Mayor",
    "Ward Chairperson"
  ],
  "regions": ["Kathmandu", "Lalitpur", "Bhaktapur"]
}

# 📖 Set Voting Rules
- Maximum votes per voter: 1 per position

- Minimum voting age: 18 years

- Registration deadline: 30 days before election

- Early voting: Disabled

- Result announcement: Immediately after voting closes

## 📖 System Configuration
# Command Line Configuration (Optional)
$ npm run configure -- --election="local-2024" --type="municipal"
$ npm run setup -- --voters=1000 --candidates=50
## 👥 Manage Voters
**Prepare CSV File**
voter_id,full_name,date_of_birth,citizenship_number,address,phone_number,email
V001,राम बहादुर श्रेष्ठ,1990-05-15,123-456-789,काठमाडौं,9841000001,ram@example.com
V002,सिता देवी,1992-08-20,987-654-321,ललितपुर,9841000002,sita@example.com
**Upload Voter Data**
# Upload via Admin Panel or API
$ curl -X POST https://api.election.gov.np/v1/voters/bulk-upload \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "file=@voters.csv"
## Process Registration
-- System validates each entry

-- Generates unique Voter ID

-- Creates digital voter card with QR code

-- Sends registration confirmation
┌─────────────────────────────────────┐
│        Voter Registration Form      │
├─────────────────────────────────────┤
│ Full Name: ________________________ │
│ Date of Birth: __/__/____           │
│ Citizenship No: ___________________ │
│ Address: __________________________ │
│ Contact: __________________________ │
│ Photo: [Upload Button]             │
└─────────────────────────────────────┘
## Voter Card Template
╔════════════════════════════════════╗
║        NEPAL ELECTION COMMISSION   ║
║        DIGITAL VOTER ID CARD       ║
╠════════════════════════════════════╣
║ Photo: [Voter Photo]               ║
║                                    ║
║ Voter ID: V-KTM-005-1234          ║
║ Name: राम बहादुर श्रेष्ठ           ║
║ DOB: 1990-05-15                   ║
║ Address: काठमाडौं                 ║
║                                    ║
║ QR Code: [Secure QR Code]         ║
║ Issue Date: 2024-04-01            ║
║ Valid Until: 2029-03-31           ║
╚════════════════════════════════════╝
## Verification Dashboard
Voter Verification Dashboard
┌─────────────────────────────────────┐
│ Total Voters: 1,000                 │
│ Verified: 950 (95%)                │
│ Pending: 50 (5%)                   │
│ Rejected: 0 (0%)                   │
├─────────────────────────────────────┤
│ Recent Activity:                    │
│ 10:30 - V001: Verified ✅          │
│ 10:35 - V002: Verified ✅          │
│ 10:40 - V003: Pending ⏳          │
└─────────────────────────────────────┘
## Main Dashboard View
Election Monitoring Dashboard - Local Election 2024
═══════════════════════════════════════════════════

📈 Overall Statistics:
├── Total Registered Voters: 10,000
├── Votes Cast: 7,850 (78.5%)
├── Current Hour Turnout: 420 votes
├── Estimated Final Turnout: 85%

🕐 Hourly Progress:
├── 8:00-9:00: 450 votes
├── 9:00-10:00: 620 votes ▲
├── 10:00-11:00: 780 votes ▲
├── 11:00-12:00: 850 votes ▲

🗺️ Regional Distribution:
├── Kathmandu: 3,200 votes (80%)
├── Lalitpur: 2,500 votes (75%)
├── Bhaktapur: 2,150 votes (85%)

⚠️ Alerts:
├── Polling Station 5: High queue (45 mins)
├── Station 12: Technical issue reported
└── Station 8: Need more ballot papers
## Progress Visualization
Voting Progress Timeline
[████████████████████] 78.5% - Voting Phase

Phase              Progress    Status
──────────────────────────────────────
Registration      ████████████ 100% ✅
Voter Verification███████████▌ 95%  ⏳
Voting Period     ██████████▌  78.5%▶️
Vote Counting     ░░░░░░░░░░░  0%   ⏸️
Result Declaration░░░░░░░░░░░  0%   ⏸️

Estimated Time Remaining: 2 hours 15 minutes
## Issue Dashboard
Issue Management Dashboard
┌─────────────────────────────────────┐
│ Open Issues: 8                      │
│ Critical: 1 ⚠️                     │
│ High: 2                            │
│ Medium: 3                          │
│ Low: 2                             │
├─────────────────────────────────────┤
│ Recent Issues:                      │
│ [CRITICAL] PS-12: Server Down      │
│ Time: 10:45 | Status: Investigating│
│                                     │
│ [HIGH] PS-05: Long Queue           │
│ Time: 10:30 | Status: Dispatching  │
│                                     │
│ [MEDIUM] PS-08: Paper Shortage     │
│ Time: 10:15 | Status: Resolved ✅  │
└─────────────────────────────────────┘
<img width="1907" height="412" alt="Screenshot 2025-02-24 111347" src="https://github.com/user-attachments/assets/0dd2441c-1641-439e-afe8-a2c0a70861fd" />
<img width="1897" height="848" alt="Screenshot 2025-02-24 111309" src="https://github.com/user-attachments/assets/5d7df76f-8a59-4aa1-8481-8213fde4597f" />
<img width="1138" height="797" alt="Screenshot 2025-02-24 111019" src="https://github.com/user-attachments/assets/12fb7747-3ab5-403f-8291-af65ecb74893" />
<img width="1061" height="779" alt="Screenshot 2025-02-24 111004" src="https://github.com/user-attachments/assets/14219b36-b677-4ac8-b286-260ffa2f8d5b" />
<img width="433" height="415" alt="Screenshot 2025-02-24 110935" src="https://github.com/user-attachments/assets/af070ffd-31f9-4ce2-b5f6-c6935aab0637" />
<img width="1920" height="1080" alt="Screenshot (180)" src="https://github.com/user-attachments/assets/295446d1-c66c-42b3-8134-6fea79a37964" />
<img width="1918" height="783" alt="Screenshot 2025-07-02 144248" src="https://github.com/user-attachments/assets/c968996d-02f2-48cb-a22f-660c3b6a4911" />
<img width="849" height="380" alt="Screenshot 2025-07-02 144210" src="https://github.com/user-attachments/assets/f3028d1e-fdf8-4cbd-9b17-afe4cd840a9d" />
<img width="1896" height="853" alt="Screenshot 2025-02-24 170339" src="https://github.com/user-attachments/assets/b2c4a184-1089-48bc-a02c-9f81940e77ce" />
<img width="1905" height="912" alt="Screenshot 2025-02-24 162324" src="https://github.com/user-attachments/assets/02fe9624-b0ab-48db-bb4a-e3e1ce937634" />
<img width="691" height="587" alt="Screenshot 2025-02-24 162306" src="https://github.com/user-attachments/assets/1f8dd25b-5b11-482a-a128-86e0a2f5d529" />
<img width="1895" height="871" alt="Screenshot 2025-02-24 122653" src="https://github.com/user-attachments/assets/68577f5b-b5ab-4fec-a6e0-149a0eb4f2c1" />
<img width="1716" height="797" alt="Screenshot 2025-02-24 122506" src="https://github.com/user-attachments/assets/fc128983-5e38-444c-9b31-301f2883e2da" />
<img width="1046" height="841" alt="Screenshot 2025-02-24 122439" src="https://github.com/user-attachments/assets/e7f2537f-939d-48bb-8b4f-c4141b4dd582" />
<img width="1890" height="996" alt="Screenshot 2025-02-24 121753" src="https://github.com/user-attachments/assets/0dad2eff-f787-4b1d-8269-819cfb7e0aea" />
<img width="541" height="385" alt="Screenshot 2025-02-24 111550" src="https://github.com/user-attachments/assets/d65bbe31-c372-4f40-a938-787616c5d020" />
<img width="546" height="378" alt="Screenshot 2025-02-24 111539" src="https://github.com/user-attachments/assets/f3e1a4a4-0e1a-437d-80ff-4543386d670c" />
<img width="1909" height="412" alt="Screenshot 2025-02-24 111522" src="https://github.com/user-attachments/assets/989fce4f-8f44-4b89-a8df-0bf6f9950421" />
<img width="1091" height="724" alt="Screenshot 2025-02-24 111455" src="https://github.com/user-attachments/assets/c9a04bf1-597b-42a6-b465-ba7be57facaf" />
<img width="421" height="656" alt="Screenshot 2025-02-24 111433" src="https://github.com/user-attachments/assets/cabb74c2-28ae-4709-86d5-17ca22d2b449" />

