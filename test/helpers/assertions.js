const { expect } = require("chai");
const { TEST_CHARACTERS, EXPECTED_VALUES } = require("./testData");

// Common assertion helpers
function expectCharacterAttributes(character, expectedIndex) {
  const expectedCharacter = {
    name: TEST_CHARACTERS.names[expectedIndex],
    hp: TEST_CHARACTERS.hp[expectedIndex],
    maxHp: TEST_CHARACTERS.hp[expectedIndex],
    attackDamage: TEST_CHARACTERS.attackDamage[expectedIndex]
  };

  expect(character.name).to.equal(expectedCharacter.name);
  expect(character.hp).to.equal(expectedCharacter.hp);
  expect(character.maxHp).to.equal(expectedCharacter.maxHp);
  expect(character.attackDamage).to.equal(expectedCharacter.attackDamage);
  expect(character.characterIndex).to.equal(expectedIndex);
}

function expectDefaultCharacter(defaultChar, index) {
  expect(defaultChar.name).to.equal(TEST_CHARACTERS.names[index]);
  expect(defaultChar.hp).to.equal(TEST_CHARACTERS.hp[index]);
  expect(defaultChar.attackDamage).to.equal(TEST_CHARACTERS.attackDamage[index]);
  expect(defaultChar.imageURI).to.equal(TEST_CHARACTERS.imageURIs[index]);
}

function expectEmptyCharacter(character) {
  expect(character.name).to.equal("");
  expect(character.hp).to.equal(0);
  expect(character.maxHp).to.equal(0);
  expect(character.attackDamage).to.equal(0);
}

function expectCharacterDefeated(character) {
  expect(character.hp).to.equal(EXPECTED_VALUES.ZERO_HP);
}

function expectCharacterAlive(character) {
  expect(character.hp).to.be.greaterThan(EXPECTED_VALUES.ZERO_HP);
}

module.exports = {
  expectCharacterAttributes,
  expectDefaultCharacter,
  expectEmptyCharacter,
  expectCharacterDefeated,
  expectCharacterAlive
};