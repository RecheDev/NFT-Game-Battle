const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Setting up NFT Battle Game for testing...\n");

  // Deploy contracts
  console.log("1. Deploying contracts...");
  const deployment = await deployContracts();
  
  // Update frontend config
  console.log("2. Updating frontend configuration...");
  await updateFrontendConfig(deployment);
  
  console.log("✅ Setup complete!");
  console.log("\nNext steps:");
  console.log("1. Make sure MetaMask is installed");
  console.log("2. Add Hardhat network (RPC: http://127.0.0.1:8545, Chain ID: 31337)");
  console.log("3. Import a test account using one of the private keys above");
  console.log("4. Run 'npm run dev' to start the frontend");
}

async function deployContracts() {
  const [deployer] = await ethers.getSigners();
  console.log("   Deploying with account:", deployer.address);

  const defaultCharacters = ["Warrior", "Mage", "Archer"];
  const characterImageURIs = [
    "https://i.imgur.com/pKd5Sdk.png",
    "https://i.imgur.com/xVu4vFL.png", 
    "https://i.imgur.com/WMB6g9u.png"
  ];
  const characterHp = [100, 80, 90];
  const characterAttackDmg = [25, 30, 20];

  const GameCharacter = await ethers.getContractFactory("GameCharacter");
  const gameCharacter = await GameCharacter.deploy(
    defaultCharacters,
    characterImageURIs,
    characterHp,
    characterAttackDmg
  );
  await gameCharacter.waitForDeployment();
  const gameCharacterAddress = await gameCharacter.getAddress();

  const BattleLogic = await ethers.getContractFactory("BattleLogic");
  const battleLogic = await BattleLogic.deploy(
    gameCharacterAddress,
    "Shadow Dragon",
    "https://i.imgur.com/AksR0tt.png",
    1000,
    50
  );
  await battleLogic.waitForDeployment();
  const battleLogicAddress = await battleLogic.getAddress();

  await gameCharacter.transferOwnership(battleLogicAddress);

  console.log("   ✅ GameCharacter deployed to:", gameCharacterAddress);
  console.log("   ✅ BattleLogic deployed to:", battleLogicAddress);

  return {
    gameCharacter: gameCharacterAddress,
    battleLogic: battleLogicAddress
  };
}

async function updateFrontendConfig(addresses) {
  const configPath = path.join(__dirname, '../src/constants/contracts.js');
  
  const configContent = `export const CONTRACT_ADDRESSES = {
  GAME_CHARACTER: '${addresses.gameCharacter}',
  BATTLE_LOGIC: '${addresses.battleLogic}'
};

export const GAME_CHARACTER_ABI = [
  "function mintCharacterNFT(uint256 _characterIndex) external",
  "function getPlayerNFT() public view returns (tuple(uint256 characterIndex, string name, string imageURI, uint256 hp, uint256 maxHp, uint256 attackDamage))",
  "function getDefaultCharacters() public view returns (tuple(string name, string imageURI, uint256 hp, uint256 attackDamage)[])",
  "function nftHolders(address) public view returns (uint256)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex)"
];

export const BATTLE_LOGIC_ABI = [
  "function attackBoss() public",
  "function getBoss() public view returns (tuple(string name, string imageURI, uint256 hp, uint256 maxHp, uint256 attackDamage))",
  "function revivePlayer() public",
  "function getAttackCooldown(address player) public view returns (uint256)",
  "event AttackComplete(address attacker, uint256 newBossHp, uint256 newPlayerHp)",
  "event BossDefeated(address winner, uint256 timestamp)",
  "event PlayerDefeated(address player, uint256 timestamp)"
];

export const CHAIN_CONFIG = {
  31337: {
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: null
  },
  11155111: {
    name: 'Sepolia Testnet',
    rpcUrl: \`https://sepolia.infura.io/v3/\${import.meta.env.VITE_INFURA_KEY}\`,
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};`;

  try {
    fs.writeFileSync(configPath, configContent, 'utf8');
    console.log("   ✅ Frontend configuration updated");
  } catch (error) {
    console.log("   ⚠️  Could not update frontend config automatically");
    console.log("   Please manually update src/constants/contracts.js with these addresses:");
    console.log("   GAME_CHARACTER:", addresses.gameCharacter);
    console.log("   BATTLE_LOGIC:", addresses.battleLogic);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
