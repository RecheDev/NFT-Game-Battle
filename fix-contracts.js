const { ethers } = require("hardhat");

async function main() {
  console.log("🔧 Fixing Contract Issues...");
  
  const gameCharacterAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);
  
  // Get contract instance
  const GameCharacter = await ethers.getContractFactory("GameCharacter");
  const gameCharacter = GameCharacter.attach(gameCharacterAddress);
  
  try {
    // Check if account has any NFTs
    const balance = await gameCharacter.balanceOf(signer.address);
    console.log("NFT Balance:", Number(balance));
    
    // Check nftHolders mapping
    const tokenId = await gameCharacter.nftHolders(signer.address);
    console.log("Token ID for this address:", Number(tokenId));
    
    if (Number(tokenId) === 0) {
      console.log("🎯 SOLUTION: The address used to mint is different from the address trying to attack!");
      console.log("Your MetaMask address needs to be the same as the one that minted the character.");
      
      // Let's mint a character for the current account
      console.log("🎮 Minting a Warrior for the current account...");
      const tx = await gameCharacter.mintCharacterNFT(0); // Mint Warrior
      await tx.wait();
      console.log("✅ Warrior minted successfully!");
      
      // Check again
      const newBalance = await gameCharacter.balanceOf(signer.address);
      const newTokenId = await gameCharacter.nftHolders(signer.address);
      console.log("New NFT Balance:", Number(newBalance));
      console.log("New Token ID:", Number(newTokenId));
    } else {
      // Try to get player NFT data
      const playerNFT = await gameCharacter.getPlayerNFT();
      console.log("Player Character:", {
        name: playerNFT.name,
        hp: Number(playerNFT.hp),
        maxHp: Number(playerNFT.maxHp),
        attackDamage: Number(playerNFT.attackDamage)
      });
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
