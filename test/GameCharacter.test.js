const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployGameCharacter, mintCharacterForPlayer } = require("./helpers/setup");
const { TEST_CHARACTERS, CHARACTER_INDICES, EXPECTED_VALUES } = require("./helpers/testData");
const { expectCharacterAttributes, expectDefaultCharacter, expectEmptyCharacter } = require("./helpers/assertions");

describe("GameCharacter", function () {
  let gameCharacter;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    gameCharacter = await deployGameCharacter();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await gameCharacter.owner()).to.equal(owner.address);
    });

    it("Should initialize default characters correctly", async function () {
      const defaultChars = await gameCharacter.getDefaultCharacters();
      expect(defaultChars.length).to.equal(TEST_CHARACTERS.names.length);
      
      for (let i = 0; i < defaultChars.length; i++) {
        expectDefaultCharacter(defaultChars[i], i);
      }
    });
  });

  describe("Minting", function () {
    it("Should mint a character NFT successfully", async function () {
      await expect(gameCharacter.connect(player1).mintCharacterNFT(CHARACTER_INDICES.WARRIOR))
        .to.emit(gameCharacter, "CharacterNFTMinted")
        .withArgs(player1.address, EXPECTED_VALUES.INITIAL_TOKEN_ID, CHARACTER_INDICES.WARRIOR);

      expect(await gameCharacter.balanceOf(player1.address)).to.equal(1);
      expect(await gameCharacter.ownerOf(1)).to.equal(player1.address);
    });

    it("Should set correct character attributes when minting", async function () {
      await gameCharacter.connect(player1).mintCharacterNFT(CHARACTER_INDICES.MAGE);
      
      const playerNFT = await gameCharacter.connect(player1).getPlayerNFT();
      expectCharacterAttributes(playerNFT, CHARACTER_INDICES.MAGE);
    });

    it("Should update nftHolders mapping", async function () {
      await gameCharacter.connect(player1).mintCharacterNFT(2);
      expect(await gameCharacter.nftHolders(player1.address)).to.equal(1);
    });

    it("Should allow multiple players to mint different characters", async function () {
      await gameCharacter.connect(player1).mintCharacterNFT(0);
      await gameCharacter.connect(player2).mintCharacterNFT(1);

      expect(await gameCharacter.balanceOf(player1.address)).to.equal(1);
      expect(await gameCharacter.balanceOf(player2.address)).to.equal(1);
      
      const player1NFT = await gameCharacter.connect(player1).getPlayerNFT();
      const player2NFT = await gameCharacter.connect(player2).getPlayerNFT();
      
      expect(player1NFT.name).to.equal("Warrior");
      expect(player2NFT.name).to.equal("Mage");
    });
  });

  describe("Character Management", function () {
    beforeEach(async function () {
      await gameCharacter.connect(player1).mintCharacterNFT(0);
    });

    it("Should return player NFT data correctly", async function () {
      const playerNFT = await gameCharacter.connect(player1).getPlayerNFT();
      expect(playerNFT.name).to.equal("Warrior");
      expect(playerNFT.hp).to.equal(100);
    });

    it("Should return empty struct for player without NFT", async function () {
      const playerNFT = await gameCharacter.connect(player2).getPlayerNFT();
      expect(playerNFT.name).to.equal("");
      expect(playerNFT.hp).to.equal(0);
    });

    it("Should update HP correctly", async function () {
      await gameCharacter.updateHP(1, 50);
      
      const playerNFT = await gameCharacter.connect(player1).getPlayerNFT();
      expect(playerNFT.hp).to.equal(50);
    });

    it("Should revert when trying to update HP of dead character", async function () {
      await gameCharacter.updateHP(1, 0);
      
      await expect(gameCharacter.updateHP(1, 50))
        .to.be.revertedWith("Character must be alive to update HP");
    });
  });

  describe("Token URI", function () {
    beforeEach(async function () {
      await gameCharacter.connect(player1).mintCharacterNFT(0);
    });

    it("Should generate token URI correctly", async function () {
      const tokenURI = await gameCharacter.tokenURI(1);
      expect(tokenURI).to.include("data:application/json;base64,");
    });

    it("Should include character data in token URI", async function () {
      const tokenURI = await gameCharacter.getTokenURI(1);
      expect(tokenURI).to.include("data:application/json;base64,");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await gameCharacter.connect(player1).mintCharacterNFT(0);
      await gameCharacter.connect(player2).mintCharacterNFT(1);
    });

    it("Should return all players correctly", async function () {
      const players = await gameCharacter.getAllPlayers();
      expect(players.length).to.equal(2);
      expect(players[0].name).to.equal("Warrior");
      expect(players[1].name).to.equal("Mage");
    });

    it("Should return default characters", async function () {
      const defaultChars = await gameCharacter.getDefaultCharacters();
      expect(defaultChars.length).to.equal(3);
      expect(defaultChars[2].name).to.equal("Archer");
    });
  });
});