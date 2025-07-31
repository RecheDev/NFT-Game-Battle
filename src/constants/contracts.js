export const CONTRACT_ADDRESSES = {
  GAME_CHARACTER: import.meta.env.VITE_GAME_CHARACTER_ADDRESS || '',
  BATTLE_LOGIC: import.meta.env.VITE_BATTLE_LOGIC_ADDRESS || ''
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
    rpcUrl: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};
