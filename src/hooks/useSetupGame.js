import { useEffect, useState } from 'react';

import initGame from '../gameSetup/init';
import configModal from '../utils/configModal';

const INITIAL_CONFIG = {
  levels: 0,
  playing: false,
};

function useSetupGame() {
  const [config, setConfig] = useState(INITIAL_CONFIG);

  const handleConfig = async () => {
    const newConfig = await configModal();
    setConfig(newConfig);
  };

  useEffect(() => {
    if (config.playing) {
      initGame(config.levels, setConfig);
    }
  }, [config]);

  useEffect(() => {
    handleConfig();
  }, []);

  return [config, handleConfig];
}

export default useSetupGame;
