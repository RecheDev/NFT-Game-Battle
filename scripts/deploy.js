const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying NFT Battle Game contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const defaultCharacters = [
    "Warrior",
    "Mage", 
    "Archer"
  ];

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
  
  console.log("GameCharacter deployed to:", gameCharacterAddress);

  const bossName = "Shadow Dragon";
  const bossImageURI = "https://i.imgur.com/AksR0tt.png";
  const bossHp = 1000;
  const bossAttackDmg = 50;

  const BattleLogic = await ethers.getContractFactory("BattleLogic");
  const battleLogic = await BattleLogic.deploy(
    gameCharacterAddress,
    bossName,
    bossImageURI,
    bossHp,
    bossAttackDmg
  );

  await battleLogic.waitForDeployment();
  const battleLogicAddress = await battleLogic.getAddress();
  
  console.log("BattleLogic deployed to:", battleLogicAddress);

  console.log("Transferring GameCharacter ownership to BattleLogic...");
  await gameCharacter.transferOwnership(battleLogicAddress);
  console.log("Ownership transferred!");

  console.log("\n=== Deployment Summary ===");
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("GameCharacter:", gameCharacterAddress);
  console.log("BattleLogic:", battleLogicAddress);
  console.log("Deployer:", deployer.address);
  
  console.log("\n=== Contract Setup ===");
  console.log("Characters:", defaultCharacters.join(", "));
  console.log("Boss:", bossName);
  console.log("Boss HP:", bossHp);
  console.log("Boss Attack:", bossAttackDmg);

  return {
    gameCharacter: gameCharacterAddress,
    battleLogic: battleLogicAddress,
    deployer: deployer.address
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });