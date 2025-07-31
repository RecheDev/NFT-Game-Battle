import { useState, useEffect } from 'react';

export const useCharacterCheck = (gameCharacterContract, signer) => {
  const [hasCharacter, setHasCharacter] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkUserCharacter = async () => {
    if (!gameCharacterContract || !signer) {
      setHasCharacter(false);
      return;
    }

    try {
      setLoading(true);
      const address = await signer.getAddress();
      const tokenId = await gameCharacterContract.nftHolders(address);
      setHasCharacter(Number(tokenId) > 0);
    } catch (err) {
      console.error('Error checking user character:', err);
      setHasCharacter(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserCharacter();
  }, [gameCharacterContract, signer]);

  const handleCharacterMinted = () => {
    setHasCharacter(true);
  };

  return {
    hasCharacter,
    loading,
    handleCharacterMinted
  };
};