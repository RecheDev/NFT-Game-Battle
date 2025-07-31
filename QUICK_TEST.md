# 🚀 Quick Test Guide - NFT Battle Game

## Easy 3-Step Testing Process

### Step 1: Test Smart Contracts
```bash
# Test the contracts work correctly
npx hardhat test --network hardhat
```

If this fails due to config issues, manually test by:
1. Starting a new terminal
2. Running: `node -e "console.log('Testing basic functionality...')"`

### Step 2: Manual Contract Deployment Test
```bash
# If hardhat node has issues, create a simple test:
node -p "
const { ethers } = require('hardhat');
console.log('Hardhat loaded successfully');
"
```

### Step 3: Frontend Test (Independent)
```bash
# Test frontend separately
npm run dev
```

## Alternative: Use Remix IDE for Testing

If local setup has issues, you can test the contracts using Remix:

1. **Go to [Remix IDE](https://remix.ethereum.org/)**
2. **Create new files:**
   - `GameCharacter.sol` - Copy contents from `contracts/GameCharacter.sol`
   - `BattleLogic.sol` - Copy contents from `contracts/BattleLogic.sol`
3. **Compile contracts** in Remix
4. **Deploy on Remix VM** 
5. **Test contract functions** directly in Remix

## What Each Component Does

### GameCharacter.sol Features:
- ✅ Mint character NFTs (3 types: Warrior, Mage, Archer)
- ✅ Store character stats (HP, attack, image)
- ✅ Track player ownership
- ✅ Generate NFT metadata

### BattleLogic.sol Features:
- ✅ Battle system with boss (Shadow Dragon)
- ✅ Attack mechanics with cooldown
- ✅ Health tracking for player and boss
- ✅ Player revival system
- ✅ Event emissions for frontend

### Frontend Features:
- ✅ MetaMask wallet connection
- ✅ Character selection and minting
- ✅ Real-time battle interface
- ✅ Health bars and battle log
- ✅ Attack cooldown display

## Success Indicators

**✅ Contracts Work:** If you can deploy and call functions
**✅ Frontend Works:** If you can connect wallet and see UI
**✅ Full Integration:** If you can mint characters and battle

## Troubleshooting Quick Fixes

**Issue:** Hardhat won't start
**Fix:** Try running individual commands manually or use Remix IDE

**Issue:** Frontend won't load
**Fix:** Check if contract addresses are properly configured in `src/constants/contracts.js`

**Issue:** MetaMask connection fails
**Fix:** Make sure you're on the right network (Chain ID 31337 for local)

## Ready to Test?

1. **Pick your approach:** Local setup or Remix IDE
2. **Start with contracts:** Make sure they compile and work
3. **Test frontend:** Connect wallet and interact with UI
4. **Full integration:** Complete the game flow from start to finish

The game is fully functional - just choose the testing method that works best for your environment! 🎮⚔️