import { useEffect, useReducer } from 'react';
import { generateKeys } from '../gameSetup/utils';

import configModal from '../utils/configModal';
import useNextLevel from './useNextLevel';

const INITIAL_SETUP = {
  isPlaying: false,
  levels: null,
  boardKeys: null,
  currentLevel: null,
};

const reducer = (state, action) => {
  const {
    currentLevel, levels,
  } = state;
  switch (action.type) {
    case 'next': {
      return { ...state, currentLevel: currentLevel + 1 };
    }
    case 'lose': {
      return { ...INITIAL_SETUP };
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

function useSetupGame() {
  const [setup, updateSetup] = useReducer(
    reducer,
    { ...INITIAL_SETUP },
  );
  const [handleNextLevel, onKeyDown] = useNextLevel(setup, updateSetup);

  const handleConfig = async () => {
    const { levels, playing } = await configModal();
    const boardKeys = generateKeys(levels);
    updateSetup({
      type: 'init',
      payload: {
        levels,
        isPlaying: playing,
        currentLevel: 0,
        boardKeys,
      },
    });
  };

  useEffect(() => {
    const { isPlaying } = setup;
    if (isPlaying) {
      handleNextLevel();
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [setup]);

  useEffect(() => {
    handleConfig();
  }, []);

  return [setup, handleConfig];
}

export default useSetupGame;
