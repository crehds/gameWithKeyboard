import { useCallback, useEffect, useState } from 'react';
import { generarTeclas } from '../gameSetup/utils';
import { handleActivateKeys, handleKeyResult } from '../utils/game';
import sweetAlert from '../utils/sweetAlert';

function useNextLevel(setIsPlaying, levels) {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [boardKeys, setBoardKeys] = useState([]);
  const handleStartLevel = useCallback(() => {
    setBoardKeys(generarTeclas(levels));
    setCurrentLevel(0);
  }, [levels]);

  let indexKey = 0;

  const next = () => setTimeout(
    () => setCurrentLevel(currentLevel + 1),
    1000,
  );

  const lose = () => {
    setCurrentLevel(null);
    setTimeout(() => {
      sweetAlert.fail().then((ok) => {
        if (ok.value) {
          return handleStartLevel();
        }

        return setIsPlaying(false);
      });
    }, 400);
  };

  function onKeyDown(ev) {
    const { keyCode } = ev;
    const currentKey = boardKeys[indexKey];
    const result = handleKeyResult(keyCode, indexKey, currentLevel, currentKey);
    const action = {
      next,
      lose,
    };

    if (action[result]) {
      const fn = action[result];
      return fn();
    }
    indexKey += 1;

    return null;
  }

  const handleNextLevel = () => {
    if (currentLevel === levels) {
      return sweetAlert.success();
    }

    sweetAlert.showLevel(currentLevel, levels);
    handleActivateKeys({ currentLevel, boardKeys, onKeyDown });

    return null;
  };

  useEffect(() => {
    if (currentLevel !== null) {
      handleNextLevel();
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [currentLevel]);

  return handleStartLevel;
}

export default useNextLevel;
