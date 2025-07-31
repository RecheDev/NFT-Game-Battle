import { useState, useEffect } from 'react';

export const useBattleActions = (battleLogicContract, gameCharacterContract, addToBattleLog, loadGameData) => {
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackCooldown, setAttackCooldown] = useState(0);

  const updateCooldown = async () => {
    if (!battleLogicContract || !gameCharacterContract) return;

    try {
      const signer = await battleLogicContract.runner;
      const cooldown = await battleLogicContract.getAttackCooldown(signer.address);
      setAttackCooldown(Number(cooldown));
    } catch (err) {
      console.error('Error updating cooldown:', err);
    }
  };

  const attackBoss = async () => {
    if (!battleLogicContract || attackCooldown > 0) return;

    try {
      setIsAttacking(true);

      const tx = await battleLogicContract.attackBoss();
      addToBattleLog('🔄 Attack transaction sent...');
      
      await tx.wait();
      
    } catch (err) {
      console.error('Error attacking boss:', err);
      addToBattleLog('❌ Attack failed!');
      throw new Error('Attack failed. Please try again.');
    } finally {
      setIsAttacking(false);
    }
  };

  const revivePlayer = async () => {
    if (!battleLogicContract) return;

    try {
      const tx = await battleLogicContract.revivePlayer();
      addToBattleLog('🔄 Reviving...');
      
      await tx.wait();
      await loadGameData();
      
      addToBattleLog('✨ You have been revived!');
    } catch (err) {
      console.error('Error reviving player:', err);
      throw new Error('Revive failed. Please try again.');
    }
  };

  useEffect(() => {
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [battleLogicContract, gameCharacterContract]);

  return {
    isAttacking,
    attackCooldown,
    attackBoss,
    revivePlayer
  };
};