import { useWallet } from '../hooks/useWallet';
import { CHAIN_CONFIG } from '../constants/contracts';

const WalletConnect = () => {
  const { 
    account, 
    chainId, 
    isConnecting, 
    error, 
    connectWallet, 
    disconnectWallet, 
    switchNetwork,
    formatAddress,
    isConnected 
  } = useWallet();

  const currentNetwork = chainId ? CHAIN_CONFIG[chainId] : null;
  const isUnsupportedNetwork = chainId && !CHAIN_CONFIG[chainId];

  if (isConnected) {
    return (
      <div className="wallet-info">
        <div>
          <div>
            <strong>Connected:</strong> {formatAddress(account)}
          </div>
          {currentNetwork && (
            <div>
              <strong>Network:</strong> {currentNetwork.name}
            </div>
          )}
          {isUnsupportedNetwork && (
            <div className="error">
              Unsupported network. Please switch to Hardhat Local or Sepolia Testnet.
            </div>
          )}
        </div>
        <div>
          {isUnsupportedNetwork && (
            <button 
              className="button secondary"
              onClick={() => switchNetwork(31337)}
              style={{ marginRight: '1rem' }}
            >
              Switch to Local
            </button>
          )}
          <button 
            className="button"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Connect Your Wallet</h2>
      <p>Connect your MetaMask wallet to start playing the NFT Battle Game!</p>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      
      <button 
        className="button primary"
        onClick={connectWallet}
        disabled={isConnecting}
        style={{ marginTop: '1rem', width: '100%' }}
      >
        {isConnecting ? (
          <div className="loading">
            <div className="spinner"></div>
            Connecting...
          </div>
        ) : (
          'Connect MetaMask'
        )}
      </button>
      
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
        <p>Don't have MetaMask? <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" style={{ color: '#ffd700' }}>Install it here</a></p>
      </div>
    </div>
  );
};

export default WalletConnect;
