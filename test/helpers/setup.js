const { ethers } = require("hardhat");
const { TEST_CHARACTERS, TEST_BOSS } = require("./testData");

// Common setup functions for tests
async function deployGameCharacter() {
  const GameCharacter = await ethers.getContractFactory("GameCharacter");
  const gameCharacter = await GameCharacter.deploy(
    TEST_CHARACTERS.names,
    TEST_CHARACTERS.imageURIs,
    TEST_CHARACTERS.hp,
    TEST_CHARACTERS.attackDamage
  );
  await gameCharacter.waitForDeployment();
  return gameCharacter;
}

async function deployBattleLogic(gameCharacterAddress) {
  const BattleLogic = await ethers.getContractFactory("BattleLogic");
  const battleLogic = await BattleLogic.deploy(
    gameCharacterAddress,
    TEST_BOSS.name,
    TEST_BOSS.imageURI,
    TEST_BOSS.hp,
    TEST_BOSS.attackDamage
  );
  await battleLogic.waitForDeployment();
  return battleLogic;
}

async function deployContracts() {
  const gameCharacter = await deployGameCharacter();
  const battleLogic = await deployBattleLogic(await gameCharacter.getAddress());
  return { gameCharacter, battleLogic };
}

async function mintCharacterForPlayer(gameCharacter, player, characterIndex = 0) {
  const tx = await gameCharacter.connect(player).mintCharacterNFT(characterIndex);
  await tx.wait();
  return tx;
}

async function setupPlayersWithCharacters(gameCharacter, players, characterIndices = [0, 1, 2]) {
  const mintPromises = players.map((player, index) => 
    mintCharacterForPlayer(gameCharacter, player, characterIndices[index] || 0)
  );
  await Promise.all(mintPromises);
}

module.exports = {
  deployGameCharacter,
  deployBattleLogic,
  deployContracts,
  mintCharacterForPlayer,
  setupPlayersWithCharacters
};