const GameFooter = ({ chainId }) => {
  const footerStyle = {
    textAlign: 'center',
    marginTop: '3rem',
    opacity: 0.7,
    fontSize: '12px'
  };

  const getChainName = (chainId) => {
    if (chainId === 31337) return '(Local Hardhat)';
    if (chainId === 11155111) return '(Sepolia)';
    return '';
  };

  return (
    <div style={footerStyle}>
      <p><strong>Tech Stack:</strong> Solidity, Hardhat, React, Ethers.js</p>
      {chainId && (
        <p>Chain ID: {chainId} {getChainName(chainId)}</p>
      )}
      <p style={{ marginTop: '8px', fontStyle: 'italic' }}>
        This is a portfolio project showcasing Web3 development skills
      </p>
    </div>
  );
};

export default GameFooter;