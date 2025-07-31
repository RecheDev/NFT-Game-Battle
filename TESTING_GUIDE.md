# 🧪 NFT Battle Game - Testing Guide

Follow these steps to test your NFT Battle Game locally:

## Prerequisites Setup

### 1. Install MetaMask
- Install [MetaMask browser extension](https://metamask.io/)
- Create a new wallet or import existing one
- **⚠️ Use a test wallet, never use mainnet funds for testing**

## Testing Steps

### Step 1: Start Local Blockchain
Open your first terminal and run:
```bash
npx hardhat node
```

**Expected Output:**
- You should see 20 test accounts with private keys
- Local blockchain running on `http://127.0.0.1:8545`
- Copy one of the private keys (we'll use it in MetaMask)

### Step 2: Deploy Smart Contracts
Open a **second terminal** (keep the first one running) and run:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Expected Output:**
```
Deploying NFT Battle Game contracts...
Deploying contracts with account: 0x...
GameCharacter deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
BattleLogic deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
...
```

**📝 IMPORTANT:** Copy the two contract addresses!

### Step 3: Update Frontend Configuration
Edit `src/constants/contracts.js` and update the contract addresses:

```javascript
export const CONTRACT_ADDRESSES = {
  GAME_CHARACTER: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Paste your GameCharacter address
  BATTLE_LOGIC: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'     // Paste your BattleLogic address
};
```

### Step 4: Setup MetaMask
1. **Add Hardhat Network:**
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Test Account:**
   - Copy a private key from Step 1 output
   - In MetaMask: Account menu → Import Account → Paste private key
   - You should now have ~10,000 ETH for testing

### Step 5: Start Frontend
In a **third terminal**, run:
```bash
npm run dev
```

The game should open at `http://localhost:3000`

## Game Testing Checklist

### ✅ Wallet Connection
- [ ] MetaMask connects successfully
- [ ] Correct network displayed (Hardhat Local)
- [ ] Wallet address shown correctly

### ✅ Character Minting
- [ ] Three character types displayed (Warrior, Mage, Archer)
- [ ] Character selection works
- [ ] Mint transaction completes successfully
- [ ] Character appears after minting

### ✅ Battle System
- [ ] Battle arena loads with your character and boss
- [ ] Health bars display correctly
- [ ] Attack button works
- [ ] Health decreases after attacks
- [ ] Battle log updates in real-time
- [ ] Attack cooldown enforces 5-second wait
- [ ] Victory/defeat states work correctly
- [ ] Revive function works after defeat

## Troubleshooting

### Problem: "Failed to connect wallet"
**Solution:** Make sure MetaMask is installed and the Hardhat network is added correctly.

### Problem: "Contract addresses need to be configured"
**Solution:** Update `src/constants/contracts.js` with your deployed addresses from Step 2.

### Problem: "Transaction failed"
**Solution:** 
- Check you have enough ETH in your test account
- Make sure Hardhat node is still running
- Try refreshing the page and reconnecting wallet

### Problem: "Network error"
**Solution:** 
- Ensure all three terminals are running (Hardhat node, and frontend)
- Check MetaMask is on the correct network (Chain ID 31337)

### Problem: "Character not loading"
**Solution:**
- Wait a few seconds after minting
- Refresh the page
- Check the browser console for errors

## Expected Game Flow

1. **Connect Wallet** → See wallet connection interface
2. **Choose Character** → Select Warrior, Mage, or Archer
3. **Mint NFT** → Transaction processes, character appears
4. **Enter Battle** → Face Shadow Dragon boss
5. **Fight** → Attack, wait for cooldown, repeat
6. **Win/Lose** → Victory message or revive option

## Success Indicators

✅ **Full Success:** You can mint a character, enter battle, attack the boss, see real-time health updates, and either win or lose and revive.

🔧 **Partial Success:** Some features work but others need debugging.

❌ **Needs Fix:** Major issues preventing basic functionality.

## Next Steps After Testing

Once local testing works perfectly:
1. Deploy to Sepolia testnet
2. Update frontend for testnet addresses
3. Test with real testnet ETH
4. Share your game with others!

---

Happy Testing! 🎮⚔️