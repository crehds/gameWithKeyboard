import { handleActivateKeys, handleKeyResult } from '../utils/game';
import sweetAlert from '../utils/sweetAlert';

function useNextLevel(setup, updateSetup) {
  const { boardKeys, currentLevel, levels } = setup;
  let indexKey = 0;

  const next = () => setTimeout(
    () => updateSetup({ type: 'next' }),
    1000,
  );

  const lose = () => {
    setTimeout(() => {
      sweetAlert.fail().then((ok) => {
        if (ok.value) {
          return updateSetup({ type: 'reset' });
        }

        return updateSetup({ type: 'lose' });
      });
    }, 400);
  };

  const win = () => {
    setTimeout(() => {
      sweetAlert.success();
    }, 400);
  };

  function onKeyDown(ev) {
    const { keyCode } = ev;
    const currentKey = boardKeys[indexKey];
    const result = handleKeyResult(keyCode, indexKey, currentLevel, currentKey, levels);
    const action = {
      next,
      lose,
      win,
    };

    if (action[result]) {
      const fn = action[result];
      return fn();
    }
    indexKey += 1;

    return null;
  }

  const handleNextLevel = () => {
    sweetAlert.showLevel(currentLevel, levels);
    handleActivateKeys({ currentLevel, boardKeys, listener: onKeyDown });

    return null;
  };

  return [handleNextLevel, onKeyDown];
}

export default useNextLevel;
