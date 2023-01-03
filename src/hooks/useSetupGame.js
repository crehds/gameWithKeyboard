import { useEffect, useState } from 'react';
import { generarTeclas } from '../gameSetup/utils';

import configModal from '../utils/configModal';
import nextLevel from './nextLevel';

const INITIAL_CONFIG = {
  levels: 0,
  playing: false,
  currentLevel: 0,
  boardKeys: [],
};

function useSetupGame() {
  const [config, setConfig] = useState({ ...INITIAL_CONFIG });

  const handleLevel = (level, reset) => {
    if (reset) {
      const boardKeys = generarTeclas(config.levels);
      return setConfig({ ...config, currentLevel: 0, boardKeys });
    }

    if (level) {
      return setConfig({ ...config, currentLevel: level });
    }

    return setConfig({ ...INITIAL_CONFIG });
  };

  const handleConfig = async () => {
    const { levels, playing } = await configModal();
    const boardKeys = generarTeclas(levels);
    setConfig({
      ...config, levels, playing, boardKeys,
    });
  };

  const handleGame = () => {
    const { currentLevel, levels, boardKeys } = config;
    nextLevel(currentLevel, levels, boardKeys, handleLevel);
  };

  useEffect(() => {
    const { playing } = config;
    if (playing) {
      handleGame();
    }
  }, [config]);

  useEffect(() => {
    handleConfig();
  }, []);

  return [config, handleConfig];
}

export default useSetupGame;
