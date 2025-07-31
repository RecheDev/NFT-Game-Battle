# 🎮 NFT Battle Game - Client Testing Guide

**Live Demo**: [Your Vercel URL will go here]

Test the NFT Battle Game deployed on Vercel using our provided test account.

## Quick Setup (5 minutes)

### Step 1: Install MetaMask
- Install [MetaMask browser extension](https://metamask.io/)
- Create a new wallet (or use existing)

### Step 2: Add Sepolia Test Network
Add this network to MetaMask:
- **Network Name**: `Sepolia Testnet`
- **RPC URL**: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
- **Chain ID**: `11155111`
- **Currency Symbol**: `ETH`
- **Block Explorer**: `https://sepolia.etherscan.io`

### Step 3: Import Test Account
Import this pre-funded test account to MetaMask:

**🔑 Test Private Key**: `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`

**📍 Test Address**: `0x90F79bf6EB2c4f870365E785982E1f101E93b906`

**💰 Balance**: ~0.1 SepoliaETH (enough for multiple tests)

⚠️ **Note**: This is a shared test account. Don't send real funds to it!

## Game Testing Steps

### ✅ 1. Connect Wallet
1. Visit the game URL
2. Click "Connect Wallet"
3. Select the imported test account
4. Approve connection in MetaMask

### ✅ 2. Mint Your Character
1. Choose a character type:
   - **Warrior**: High HP, moderate attack
   - **Mage**: Low HP, high attack  
   - **Archer**: Balanced stats
2. Click "Mint Character"
3. Confirm transaction in MetaMask (gas fee ~$0.01)
4. Wait for transaction confirmation

### ✅ 3. Battle the Boss
1. Enter battle arena
2. Face the Shadow Dragon boss
3. Click "Attack" to deal damage
4. Wait 5 seconds between attacks (cooldown)
5. Watch health bars update in real-time

### ✅ 4. Test Victory/Defeat
- **If you win**: Celebrate! Try minting another character
- **If you lose**: Use "Revive" button to continue fighting

## Expected Experience

**⏱️ Minting**: 10-30 seconds for transaction confirmation
**⚔️ Attacks**: Instant visual feedback, 5-second cooldown
**🔄 Real-time Updates**: Health bars update automatically
**💸 Cost**: Each transaction costs ~$0.001-0.01 in gas fees

## Troubleshooting

### "Transaction Failed"
- **Solution**: Check you're on Sepolia network, account has ETH

### "Character Not Loading"  
- **Solution**: Wait 30 seconds after minting, then refresh page

### "Wrong Network"
- **Solution**: Switch MetaMask to Sepolia Testnet (Chain ID 11155111)

### "Connection Issues"
- **Solution**: Refresh page, reconnect wallet, try different browser

## Test Account Sharing

This test account is shared among all testers:
- ✅ **Safe to use**: Pre-funded with test ETH
- ❌ **Don't store value**: Others have access to this account
- 🔄 **Refilled regularly**: If balance is low, contact developer

## Feedback

Found bugs or have suggestions? Please report:
- 📧 Email: [your-email@domain.com]
- 🐛 Issues: [GitHub Issues Link]
- 💬 Discord: [Your Discord Server]

---

**Happy Testing!** 🎮⚔️

*Test the future of blockchain gaming - mint, battle, and conquer!*