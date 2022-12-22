import { useEffect, useState } from 'react';

import handleConfig from '../gameSetup/config';
import initGame from '../gameSetup/init';

const INITIAL_CONFIG = {
  levels: 0,
  playing: false,
};

function useSetupGame() {
  const [config, setConfig] = useState(INITIAL_CONFIG);

  const updateConfig = async () => {
    const newConfig = await handleConfig();
    if (newConfig.playing) {
      setConfig(newConfig);
    }
  };

  useEffect(() => {
    if (config.playing) {
      initGame(config.levels, setConfig);
    } else {
      updateConfig();
    }
  }, [config]);

  return [config, updateConfig];
}

export default useSetupGame;
