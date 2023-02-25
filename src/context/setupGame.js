import {
  useReducer, createContext, useContext, useMemo, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { generateKeys } from '../gameSetup/utils';

import configModal from '../utils/configModal';
import useNextLevel from '../hooks/useNextLevel';
import reducer from './reducer';
import initialSetup from './initialSetup';

const SetupGameContext = createContext();

export function SetupGameProvider({ children }) {
  const [setup, updateSetup] = useReducer(reducer, { ...initialSetup });

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
