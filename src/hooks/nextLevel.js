import { activate } from '../gameSetup/utils';
import sweetAlert from '../utils/sweetAlert';

function nextLevel(currentLevel, levels, boardKeys, handleLevel) {
  if (currentLevel === levels) {
    return sweetAlert.success();
  }

  sweetAlert.showLevel(currentLevel, levels);

  let i = 0;
  let currentKey = boardKeys[i];

  function onkeydown(ev) {
    if (ev.keyCode < 65 || ev.keyCode > 90) {
      sweetAlert.warning();
    }
    if (ev.keyCode === currentKey) {
      activate(currentKey, { success: true });
      i += 1;

      if (i > currentLevel) {
        window.removeEventListener('keydown', onkeydown);
        setTimeout(() => handleLevel(i), 1000);
      }

      currentKey = boardKeys[i];
      return null;
    }

    activate(ev.keyCode, { fail: true });
    window.removeEventListener('keydown', onkeydown);
    return setTimeout(() => {
      sweetAlert.fail().then((ok) => {
        if (ok.value) {
          return handleLevel(0, true);
        }

        return handleLevel(null);
      });
    }, 400);
  }

  for (let j = 0; j <= currentLevel; j += 1) {
    setTimeout((keyboard) => activate(keyboard[j]), 1000 * (j + 1) + 1000, boardKeys);
    if (j === currentLevel) {
      setTimeout(
        () => window.addEventListener('keydown', onkeydown),
        1000 * (j + 1) + 1400,
      );
    }
  }

  return null;
}

export default nextLevel;
