import { useEffect, useState } from 'react';
import { setupGame } from '../components/functions';

export function useNextLevel(config) {
  const [level, setLevels] = useState(config.levels);
  const [playing, setPlaying] = useState(config.playing);

  useEffect(() => {
    if (playing) {
      setupGame(level);
    }
  },[playing,level]);

  return [
    { level, playing },
    { setLevels, setPlaying },
  ];
}
