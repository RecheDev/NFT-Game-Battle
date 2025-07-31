import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, GAME_CHARACTER_ABI, BATTLE_LOGIC_ABI } from '../constants/contracts';

export const useContracts = (signer) => {
  const [gameCharacterContract, setGameCharacterContract] = useState(null);
  const [battleLogicContract, setBattleLogicContract] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (signer && CONTRACT_ADDRESSES.GAME_CHARACTER && CONTRACT_ADDRESSES.BATTLE_LOGIC) {
      try {
        const gameCharacter = new ethers.Contract(
          CONTRACT_ADDRESSES.GAME_CHARACTER,
          GAME_CHARACTER_ABI,
          signer
        );

        const battleLogic = new ethers.Contract(
          CONTRACT_ADDRESSES.BATTLE_LOGIC,
          BATTLE_LOGIC_ABI,
          signer
        );

        setGameCharacterContract(gameCharacter);
        setBattleLogicContract(battleLogic);
        setError('');
      } catch (err) {
        console.error('Error initializing contracts:', err);
        setError('Failed to initialize contracts. Please check contract addresses.');
      }
    } else {
      setGameCharacterContract(null);
      setBattleLogicContract(null);
    }
  }, [signer]);

  return {
    gameCharacterContract,
    battleLogicContract,
    error,
    isReady: !!gameCharacterContract && !!battleLogicContract
  };
};
