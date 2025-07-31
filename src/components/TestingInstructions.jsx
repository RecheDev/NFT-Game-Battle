const TestingInstructions = ({ onHide }) => {
  const instructionCardStyle = {
    marginBottom: '2rem',
    backgroundColor: '#f8f9fa',
    border: '2px solid #e9ecef'
  };

  const codeBlockStyle = {
    display: 'block',
    background: '#343a40',
    color: '#f8f9fa',
    padding: '8px',
    margin: '4px 0',
    borderRadius: '4px'
  };

  const listStyle = {
    margin: '8px 0',
    paddingLeft: '20px'
  };

  const hideButtonStyle = {
    marginTop: '1rem',
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  return (
    <div className="card" style={instructionCardStyle}>
      <h3 style={{ color: '#495057', marginBottom: '1rem' }}>📋 Quick Testing Guide</h3>
      <div style={{ textAlign: 'left', fontSize: '14px', color: '#6c757d' }}>
        <div style={{ marginBottom: '1rem' }}>
          <strong>1. Start Local Blockchain:</strong>
          <code style={codeBlockStyle}>
            npx hardhat node
          </code>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <strong>2. Deploy Contracts:</strong>
          <code style={codeBlockStyle}>
            npx hardhat run scripts/deploy.js --network localhost
          </code>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <strong>3. Setup MetaMask:</strong>
          <ul style={listStyle}>
            <li>Network: Hardhat Local</li>
            <li>RPC URL: http://127.0.0.1:8545</li>
            <li>Chain ID: 31337</li>
            <li>Import test account from hardhat node output</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <strong>4. Update Contract Addresses:</strong>
          <p style={{ margin: '4px 0' }}>
            Copy deployed addresses to <code>src/constants/contracts.js</code>
          </p>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <strong>5. Test the Game:</strong>
          <ul style={listStyle}>
            <li>✅ Connect MetaMask wallet</li>
            <li>✅ Mint a character NFT (Warrior/Mage/Archer)</li>
            <li>✅ Battle the Shadow Dragon boss</li>
            <li>✅ Attack with 5-second cooldown</li>
            <li>✅ Win or lose and revive</li>
          </ul>
        </div>
      </div>
      
      <button onClick={onHide} style={hideButtonStyle}>
        Hide Instructions
      </button>
    </div>
  );
};

export default TestingInstructions;
