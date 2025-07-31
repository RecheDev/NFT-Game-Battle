const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts, mintCharacterForPlayer } = require("./helpers/setup");
const { TEST_CHARACTERS, TEST_BOSS, CHARACTER_INDICES, EXPECTED_VALUES } = require("./helpers/testData");

describe("BattleLogic", function () {
  let gameCharacter;
  let battleLogic;
  let owner;
  let player1;
  let player2;


  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();
    const contracts = await deployContracts();
    gameCharacter = contracts.gameCharacter;
    battleLogic = contracts.battleLogic;
    
    // Transfer ownership so BattleLogic can update character HP
    await gameCharacter.transferOwnership(await battleLogic.getAddress());
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await battleLogic.owner()).to.equal(owner.address);
    });

    it("Should initialize boss correctly", async function () {
      const boss = await battleLogic.getBoss();
      expect(boss.name).to.equal(TEST_BOSS.name);
      expect(boss.hp).to.equal(TEST_BOSS.hp);
      expect(boss.maxHp).to.equal(TEST_BOSS.hp);
      expect(boss.attackDamage).to.equal(TEST_BOSS.attackDamage);
      expect(boss.imageURI).to.equal(TEST_BOSS.imageURI);
    });
  });

  describe("Battle System", function () {
    beforeEach(async function () {
      await mintCharacterForPlayer(gameCharacter, player1, CHARACTER_INDICES.WARRIOR);
    });

    it("Should allow player to attack boss", async function () {
      await expect(battleLogic.connect(player1).attackBoss())
        .to.emit(battleLogic, "AttackComplete");

      const boss = await battleLogic.getBoss();
      expect(boss.hp).to.equal(TEST_BOSS.hp - TEST_CHARACTERS.attackDamage[CHARACTER_INDICES.WARRIOR]);
    });

    it("Should reduce player HP when boss counter-attacks", async function () {
      await battleLogic.connect(player1).attackBoss();
      
      const playerNFT = await gameCharacter.connect(player1).getPlayerNFT();
      expect(playerNFT.hp).to.equal(characterHp[0] - bossAttackDmg);
    });

    it("Should emit BossDefeated when boss HP reaches 0", async function () {
      await mintCharacterForPlayer(gameCharacter, player1, CHARACTER_INDICES.MAGE);
      
      const attacksNeeded = Math.ceil(bossHp / characterAttackDmg[1]);
      
      for (let i = 0; i < attacksNeeded - 1; i++) {
        await battleLogic.connect(player1).attackBoss();
        await new Promise(resolve => setTimeout(resolve, 100));
        await ethers.provider.send("evm_increaseTime", [6]);
        await ethers.provider.send("evm_mine");
      }

      await expect(battleLogic.connect(player1).attackBoss())
        .to.emit(battleLogic, "BossDefeated")
        .withArgs(player1.address, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));
    });

    it("Should emit PlayerDefeated when player HP reaches 0", async function () {
      const attacksNeeded = Math.ceil(characterHp[0] / bossAttackDmg);
      
      for (let i = 0; i < attacksNeeded - 1; i++) {
        await battleLogic.connect(player1).attackBoss();
        await ethers.provider.send("evm_increaseTime", [6]);
        await ethers.provider.send("evm_mine");
      }

      await expect(battleLogic.connect(player1).attackBoss())
        .to.emit(battleLogic, "PlayerDefeated")
        .withArgs(player1.address, await ethers.provider.getBlock('latest').then(b => b.timestamp + 1));
    });

    it("Should prevent attack when player has no HP", async function () {
      const attacksNeeded = Math.ceil(characterHp[0] / bossAttackDmg);
      
      for (let i = 0; i < attacksNeeded; i++) {
        await battleLogic.connect(player1).attackBoss();
        await ethers.provider.send("evm_increaseTime", [6]);
        await ethers.provider.send("evm_mine");
      }

      await expect(battleLogic.connect(player1).attackBoss())
        .to.be.revertedWith("Character must have HP to attack boss");
    });

    it("Should prevent attack when boss has no HP", async function () {
      await mintCharacterForPlayer(gameCharacter, player1, CHARACTER_INDICES.MAGE);
      
      const attacksNeeded = Math.ceil(bossHp / characterAttackDmg[1]);
      
      for (let i = 0; i < attacksNeeded; i++) {
        await battleLogic.connect(player1).attackBoss();
        await ethers.provider.send("evm_increaseTime", [6]);
        await ethers.provider.send("evm_mine");
      }

      await expect(battleLogic.connect(player1).attackBoss())
        .to.be.revertedWith("Boss must have HP to attack");
    });

    it("Should prevent attack when player doesn't have NFT", async function () {
      await expect(battleLogic.connect(player2).attackBoss())
        .to.be.revertedWith("Character must have HP to attack boss");
    });
  });

  describe("Cooldown System", function () {
    beforeEach(async function () {
      await mintCharacterForPlayer(gameCharacter, player1, CHARACTER_INDICES.WARRIOR);
    });

    it("Should enforce attack cooldown", async function () {
      await battleLogic.connect(player1).attackBoss();
      
      await expect(battleLogic.connect(player1).attackBoss())
        .to.be.revertedWith("Attack cooldown not finished");
    });

    it("Should allow attack after cooldown period", async function () {
      await battleLogic.connect(player1).attackBoss();
      
      await ethers.provider.send("evm_increaseTime", [6]);
      await ethers.provider.send("evm_mine");
      
      await expect(battleLogic.connect(player1).attackBoss())
        .to.emit(battleLogic, "AttackComplete");
    });

    it("Should return correct cooldown time", async function () {
      await battleLogic.connect(player1).attackBoss();
      
      const cooldown = await battleLogic.getAttackCooldown(player1.address);
      expect(cooldown).to.be.greaterThan(0);
      expect(cooldown).to.be.lessThanOrEqual(5);
    });

    it("Should return 0 cooldown when attack is ready", async function () {
      const cooldown = await battleLogic.getAttackCooldown(player1.address);
      expect(cooldown).to.equal(0);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to reset boss", async function () {
      await mintCharacterForPlayer(gameCharacter, player1, CHARACTER_INDICES.WARRIOR);
      await battleLogic.connect(player1).attackBoss();
      
      const bossAfterAttack = await battleLogic.getBoss();
      expect(bossAfterAttack.hp).to.be.lessThan(bossHp);
      
      await battleLogic.resetBoss();
      
      const bossAfterReset = await battleLogic.getBoss();
      expect(bossAfterReset.hp).to.equal(bossHp);
    });

    it("Should prevent non-owner from resetting boss", async function () {
      await expect(battleLogic.connect(player1).resetBoss())
        .to.be.revertedWithCustomError(battleLogic, "OwnableUnauthorizedAccount");
    });

    it("Should allow owner to set new boss", async function () {
      const newBossName = "Ice Giant";
      const newBossImageURI = "https://example.com/ice-giant.png";
      const newBossHp = 1500;
      const newBossAttackDmg = 75;

      await battleLogic.setBoss(newBossName, newBossImageURI, newBossHp, newBossAttackDmg);
      
      const boss = await battleLogic.getBoss();
      expect(boss.name).to.equal(newBossName);
      expect(boss.hp).to.equal(newBossHp);
      expect(boss.maxHp).to.equal(newBossHp);
      expect(boss.attackDamage).to.equal(newBossAttackDmg);
      expect(boss.imageURI).to.equal(newBossImageURI);
    });
  });

  describe("Revive System", function () {
    beforeEach(async function () {
      await mintCharacterForPlayer(gameCharacter, player1, CHARACTER_INDICES.WARRIOR);
    });

    it("Should allow player to revive after defeat", async function () {
      const attacksNeeded = Math.ceil(characterHp[0] / bossAttackDmg);
      
      for (let i = 0; i < attacksNeeded; i++) {
        await battleLogic.connect(player1).attackBoss();
        await ethers.provider.send("evm_increaseTime", [6]);
        await ethers.provider.send("evm_mine");
      }

      let playerNFT = await gameCharacter.connect(player1).getPlayerNFT();
      expect(playerNFT.hp).to.equal(0);

      await battleLogic.connect(player1).revivePlayer();
      
      playerNFT = await gameCharacter.connect(player1).getPlayerNFT();
      expect(playerNFT.hp).to.equal(characterHp[0]);
    });

    it("Should prevent revive when player is not defeated", async function () {
      await expect(battleLogic.connect(player1).revivePlayer())
        .to.be.revertedWith("Player must be defeated to revive");
    });

    it("Should prevent revive when player doesn't have NFT", async function () {
      await expect(battleLogic.connect(player2).revivePlayer())
        .to.be.revertedWith("Player must have a character NFT to revive");
    });
  });
});
