import { useEffect, useState } from 'react';
import { setupGame } from '../components/functions';

export function useNextLevel(data = {}) {
  // const [level, setLevels] = useState(config.levels);
  const [config, setConfig] = useState({ ...data });

  useEffect(() => {
    if (config.playing) {
      setupGame(config.levels, setConfig);
    }
  }, [config]);

  return [config, setConfig];
}
