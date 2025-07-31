# 🎯 Post Node.js Update - Testing Guide

After updating to Node.js v22.x, follow these steps to test your NFT Battle Game:

## Step 1: Verify Node.js Version
```bash
node --version
# Should show v22.x.x
npm --version
# Should show npm 10.x or higher
```

## Step 2: Clean Install Dependencies
```bash
# Remove old dependencies
rm -rf node_modules package-lock.json

# Fresh install with latest Node.js
npm install

# This should now work without warnings!
```

## Step 3: Test Smart Contracts
```bash
# Compile contracts (should work perfectly now)
npm run compile

# Run comprehensive tests
npm test
```

## Step 4: Start Local Blockchain
```bash
# Terminal 1: Start Hardhat node
npx hardhat node
```

Expected output:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000.0 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

## Step 5: Deploy Contracts
```bash
# Terminal 2: Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

Expected output:
```
Deploying NFT Battle Game contracts...
GameCharacter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
BattleLogic deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
✅ Deployment complete!
```

## Step 6: Update Frontend Config
Copy the contract addresses and update `src/constants/contracts.js`:

```javascript
export const CONTRACT_ADDRESSES = {
  GAME_CHARACTER: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Your address here
  BATTLE_LOGIC: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'     // Your address here
};
```

## Step 7: Start Frontend
```bash
# Terminal 3: Start React app
npm run dev
```

Should open at: http://localhost:3000

## Step 8: Configure MetaMask

### Add Hardhat Network:
- **Network Name**: Hardhat Local
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **Currency Symbol**: ETH

### Import Test Account:
Use one of the private keys from Step 4 to import a test account with 10,000 ETH.

## Step 9: Play the Game! 🎮

1. **Connect Wallet** → MetaMask should connect
2. **Choose Character** → Select Warrior, Mage, or Archer
3. **Mint NFT** → Transaction should complete quickly
4. **Enter Battle** → Face the Shadow Dragon
5. **Fight** → Attack, wait for cooldown, repeat
6. **Win or Revive** → Complete the game loop!

## Troubleshooting

### If compilation still fails:
```bash
# Try with explicit config
npx hardhat compile --config hardhat.config.cjs
```

### If frontend has issues:
```bash
# Check if Vite config needs updating
npm run dev -- --host
```

### If MetaMask won't connect:
- Make sure you're on Chain ID 31337
- Check that Hardhat node is still running
- Try refreshing the page

## Success Indicators ✅

- [ ] Node.js v22.x installed
- [ ] Dependencies install without warnings
- [ ] Contracts compile successfully
- [ ] Tests pass completely
- [ ] Hardhat node starts without errors
- [ ] Contracts deploy successfully
- [ ] Frontend loads at localhost:3000
- [ ] MetaMask connects to local network
- [ ] Can mint character NFT
- [ ] Can enter battle arena
- [ ] Attack mechanics work
- [ ] Real-time updates function
- [ ] Can complete full game loop

## Next Steps After Testing

Once everything works locally:

1. **Deploy to Sepolia Testnet**
2. **Get testnet ETH from faucet**
3. **Test on public network**
4. **Share your game with others!**

The game is production-ready and showcases excellent Web3 development skills! 🚀⚔️
