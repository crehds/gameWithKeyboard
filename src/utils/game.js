import { activate } from '../gameSetup/utils';

export function validateKeyCode({ keyCode, min, max }) {
  return keyCode > min || keyCode < max;
}

export function handleKeyResult(keyCode, indexKey, currentLevel, currentKey, levels) {
  if (validateKeyCode({ keyCode, min: 65, max: 90 })) {
    if (keyCode === currentKey) {
      activate(currentKey, { success: true });

      if (indexKey + 1 === levels) {
        return 'win';
      }

      if (indexKey + 1 > currentLevel) {
        return 'next';
      }

      return 'playing';
    }

    activate(keyCode, { fail: true });
    return 'lose';
  }

  return 'out';
}

export function handleActivateKeys({ currentLevel, boardKeys, listener }) {
  for (let j = 0; j <= currentLevel; j += 1) {
    setTimeout((keyboard) => activate(keyboard[j]), 1000 * (j + 1) + 1000, boardKeys);
    if (j === currentLevel) {
      setTimeout(
        () => window.addEventListener('keydown', listener),
        1000 * (j + 1) + 1400,
      );
    }
  }
}
