# NFT Battle Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.26.1-yellow.svg)](https://hardhat.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.3-646CFF.svg)](https://vitejs.dev/)

> A decentralized turn-based battle game where players mint unique character NFTs and battle against a powerful boss. Built with Solidity smart contracts and a React frontend, demonstrating full-stack Web3 development.

## Features

### Gameplay Features
- **Character NFT Minting** - Mint unique ERC-721 character NFTs with different stats
- **Turn-Based Combat** - Strategic battles against the Shadow Dragon boss  
- **Real-Time Updates** - Live battle updates via Web3 event listeners
- **Character Revival** - Defeated players can revive and continue fighting
- **Attack Cooldown** - Strategic timing with 5-second attack cooldowns

### Technical Features
- **Smart Contracts** - Secure Solidity contracts with OpenZeppelin standards
- **MetaMask Integration** - Seamless wallet connection and transaction handling
- **Modern React Frontend** - Responsive UI built with React 19 and Vite
- **Event-Driven Architecture** - Real-time game state synchronization
- **Multi-Network Support** - Local development and Sepolia testnet ready

## Architecture

### Smart Contracts

| Contract | Purpose | Key Features |
|----------|---------|--------------|
| **GameCharacter.sol** | ERC-721 NFT Contract | Character minting, metadata generation, attribute management |
| **BattleLogic.sol** | Battle System | Turn-based combat, cooldowns, boss management, events |

### Frontend Stack

- **React 19** - Modern UI framework with latest features
- **Vite** - Fast development server and build tool
- **Ethers.js v6** - Web3 integration and blockchain interaction
- **Custom Hooks** - `useWallet`, `useContracts`, `useBattleActions`

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MetaMask](https://metamask.io/) browser extension
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RecheDev/NFT-Game-Battle.git
   cd NFT-Game-Battle
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start local blockchain**
   ```bash
   npx hardhat node
   ```

4. **Deploy contracts** (in a new terminal)
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. **Provide contract addresses**

   Set the deployed addresses as environment variables for the frontend:
   ```bash
   export VITE_GAME_CHARACTER_ADDRESS=<deployed GameCharacter address>
   export VITE_BATTLE_LOGIC_ADDRESS=<deployed BattleLogic address>
   ```

6. **Start the frontend**
   ```bash
   npm run dev
   ```

7. **Configure MetaMask**
   - Add Hardhat network: `http://127.0.0.1:8545`, Chain ID `31337`
   - Import a test account using a private key from Hardhat node output

## How to Play

### 1. Connect Wallet
Connect your MetaMask wallet and ensure you're on the correct network

### 2. Choose Your Hero
Select from three character classes:

| Character | HP | Attack | Strategy |
|-----------|----|----|----------|
| **Warrior** | 100 | 25 | Balanced stats, perfect for beginners |
| **Mage** | 80 | 30 | High damage, glass cannon build |
| **Archer** | 90 | 20 | Consistent damage, reliable choice |

### 3. Enter Battle
Face the **Shadow Dragon** (1000 HP, 50 Attack) in epic turn-based combat

### 4. Victory Conditions
- Deal damage while managing your HP
- Use revival system if defeated
- Defeat the boss to claim victory!

## Development

### Smart Contract Commands

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Run specific test
npx hardhat test test/GameCharacter.test.js

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### Frontend Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
nft-battle-game/
├── contracts/              # Solidity smart contracts
│   ├── GameCharacter.sol   # ERC-721 character NFT contract
│   └── BattleLogic.sol     # Battle system logic
├── scripts/                # Deployment scripts
│   └── deploy.js          # Contract deployment
├── test/                   # Smart contract tests
│   ├── GameCharacter.test.js
│   └── BattleLogic.test.js
├── src/                    # React frontend
│   ├── components/        # UI components
│   ├── hooks/            # Custom React hooks
│   ├── constants/        # Configuration
│   └── utils/            # Helper functions
├── hardhat.config.js      # Hardhat configuration
├── package.json          # Dependencies
└── README.md            # This file
```

## Network Configuration

### Local Development (Hardhat)
- **RPC URL**: `http://127.0.0.1:8545`
- **Chain ID**: `31337`
- **Currency**: ETH (test)

### Sepolia Testnet
- **Chain ID**: `11155111`
- **Currency**: SepoliaETH
- **Faucet**: [Get testnet ETH](https://sepoliafaucet.com/)

### Environment Variables

Create a `.env` file for testnet deployment:
```bash
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
PRIVATE_KEY=your-private-key-here
```

## Testing

Comprehensive test coverage for all smart contract functionality:

**GameCharacter Tests:**
- Character minting and ownership
- NFT transfers and approvals  
- Metadata generation and Base64 encoding
- Character attribute management

**BattleLogic Tests:**
- Combat mechanics and damage calculation
- Attack cooldown enforcement
- Event emission verification
- Player revival system

```bash
# Run all tests
npm test

# Run with gas reporting
REPORT_GAS=true npm test
```

## Security Features

- **Access Control** - Owner-only functions with OpenZeppelin's `Ownable`
- **Input Validation** - Comprehensive parameter checking
- **Reentrancy Protection** - Safe contract interaction patterns
- **Event Logging** - Complete audit trail of all actions
- **No Hardcoded Values** - Configurable parameters and constants

## Deployment Guide

### Local Deployment
1. Start Hardhat node: `npx hardhat node`
2. Deploy contracts: `npx hardhat run scripts/deploy.js --network localhost`
3. Set `VITE_GAME_CHARACTER_ADDRESS` and `VITE_BATTLE_LOGIC_ADDRESS` in your environment
4. Start frontend: `npm run dev`

### Testnet Deployment
1. Configure `.env` with Sepolia URL and private key
2. Deploy: `npx hardhat run scripts/deploy.js --network sepolia`
3. Set `VITE_GAME_CHARACTER_ADDRESS` and `VITE_BATTLE_LOGIC_ADDRESS`
4. Build and deploy frontend

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting

## Game Mechanics

### Combat System
- **Turn-based** combat with alternating attacks
- **5-second** attack cooldown for strategic timing
- **Boss counter-attacks** after each player move
- **HP management** - battle continues until one side reaches 0 HP
- **Revival system** - players can revive after defeat

### Boss Stats
- **Name**: Shadow Dragon
- **HP**: 1000
- **Attack**: 50
- **Strategy**: High health pool requiring sustained combat

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
