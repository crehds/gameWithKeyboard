import { useEffect, useState } from 'react';

import configModal from '../utils/configModal';
import useNextLevel from './useNextLevel';

function useSetupGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameLevels, setGameLevels] = useState(0);
  const handleStartLevel = useNextLevel(setIsPlaying, gameLevels);

  const handleConfig = async () => {
    const { levels, playing } = await configModal();
    setIsPlaying(playing);
    setGameLevels(levels);
  };

  const handleGame = () => {
    handleStartLevel();
  };

  useEffect(() => {
    if (isPlaying) {
      handleGame();
    }
  }, [isPlaying]);

  useEffect(() => {
    handleConfig();
  }, []);

  return [isPlaying, handleConfig];
}

export default useSetupGame;
