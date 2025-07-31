import { useEffect } from 'react';

export const useBattleEvents = (battleLogicContract, setBoss, setPlayerCharacter, addToBattleLog) => {
  useEffect(() => {
    if (!battleLogicContract) return;

    const handleAttackComplete = (attacker, newBossHp, newPlayerHp) => {
      const bossHp = Number(newBossHp);
      const playerHp = Number(newPlayerHp);
      
      setBoss(prev => ({ ...prev, hp: bossHp }));
      setPlayerCharacter(prev => ({ ...prev, hp: playerHp }));
      
      addToBattleLog(`⚔️ You attack the boss!`);
      if (bossHp > 0) {
        addToBattleLog(`💥 Boss counter-attacks!`);
      }
    };

    const handleBossDefeated = (winner) => {
      addToBattleLog(`🎉 Victory! You have defeated the boss!`);
    };

    const handlePlayerDefeated = (player) => {
      addToBattleLog(`💀 You have been defeated! Use revive to continue fighting.`);
    };

    battleLogicContract.on('AttackComplete', handleAttackComplete);
    battleLogicContract.on('BossDefeated', handleBossDefeated);
    battleLogicContract.on('PlayerDefeated', handlePlayerDefeated);

    return () => {
      battleLogicContract.removeAllListeners('AttackComplete');
      battleLogicContract.removeAllListeners('BossDefeated');
      battleLogicContract.removeAllListeners('PlayerDefeated');
    };
  }, [battleLogicContract, setBoss, setPlayerCharacter, addToBattleLog]);
};