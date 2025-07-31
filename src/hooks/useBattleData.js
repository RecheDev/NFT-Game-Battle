import { useState, useEffect } from 'react';
import { addBattleLogEntry } from '../utils/battleUtils';

export const useBattleData = (gameCharacterContract, battleLogicContract) => {
  const [playerCharacter, setPlayerCharacter] = useState(null);
  const [boss, setBoss] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const addToBattleLog = (message) => {
    setBattleLog(prev => addBattleLogEntry(message, prev));
  };

  const loadGameData = async () => {
    if (!gameCharacterContract || !battleLogicContract) return;

    try {
      setLoading(true);
      
      const [playerData, bossData] = await Promise.all([
        gameCharacterContract.getPlayerNFT(),
        battleLogicContract.getBoss()
      ]);

      const formattedPlayer = {
        name: playerData.name,
        imageURI: playerData.imageURI,
        hp: Number(playerData.hp),
        maxHp: Number(playerData.maxHp),
        attackDamage: Number(playerData.attackDamage)
      };

      const formattedBoss = {
        name: bossData.name,
        imageURI: bossData.imageURI,
        hp: Number(bossData.hp),
        maxHp: Number(bossData.maxHp),
        attackDamage: Number(bossData.attackDamage)
      };

      setPlayerCharacter(formattedPlayer);
      setBoss(formattedBoss);

      addToBattleLog(`${formattedPlayer.name} enters the arena!`);
      addToBattleLog(`${formattedBoss.name} awaits your challenge...`);
      
    } catch (err) {
      console.error('Error loading game data:', err);
      setError('Failed to load game data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGameData();
  }, [gameCharacterContract, battleLogicContract]);

  return {
    playerCharacter,
    setPlayerCharacter,
    boss,
    setBoss,
    battleLog,
    loading,
    error,
    setError,
    addToBattleLog,
    loadGameData
  };
};
