import { useState, useEffect } from 'react';

const CharacterSelect = ({ gameCharacterContract, onCharacterMinted }) => {
  const [defaultCharacters, setDefaultCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDefaultCharacters();
  }, [gameCharacterContract]);

  const loadDefaultCharacters = async () => {
    if (!gameCharacterContract) return;

    try {
      setLoading(true);
      const characters = await gameCharacterContract.getDefaultCharacters();
      setDefaultCharacters(characters.map((char, index) => ({
        index,
        name: char.name,
        imageURI: char.imageURI,
        hp: Number(char.hp),
        attackDamage: Number(char.attackDamage)
      })));
    } catch (err) {
      console.error('Error loading characters:', err);
      setError('Failed to load character data');
    } finally {
      setLoading(false);
    }
  };

  const mintCharacter = async () => {
    if (!gameCharacterContract || selectedCharacter === null) return;

    try {
      setIsMinting(true);
      setError('');

      const tx = await gameCharacterContract.mintCharacterNFT(selectedCharacter);
      
      await tx.wait();
      
      onCharacterMinted && onCharacterMinted();
      
    } catch (err) {
      console.error('Error minting character:', err);
      setError('Failed to mint character. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          Loading characters...
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Choose Your Character</h2>
      <p>Select a character to mint as your NFT and start battling!</p>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="character-grid">
        {defaultCharacters.map((character) => (
          <div
            key={character.index}
            className={`character-card ${selectedCharacter === character.index ? 'selected' : ''}`}
            onClick={() => setSelectedCharacter(character.index)}
          >
            <div className="character-image">
              {character.name.charAt(0)}
            </div>
            <h3>{character.name}</h3>
            <div style={{ marginTop: '1rem' }}>
              <div>❤️ HP: {character.hp}</div>
              <div>⚔️ Attack: {character.attackDamage}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedCharacter !== null && (
        <button
          className="button primary"
          onClick={mintCharacter}
          disabled={isMinting}
          style={{ width: '100%', marginTop: '2rem' }}
        >
          {isMinting ? (
            <div className="loading">
              <div className="spinner"></div>
              Minting Character...
            </div>
          ) : (
            `Mint ${defaultCharacters[selectedCharacter]?.name}`
          )}
        </button>
      )}
    </div>
  );
};

export default CharacterSelect;
