import { generateKeys } from '../gameSetup/utils';
import initialSetup from './initialSetup';

export default (state, action) => {
  const {
    currentLevel, levels,
  } = state;
  switch (action.type) {
    case 'next': {
      return { ...state, currentLevel: currentLevel + 1 };
    }
    case 'lose': {
      return { ...initialSetup };
    }
    case 'reset': {
      const newKeys = generateKeys(levels);
      return { ...state, currentLevel: 0, boardKeys: newKeys };
    }
    case 'init': {
      const { payload } = action;
      return { ...payload };
    }
    default:
      return state;
  }
};
