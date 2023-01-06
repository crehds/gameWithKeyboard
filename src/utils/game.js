import { activate } from '../gameSetup/utils';

export function validateKeyCode({ keyCode, min, max }) {
  return keyCode > min || keyCode < max;
}

export function handleResult(keyCode, indexKey, currentLevel, currentKey) {
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
