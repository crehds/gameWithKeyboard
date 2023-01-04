import { useEffect, useRef, useState } from 'react';
import { activate, generarTeclas } from '../gameSetup/utils';
import sweetAlert from '../utils/sweetAlert';

function validateKeyCode({ keyCode, min, max }) {
  return keyCode > min || keyCode < max;
}

function useNextLevel(setIsPlaying, levels) {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [boardKeys, setBoardKeys] = useState([]);
  const listener = useRef(null);

  const handleStartLevel = () => {
    setBoardKeys(generarTeclas(levels));
    setCurrentLevel(0);
  };

  const handleNextLevel = () => {
    if (currentLevel === levels) {
      return sweetAlert.success();
    }

    sweetAlert.showLevel(currentLevel, levels);

    let i = 0;
    let currentKey = boardKeys[i];
    function onKeyDown(ev) {
      const { keyCode } = ev;
      if (validateKeyCode({ keyCode, min: 65, max: 90 })) {
        if (ev.keyCode === currentKey) {
          activate(currentKey, { success: true });
          i += 1;

          if (i > currentLevel) {
            window.removeEventListener('keydown', onKeyDown);
            setTimeout(() => setCurrentLevel(i), 1000);
          }

          currentKey = boardKeys[i];
          return null;
        }

        activate(keyCode, { fail: true });
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

      return null;
    }

    listener.current = onKeyDown;
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
      document.removeEventListener('keydown', listener.current);
    };
  }, [currentLevel]);

  return handleStartLevel;
}

export default useNextLevel;
