// Common test data for GameCharacter and BattleLogic tests
const TEST_CHARACTERS = {
  names: ["Warrior", "Mage", "Archer"],
  imageURIs: [
    "https://example.com/warrior.png",
    "https://example.com/mage.png", 
    "https://example.com/archer.png"
  ],
  hp: [100, 80, 90],
  attackDamage: [25, 30, 20]
};

const TEST_BOSS = {
  name: "Shadow Dragon",
  imageURI: "https://example.com/shadow-dragon.png",
  hp: 1000,
  attackDamage: 50
};

// Character indices for testing
const CHARACTER_INDICES = {
  WARRIOR: 0,
  MAGE: 1,
  ARCHER: 2
};

// Expected values for testing
const EXPECTED_VALUES = {
  INITIAL_TOKEN_ID: 1,
  ATTACK_COOLDOWN: 5,
  ZERO_HP: 0
};

module.exports = {
  TEST_CHARACTERS,
  TEST_BOSS,
  CHARACTER_INDICES,
  EXPECTED_VALUES
};