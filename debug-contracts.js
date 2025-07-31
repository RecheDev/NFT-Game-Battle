const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Debugging Contract Issues...");
  
  const gameCharacterAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const battleLogicAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);
  
  // Get contract instances
  const GameCharacter = await ethers.getContractFactory("GameCharacter");
  const gameCharacter = GameCharacter.attach(gameCharacterAddress);
  
  const BattleLogic = await ethers.getContractFactory("BattleLogic");
  const battleLogic = BattleLogic.attach(battleLogicAddress);
  
  try {
    // Check if player has a character
    const playerNFT = await gameCharacter.getPlayerNFT();
    console.log("Player Character:", {
      name: playerNFT.name,
      hp: Number(playerNFT.hp),
      maxHp: Number(playerNFT.maxHp),
      attackDamage: Number(playerNFT.attackDamage)
    });
    
    // Check boss status
    const boss = await battleLogic.getBoss();
    console.log("Boss:", {
      name: boss.name,
      hp: Number(boss.hp),
      maxHp: Number(boss.maxHp),
      attackDamage: Number(boss.attackDamage)
    });
    
    // Check ownership
    const owner = await gameCharacter.owner();
    console.log("GameCharacter owner:", owner);
    console.log("BattleLogic address:", battleLogicAddress);
    console.log("Ownership correct:", owner === battleLogicAddress);
    
    // Check attack cooldown
    const cooldown = await battleLogic.getAttackCooldown(signer.address);
    console.log("Attack cooldown:", Number(cooldown), "seconds");
    
    // Try to attack
    console.log("\n🔥 Attempting attack...");
    const tx = await battleLogic.attackBoss();
    const receipt = await tx.wait();
    console.log("✅ Attack successful! Transaction:", receipt.hash);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    
    if (error.message.includes("character must have HP")) {
      console.log("💡 Solution: Player character has 0 HP or doesn't exist");
    } else if (error.message.includes("cooldown")) {
      console.log("💡 Solution: Wait for attack cooldown to finish");
    } else if (error.message.includes("boss must have HP")) {
      console.log("💡 Solution: Boss is already defeated");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
