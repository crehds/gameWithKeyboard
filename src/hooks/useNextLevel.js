import { handleActivateKeys, handleKeyResult } from '../utils/game';
import handleTimeOut from '../utils/handleTimeOut';
import SweetAlert from '../utils/sweetAlert';

const sweetAlert = SweetAlert();

function useNextLevel(setup, updateSetup) {
  const { boardKeys, currentLevel, levels } = setup;
  let indexKey = 0;

  const next = () => handleTimeOut({
    cb: () => updateSetup({ type: 'next' }),
    time: 1000,
  });

  const lose = () => handleTimeOut({
    cb: () => sweetAlert.fail({
      confirm: () => updateSetup({ type: 'reset' }),
      cancel: () => updateSetup({ type: 'lose' }),
    }),
  });

  const win = () => handleTimeOut({ cb: () => sweetAlert.success() });

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
