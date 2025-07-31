import { getHealthPercentage, getHealthBarClassName } from '../utils/battleUtils';

const CharacterCard = ({ 
  character, 
  isPlayer = false, 
  isDefeated = false, 
  onRevive = null 
}) => {
  const cardStyle = isPlayer ? {} : { 
    background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)' 
  };

  return (
    <div className="character-card">
      <div className="character-image" style={cardStyle}>
        {isPlayer ? character.name.charAt(0) : '👹'}
      </div>
      <h3>{character.name}</h3>
      
      <div className="health-bar">
        <div 
          className={getHealthBarClassName(character.hp, character.maxHp)}
          style={{ width: `${getHealthPercentage(character.hp, character.maxHp)}%` }}
        />
      </div>
      
      <div>❤️ {character.hp}/{character.maxHp}</div>
      <div>⚔️ Attack: {character.attackDamage}</div>
      
      {isPlayer && isDefeated && onRevive && (
        <button
          className="button secondary"
          onClick={onRevive}
          style={{ marginTop: '1rem', width: '100%' }}
        >
          ✨ Revive
        </button>
      )}
    </div>
  );
};

export default CharacterCard;
