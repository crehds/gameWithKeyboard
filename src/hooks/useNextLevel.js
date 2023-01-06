import { useEffect, useState } from 'react';
import { activate, generarTeclas } from '../gameSetup/utils';
import sweetAlert from '../utils/sweetAlert';

function validateKeyCode({ keyCode, min, max }) {
  return keyCode > min || keyCode < max;
}

function handleResult(keyCode, indexKey, currentLevel, currentKey) {
  if (validateKeyCode({ keyCode, min: 65, max: 90 })) {
    if (keyCode === currentKey) {
      activate(currentKey, { success: true });

      if (indexKey + 1 > currentLevel) {
        return 'next';
      }

      return 'playing';
    }

    activate(keyCode, { fail: true });
    return 'lose';
  }

  return null;
}

function useNextLevel(setIsPlaying, levels) {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [boardKeys, setBoardKeys] = useState([]);
  let indexKey = 0;

  const handleStartLevel = () => {
    setBoardKeys(generarTeclas(levels));
    setCurrentLevel(0);
  };

  function onKeyDown(ev) {
    const { keyCode } = ev;
    const currentKey = boardKeys[indexKey];
    const result = handleResult(keyCode, indexKey, currentLevel, currentKey);
    if (result) {
      if (result === 'next') {
        window.removeEventListener('keydown', onKeyDown);
        return setTimeout(() => setCurrentLevel(currentLevel + 1), 1000);
      }

      if (result === 'lose') {
        window.removeEventListener('keydown', onKeyDown);
        setCurrentLevel(null);

        return setTimeout(() => {
          sweetAlert.fail().then((ok) => {
            if (ok.value) {
              return handleStartLevel();
            }

            return setIsPlaying(false);
          });
        }, 400);
      }
      indexKey += 1;
    }
    return null;
  }

  const handleNextLevel = () => {
    if (currentLevel === levels) {
      return sweetAlert.success();
    }

    sweetAlert.showLevel(currentLevel, levels);
    for (let j = 0; j <= currentLevel; j += 1) {
      setTimeout((keyboard) => activate(keyboard[j]), 1000 * (j + 1) + 1000, boardKeys);
      if (j === currentLevel) {
        setTimeout(
          () => window.addEventListener('keydown', onKeyDown),
          1000 * (j + 1) + 1400,
        );
      }
    }

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
