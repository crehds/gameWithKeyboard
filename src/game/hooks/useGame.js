import { useCallback, useEffect, useReducer } from 'react';
import {
  gameReducer,
  initialState,
  openSetup,
  cancelSetup,
  start,
  showNext,
  clearHighlight,
  pressKey,
  nextRound,
  retry,
  quit,
} from '../domain/gameMachine';
import { generateSequence } from '../domain/letters';
import { createGameMode } from '../domain/gameMode';
import {
  ROUND_INTRO_DELAY,
  FLASH_INTERVAL,
  INPUT_READY_DELAY,
  SHOW_HIGHLIGHT_DURATION,
  FEEDBACK_HIGHLIGHT_DURATION,
  ROUND_COMPLETE_DELAY,
} from '../domain/timing';

export default function useGame(random = Math.random) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const {
    phase, round, showIndex, highlight, modeId,
  } = state;

  useEffect(() => {
    if (phase !== 'showing') return undefined;

    let delay = FLASH_INTERVAL;
    if (showIndex === -1) {
      delay = ROUND_INTRO_DELAY;
    } else if (showIndex === round) {
      delay = INPUT_READY_DELAY;
    }

    const timerId = setTimeout(() => dispatch(showNext()), delay);
    return () => clearTimeout(timerId);
  }, [phase, showIndex, round]);

  useEffect(() => {
    if (!highlight) return undefined;

    const duration = highlight.kind === 'show' ? SHOW_HIGHLIGHT_DURATION : FEEDBACK_HIGHLIGHT_DURATION;
    const timerId = setTimeout(() => dispatch(clearHighlight()), duration);
    return () => clearTimeout(timerId);
  }, [highlight]);

  useEffect(() => {
    if (phase !== 'roundComplete') return undefined;

    const timerId = setTimeout(() => dispatch(nextRound()), ROUND_COMPLETE_DELAY);
    return () => clearTimeout(timerId);
  }, [phase]);

  const openSetupAction = useCallback(() => dispatch(openSetup()), []);
  const cancelSetupAction = useCallback(() => dispatch(cancelSetup()), []);

  const startAction = useCallback((selectedModeId) => {
    const mode = createGameMode(selectedModeId);
    if (!mode) return;
    dispatch(start(selectedModeId, generateSequence(mode.rounds, random)));
  }, [random]);

  const retryAction = useCallback(() => {
    const mode = createGameMode(modeId);
    if (!mode) return;
    dispatch(retry(generateSequence(mode.rounds, random)));
  }, [random, modeId]);

  const quitAction = useCallback(() => dispatch(quit()), []);
  const pressLetterAction = useCallback((letter) => dispatch(pressKey(letter)), []);

  return {
    state,
    openSetup: openSetupAction,
    start: startAction,
    cancelSetup: cancelSetupAction,
    retry: retryAction,
    quit: quitAction,
    pressLetter: pressLetterAction,
  };
}
