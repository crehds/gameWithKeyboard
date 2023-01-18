import { useEffect, useState } from 'react';

import configModal from '../utils/configModal';
import useNextLevel from './useNextLevel';

function useSetupGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameLevels, setGameLevels] = useState(0);

  const stopGame = () => {
    setIsPlaying(false);
    setGameLevels(0);
  };

  const handleStartLevel = useNextLevel(stopGame, gameLevels);

  const handleConfig = async () => {
    const { levels, playing } = await configModal();
    setIsPlaying(playing);
    setGameLevels(levels);
  };

  useEffect(() => {
    if (isPlaying) {
      handleStartLevel();
    }
  }, [isPlaying]);

  useEffect(() => {
    handleConfig();
  }, []);

  return [isPlaying, handleConfig];
}

export default useSetupGame;
