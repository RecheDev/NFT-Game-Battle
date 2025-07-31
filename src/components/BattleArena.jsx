import CharacterCard from './CharacterCard';
import AttackButton from './AttackButton';
import BattleLog from './BattleLog';
import { useBattleData } from '../hooks/useBattleData';
import { useBattleActions } from '../hooks/useBattleActions';
import { useBattleEvents } from '../hooks/useBattleEvents';

const BattleArena = ({ gameCharacterContract, battleLogicContract }) => {
  const {
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
  } = useBattleData(gameCharacterContract, battleLogicContract);

  const {
    isAttacking,
    attackCooldown,
    attackBoss,
    revivePlayer
  } = useBattleActions(battleLogicContract, gameCharacterContract, addToBattleLog, loadGameData);

  useBattleEvents(battleLogicContract, setBoss, setPlayerCharacter, addToBattleLog);

  const handleAttackBoss = async () => {
    try {
      setError('');
      await attackBoss();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRevivePlayer = async () => {
    try {
      setError('');
      await revivePlayer();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          Loading battle arena...
        </div>
      </div>
    );
  }

  if (!playerCharacter || !boss) {
    return (
      <div className="card">
        <div className="error">
          Unable to load battle data. Please refresh the page.
        </div>
      </div>
    );
  }

  const isPlayerDefeated = playerCharacter.hp === 0;
  const isBossDefeated = boss.hp === 0;
  const canAttack = !isPlayerDefeated && !isBossDefeated && attackCooldown === 0;

  return (
    <div className="card">
      <h2>⚔️ Battle Arena</h2>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="battle-arena" style={{ position: 'relative' }}>
        <CharacterCard 
          character={playerCharacter}
          isPlayer={true}
          isDefeated={isPlayerDefeated}
          onRevive={handleRevivePlayer}
        />

        <div className="vs-indicator">VS</div>

        <CharacterCard 
          character={boss}
          isPlayer={false}
          isDefeated={isBossDefeated}
        />
      </div>

      <AttackButton
        onAttack={handleAttackBoss}
        isAttacking={isAttacking}
        attackCooldown={attackCooldown}
        isPlayerDefeated={isPlayerDefeated}
        isBossDefeated={isBossDefeated}
        canAttack={canAttack}
      />

      <BattleLog logs={battleLog} />
    </div>
  );
};

export default BattleArena;