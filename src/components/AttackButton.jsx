const AttackButton = ({ 
  onAttack, 
  isAttacking, 
  attackCooldown, 
  isPlayerDefeated, 
  isBossDefeated, 
  canAttack 
}) => {
  const getButtonText = () => {
    if (isAttacking) return 'Attacking...';
    if (attackCooldown > 0) return `Cooldown: ${attackCooldown}s`;
    if (isPlayerDefeated) return 'You are defeated!';
    if (isBossDefeated) return 'Boss defeated!';
    return '⚔️ Attack Boss';
  };

  const getButtonContent = () => {
    if (isAttacking) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          Attacking...
        </div>
      );
    }
    return getButtonText();
  };

  return (
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      <button
        className="button primary"
        onClick={onAttack}
        disabled={!canAttack || isAttacking}
        style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
      >
        {getButtonContent()}
      </button>
    </div>
  );
};

export default AttackButton;