import { activate } from '../gameSetup/utils';

export function validateKeyCode({ keyCode, min, max }) {
  return keyCode > min || keyCode < max;
}

export function handleKeyResult(keyCode, indexKey, currentLevel, currentKey) {
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

  return 'out';
}

export function handleActivateKeys({ currentLevel, boardKeys, onKeyDown }) {
  for (let j = 0; j <= currentLevel; j += 1) {
    setTimeout((keyboard) => activate(keyboard[j]), 1000 * (j + 1) + 1000, boardKeys);
    if (j === currentLevel) {
      setTimeout(
        () => window.addEventListener('keydown', onKeyDown),
        1000 * (j + 1) + 1400,
      );
    }
  }
}
