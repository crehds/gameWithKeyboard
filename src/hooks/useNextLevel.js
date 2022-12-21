import { useEffect, useState } from 'react';
import { setupGame } from '../components/functions';

function useNextLevel(data = {}) {
  const [config, setConfig] = useState({ ...data });

  useEffect(() => {
    if (config.playing) {
      setupGame(config.levels, setConfig);
    }
  }, [config]);

  return [config, setConfig];
}

export default useNextLevel;
