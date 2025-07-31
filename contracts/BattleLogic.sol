// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GameCharacter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BattleLogic is Ownable {
    
    // Constants for better maintainability
    uint256 public constant ATTACK_COOLDOWN = 5 seconds;
    uint256 private constant MIN_PLAYER_TOKEN_ID = 1;
    uint256 private constant MIN_HP_FOR_BATTLE = 1;
    GameCharacter private immutable gameCharacter;

    struct BigBoss {
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    BigBoss public bigBoss;
    mapping(address => uint256) public playerLastAttackTime;

    event AttackComplete(address attacker, uint256 newBossHp, uint256 newPlayerHp);
    event BossDefeated(address winner, uint256 timestamp);
    event PlayerDefeated(address player, uint256 timestamp);

    constructor (
        address gameCharacterContract,
        string memory bossName,
        string memory bossImageURI,
        uint256 bossHp,
        uint256 bossAttackDamage
    ) Ownable(msg.sender) {
        require(gameCharacterContract != address(0), "Invalid game character contract address");
        require(bossHp > 0, "Boss HP must be greater than 0");
        require(bossAttackDamage > 0, "Boss attack damage must be greater than 0");
        
        gameCharacter = GameCharacter(gameCharacterContract);
        
        bigBoss = BigBoss({
            name: bossName,
            imageURI: bossImageURI,
            hp: bossHp,
            maxHp: bossHp,
            attackDamage: bossAttackDamage
        });
    }

    function attackBoss() public {
        GameCharacter.CharacterAttributes memory player = gameCharacter.getPlayerNFTByAddress(msg.sender);
        require(player.hp > 0, "Character must have HP to attack boss");
        require(bigBoss.hp > 0, "Boss must have HP to attack");
        require(
            block.timestamp >= playerLastAttackTime[msg.sender] + ATTACK_COOLDOWN,
            "Attack cooldown not finished"
        );

        uint256 playerTokenId = gameCharacter.nftHolders(msg.sender);
        
        // Player attacks boss
        uint256 newBossHp = _calculateDamage(bigBoss.hp, player.attackDamage);
        bigBoss.hp = newBossHp;
        
        if (_isBossDefeated()) {
            emit BossDefeated(msg.sender, block.timestamp);
            return;
        }
        
        // Boss counter-attacks player
        uint256 newPlayerHp = _calculateDamage(player.hp, bigBoss.attackDamage);
        gameCharacter.updateHP(playerTokenId, newPlayerHp);
        
        // Update cooldown
        playerLastAttackTime[msg.sender] = block.timestamp;
        
        if (_isPlayerDefeated(newPlayerHp)) {
            emit PlayerDefeated(msg.sender, block.timestamp);
        }
        
        emit AttackComplete(msg.sender, bigBoss.hp, newPlayerHp);
    }

    function getBoss() public view returns (BigBoss memory) {
        return bigBoss;
    }

    function resetBoss() public onlyOwner {
        bigBoss.hp = bigBoss.maxHp;
    }

    function revivePlayer() public {
        uint256 playerTokenId = gameCharacter.nftHolders(msg.sender);
        require(playerTokenId >= MIN_PLAYER_TOKEN_ID, "Player must have a character NFT to revive");
        
        GameCharacter.CharacterAttributes memory player = gameCharacter.getPlayerNFTByAddress(msg.sender);
        require(player.hp == 0, "Player must be defeated to revive");
        
        gameCharacter.updateHP(playerTokenId, player.maxHp);
    }

    function getAttackCooldown(address player) public view returns (uint256) {
        uint256 lastAttack = playerLastAttackTime[player];
        if (block.timestamp >= lastAttack + ATTACK_COOLDOWN) {
            return 0;
        }
        return (lastAttack + ATTACK_COOLDOWN) - block.timestamp;
    }

    function setBoss(
        string memory name,
        string memory imageURI,
        uint256 hp,
        uint256 attackDamage
    ) public onlyOwner {
        require(hp > 0, "Boss HP must be greater than 0");
        require(attackDamage > 0, "Boss attack damage must be greater than 0");
        
        bigBoss = BigBoss({
            name: name,
            imageURI: imageURI,
            hp: hp,
            maxHp: hp,
            attackDamage: attackDamage
        });
    }
    
    // Private helper functions
    
    function _validateBattleConditions() private view {
        uint256 playerTokenId = gameCharacter.nftHolders(msg.sender);
        require(playerTokenId >= MIN_PLAYER_TOKEN_ID, "Player must have a character NFT");
        
        GameCharacter.CharacterAttributes memory player = gameCharacter.getPlayerNFT();
        require(player.hp >= MIN_HP_FOR_BATTLE, "Character must have HP to attack boss");
        require(bigBoss.hp >= MIN_HP_FOR_BATTLE, "Boss must have HP to attack");
        require(
            _isCooldownFinished(msg.sender),
            "Attack cooldown not finished"
        );
    }
    
    function _calculateDamage(uint256 currentHp, uint256 attackDamage) private pure returns (uint256) {
        if (currentHp <= attackDamage) {
            return 0;
        }
        return currentHp - attackDamage;
    }
    
    function _isBossDefeated() private view returns (bool) {
        return bigBoss.hp == 0;
    }
    
    function _isPlayerDefeated(uint256 playerHp) private pure returns (bool) {
        return playerHp == 0;
    }
    
    function _isCooldownFinished(address player) private view returns (bool) {
        return block.timestamp >= playerLastAttackTime[player] + ATTACK_COOLDOWN;
    }
}