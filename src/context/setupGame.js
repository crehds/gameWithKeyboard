import {
  useReducer, createContext, useContext, useMemo, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { generateKeys } from '../gameSetup/utils';

import configModal from '../utils/configModal';
import useNextLevel from '../hooks/useNextLevel';

const SetupGameContext = createContext();

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

export function SetupGameProvider({ children }) {
  const [setup, updateSetup] = useReducer(reducer, { ...INITIAL_SETUP });

  const [handleNextLevel, onKeyDown] = useNextLevel(setup, updateSetup);

  useEffect(() => {
    const { isPlaying } = setup;
    if (isPlaying) {
      handleNextLevel();
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [setup]);

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
    handleConfig();
  }, []);

  const state = useMemo(() => ({
    setup, handleConfig,
  }), [setup]);

  return (
    <SetupGameContext.Provider value={state}>
      {children}
    </SetupGameContext.Provider>
  );
}

SetupGameProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export function useSetupGame() {
  return useContext(SetupGameContext);
}
