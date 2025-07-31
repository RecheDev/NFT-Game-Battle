import { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { useContracts } from './hooks/useContracts';
import { useCharacterCheck } from './hooks/useCharacterCheck';
import WalletConnect from './components/WalletConnect';
import CharacterSelect from './components/CharacterSelect';
import BattleArena from './components/BattleArena';
import TestingInstructions from './components/TestingInstructions';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorCard from './components/ErrorCard';
import GameFooter from './components/GameFooter';

function App() {
  const { isConnected, signer, chainId } = useWallet();
  const { gameCharacterContract, battleLogicContract, error: contractError } = useContracts(signer);
  const { hasCharacter, loading, handleCharacterMinted } = useCharacterCheck(gameCharacterContract, signer);
  const [showInstructions, setShowInstructions] = useState(false);


  const renderGameContent = () => {
    if (loading) {
      return <LoadingSpinner message="Loading game data..." />;
    }

    if (contractError) {
      return (
        <ErrorCard
          title="Contract Error"
          message={contractError}
          additionalInfo="Follow the testing instructions above to set up contracts correctly."
        />
      );
    }

    if (!gameCharacterContract || !battleLogicContract) {
      return (
        <ErrorCard
          title="Setup Required"
          message="Contracts need to be deployed and configured."
          additionalInfo='👆 Click "Show Testing Instructions" above to get started!'
        />
      );
    }

    if (!hasCharacter) {
      return (
        <CharacterSelect 
          gameCharacterContract={gameCharacterContract}
          onCharacterMinted={handleCharacterMinted}
        />
      );
    }

    return (
      <BattleArena 
        gameCharacterContract={gameCharacterContract}
        battleLogicContract={battleLogicContract}
      />
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h1>⚔️ NFT Battle Game</h1>
        <p>A portfolio demo of Web3 gaming with smart contracts</p>
        <div style={{ marginTop: '1rem' }}>
          <button 
            onClick={() => setShowInstructions(!showInstructions)}
            className={showInstructions ? 'button secondary' : 'button primary'}
            style={{ fontSize: '14px' }}
          >
            {showInstructions ? 'Hide' : 'Show'} Testing Instructions
          </button>
        </div>
      </div>

      {showInstructions && (
        <TestingInstructions onHide={() => setShowInstructions(false)} />
      )}

      {!isConnected ? (
        <WalletConnect />
      ) : (
        <>
          <WalletConnect />
          {renderGameContent()}
        </>
      )}

      <GameFooter chainId={chainId} />
    </div>
  );
}

export default App;
