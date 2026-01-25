📜 Introduction
A revolutionary blockchain-based electronic voting system designed specifically for developing countries like Nepal. This technology aims to bring fundamental reforms to electoral systems while opening new possibilities for digital security and transparency in democratic processes.

🎯 Key Vision:

Transform electoral systems in developing nations

Introduce new paradigms of digital security

Enhance transparency and trust in voting processes

🏗️ System Overview
🎯 Target Audience
This system is primarily designed for small-scale and institutional elections, aiming to make voting processes:

✅ Secure

✅ Transparent

✅ Distributed

✅ Trustworthy

🛡️ Core Principles
Security First: Multi-layered authentication and encryption

Transparency: Immutable blockchain records

Accessibility: User-friendly interface for all demographics

Scalability: Designed for Nepal's local election structure

🔄 System Workflow
Phase 1: 📋 Pre-Election Setup
Voter Registration Process
Election Commission collects voter data including personal details and photos

Digital Voter ID Cards issued with embedded QR codes

QR Code Encryption: Sensitive information stored in encrypted format

Secure Database: MySQL database for secure data storage

👥 Candidate Registration
Candidate details securely stored in database

Blockchain Verification: Details uploaded to Ethereum blockchain before voting

Match Validation: Only matched records are accepted on blockchain

Risk Reduction: Minimizes incorrect information risks

🔐 Authentication Process
🛡️ Multi-Factor Authentication System
Step 1: Biometric Verification
OpenCV Library for face recognition

Face Scanning: Real-time facial scanning during voting

Biometric Match: Comparison with pre-registered data

First-Level Authentication: Must pass to proceed

Step 2: Credential Verification
Voter ID Entry: Unique identification number

Date of Birth Verification: Additional personal information

Final Authentication: Combined biometric and credential check

Access Granted: Successful authentication allows voting

🗳️ Voting Process
🎯 One-Vote Per Position System
Smart Contract Enforcement: Each voter can vote only once per position

MetaMask Integration: Voting through blockchain wallet transactions

Transaction-based Voting: Each vote recorded as a blockchain transaction

Fairness & Transparency: Ensured through smart contract logic

💼 MetaMask Integration
Shared MetaMask Account: All voters use admin-provided shared account

User-Friendly Approach: Eliminates individual wallet complexities

Centralized Management: Simplified account administration

Transaction Processing: Secure voting through blockchain transactions

⚙️ Technical Architecture
🔗 Blockchain Layer
Network: Ethereum (Ganache) private network

Smart Contracts: Developed in Solidity language

Interaction: Web3.js for frontend-blockchain communication

Test Environment: Limited Test Ether for testing purposes

💻 Backend Layer
Server: Node.js backend API and logic

Database: MySQL for voter and candidate data

Queue System: Redis-based BullMQ for traffic management

Face Recognition: OpenCV library for biometric authentication

🔄 System Flow
Authentication: OpenCV face recognition → Credential verification

Voting: MetaMask transaction → Smart contract validation → Blockchain recording

Results: Blockchain vote aggregation → Web3.js display → Frontend results

🛡️ Security Features
🔒 Immutable Records
Blockchain Security: Once recorded, data cannot be altered

Data Recovery: Database backup from blockchain if compromised

Tamper Evidence: Immediate detection of unauthorized changes

Immutable Characteristic: One-time recorded data cannot be changed

🎯 Anti-Fraud Measures
Single Vote Enforcement via Smart Contracts

Multi-factor Authentication (Face + Credentials)

Encrypted QR Codes on voter IDs

Centralized Account Management

Blockchain Verification for all transactions

📊 Results & Verification
🔍 Transparent Result Calculation
Blockchain Vote Aggregation: Automatic tally from blockchain

Smart Contract Tally: Fair calculation through contract logic

Web3.js Frontend Display: Real-time result visualization

Contract Address Verification: Independent result verification

✅ Verification Capabilities
Smart Contract Address: Available at election start for verification

Dispute Resolution: Blockchain as single source of truth

Audit Trail: Complete voting history accessible

Data Integrity: Even if commission members tamper with system, blockchain data remains secure

🚀 Future Enhancements
📅 Planned Features
Remote Voting: Enable voting from remote locations

Mobile Interface: Mobile-optimized voting experience

Additional Biometrics: Enhanced authentication methods

Multi-language Support: Support for regional languages

Advanced Features: More biometric facilities and interfaces

👥 Development Team
🏫 Everest Engineering College, Sanepa, Lalitpur
Team Members:

Smriti Acharya

Kanchan Rai

Lalit Pant

Shirish Tripathi

🔧 Technologies Used
text
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
🏆 Key Differentiators
🌟 Why Our System Stands Out
🇳🇵 Nepal-Specific Design: Tailored for local election structures

👥 Shared Wallet System: Simplified user experience

🔐 Enhanced Security: Multiple authentication layers

📱 User-Friendly: Accessible to all demographics

🔍 Full Transparency: Verifiable at every step

💼 Centralized Management: Easier administration

💡 Innovation Points
Shared MetaMask Account: Unique approach for easier management

Hybrid Architecture: Centralized database + decentralized blockchain

Cost-Effective: Practical implementation for developing nations

Scalable Design: From institutional to national elections

Local Adaptation: Specifically designed for Nepal's context

📞 Contact & Contribution
🌐 Project Structure
text
📁 Blockchain-Voting-System/
├── 📂 contracts/     # Solidity Smart Contracts
├── 📂 backend/       # Node.js API and Server
├── 📂 frontend/      # Web3.js Interface
├── 📂 database/      # MySQL Schemas and Data
├── 📂 authentication/# OpenCV Face Recognition
└── 📂 docs/          # System Documentation
🤝 Contributing Guidelines
Follow code of conduct

Submit detailed pull requests

Include proper documentation

Test thoroughly before submission

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

⭐ "Building Trust Through Technology - One Vote at a Time"

⭐ "Transforming Democracy with Blockchain Technology"

