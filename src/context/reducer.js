import { generateKeys } from '../gameSetup/utils';
import initialSetup from './initialSetup';

export default (state, action) => {
  const {
    currentLevel, levels,
  } = state;

  const actions = {
    init: () => {
      const { payload } = action;
      return { ...payload };
    },
    lose: () => ({ ...initialSetup }),
    next: () => ({ ...state, currentLevel: currentLevel + 1 }),
    reset: () => {
      const newKeys = generateKeys(levels);
      return { ...state, currentLevel: 0, boardKeys: newKeys };
    },
    default: () => ({ ...state }),
  };

  return (actions[action.type] || actions.default)();
};
