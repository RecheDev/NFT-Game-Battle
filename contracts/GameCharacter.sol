// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameCharacter is ERC721, Ownable {
    
    // Constants for better maintainability
    string private constant TOKEN_NAME = "Battle Heroes";
    string private constant TOKEN_SYMBOL = "HEROES";
    string private constant JSON_PREFIX = "data:application/json;base64,";
    string private constant NFT_DESCRIPTION = "This is an NFT that lets people play in the game Metaverse Slayer!";
    uint256 private constant INITIAL_TOKEN_ID = 0;
    uint256 private constant FIRST_VALID_TOKEN_ID = 1;
    uint256 private _currentTokenId;

    struct CharacterAttributes {
        uint256 characterIndex;
        string name;
        string imageURI;
        uint256 hp;
        uint256 maxHp;
        uint256 attackDamage;
    }

    struct DefaultChar {
        string name;
        string imageURI;
        uint256 hp;
        uint256 attackDamage;
    }

    DefaultChar[] defaultCharacters;

    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
    mapping(address => uint256) public nftHolders;

    event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);

    constructor(
        string[] memory characterNames,
        string[] memory characterImageURIs,
        uint256[] memory characterHp,
        uint256[] memory characterAttackDmg
    ) ERC721(TOKEN_NAME, TOKEN_SYMBOL) Ownable(msg.sender) {
        _initializeDefaultCharacters(
            characterNames,
            characterImageURIs, 
            characterHp,
            characterAttackDmg
        );
        
        _currentTokenId = INITIAL_TOKEN_ID;
    }

    function mintCharacterNFT(uint256 _characterIndex) external {
        require(_characterIndex < defaultCharacters.length, "Invalid character index");
        
        _currentTokenId++;
        uint256 tokenId = _currentTokenId;
        
        _safeMint(msg.sender, tokenId);
        
        _createCharacterAttributes(tokenId, _characterIndex);
        nftHolders[msg.sender] = tokenId;
        
        emit CharacterNFTMinted(msg.sender, tokenId, _characterIndex);
    }

    function getTokenURI(uint256 _tokenId) public view returns (string memory) {
        require(_tokenId > 0 && _tokenId <= _currentTokenId, "Token does not exist");
        
        string memory jsonMetadata = _buildJsonMetadata(_tokenId);
        return string(
            abi.encodePacked(
                JSON_PREFIX,
                _encodeBase64(bytes(jsonMetadata))
            )
        );
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        return getTokenURI(_tokenId);
    }

    function getDefaultCharacters() public view returns (DefaultChar[] memory) {
        return defaultCharacters;
    }

    function getPlayerNFT() public view returns (CharacterAttributes memory) {
        return getPlayerNFTByAddress(msg.sender);
    }
    
    function getPlayerNFTByAddress(address player) public view returns (CharacterAttributes memory) {
        uint256 userNftTokenId = nftHolders[player];
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        } else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }

    function getAllPlayers() public view returns (CharacterAttributes[] memory) {
        CharacterAttributes[] memory players = new CharacterAttributes[](_currentTokenId);
        uint256 activePlayerCount = 0;
        
        for (uint256 i = FIRST_VALID_TOKEN_ID; i <= _currentTokenId; i++) {
            if (_isCharacterAlive(i)) {
                players[activePlayerCount] = nftHolderAttributes[i];
                activePlayerCount++;
            }
        }
        
        // Resize array to actual count
        assembly {
            mstore(players, activePlayerCount)
        }
        
        return players;
    }

    function updateHP(uint256 tokenId, uint256 newHp) external {
        require(tokenId > 0 && tokenId <= _currentTokenId, "Token does not exist");
        require(_isCharacterAlive(tokenId), "Character must be alive to update HP");
        require(newHp <= nftHolderAttributes[tokenId].maxHp, "HP cannot exceed maximum");
        
        nftHolderAttributes[tokenId].hp = newHp;
    }

    // Private helper functions
    
    function _initializeDefaultCharacters(
        string[] memory names,
        string[] memory imageURIs,
        uint256[] memory hp,
        uint256[] memory attackDmg
    ) private {
        require(names.length == imageURIs.length, "Arrays length mismatch: names and imageURIs");
        require(names.length == hp.length, "Arrays length mismatch: names and hp");
        require(names.length == attackDmg.length, "Arrays length mismatch: names and attackDmg");
        
        for(uint256 i = 0; i < names.length; i++) {
            defaultCharacters.push(DefaultChar({
                name: names[i],
                imageURI: imageURIs[i],
                hp: hp[i],
                attackDamage: attackDmg[i]
            }));
        }
    }
    
    function _createCharacterAttributes(uint256 tokenId, uint256 characterIndex) private {
        DefaultChar memory template = defaultCharacters[characterIndex];
        
        nftHolderAttributes[tokenId] = CharacterAttributes({
            characterIndex: characterIndex,
            name: template.name,
            imageURI: template.imageURI,
            hp: template.hp,
            maxHp: template.hp,
            attackDamage: template.attackDamage
        });
    }
    
    function _buildJsonMetadata(uint256 tokenId) private view returns (string memory) {
        CharacterAttributes memory character = nftHolderAttributes[tokenId];
        
        return string(
            abi.encodePacked(
                '{"name": "',
                character.name,
                ' -- NFT #: ',
                Strings.toString(tokenId),
                '", "description": "',
                NFT_DESCRIPTION,
                '", "image": "',
                character.imageURI,
                '", "attributes": [',
                _buildAttributesJson(character),
                ']}'
            )
        );
    }
    
    function _buildAttributesJson(CharacterAttributes memory character) private pure returns (string memory) {
        return string(
            abi.encodePacked(
                '{ "trait_type": "Health Points", "value": ',
                Strings.toString(character.hp),
                ', "max_value": ',
                Strings.toString(character.maxHp),
                '}, { "trait_type": "Attack Damage", "value": ',
                Strings.toString(character.attackDamage),
                '}'
            )
        );
    }
    
    function _isCharacterAlive(uint256 tokenId) private view returns (bool) {
        return nftHolderAttributes[tokenId].hp > 0;
    }
    
    function _encodeBase64(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        
        if (data.length == 0) return "";
        
        string memory result = new string(4 * ((data.length + 2) / 3));
        
        assembly {
            let tablePtr := add(table, 1)
            let resultPtr := add(result, 32)
            
            for {
                let i := 0
            } lt(i, mload(data)) {
                i := add(i, 3)
            } {
                let input := shl(240, mload(add(data, add(32, i))))
                
                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1)
            }
            
            switch mod(mload(data), 3)
            case 1 {
                mstore8(sub(resultPtr, 2), 0x3d)
                mstore8(sub(resultPtr, 1), 0x3d)
            }
            case 2 {
                mstore8(sub(resultPtr, 1), 0x3d)
            }
        }
        
        return result;
    }
}
