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
  INPUT_READY_DELAY,
  FEEDBACK_HIGHLIGHT_DURATION,
  ROUND_COMPLETE_DELAY,
} from '../domain/timing';

export default function useGame(random = Math.random) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const {
    phase, round, showIndex, highlight, modeId,
  } = state;

  const mode = createGameMode(modeId);
  const { flashInterval, showDuration } = mode
    ? mode.paceForRound(round)
    : { flashInterval: INPUT_READY_DELAY, showDuration: FEEDBACK_HIGHLIGHT_DURATION };

  useEffect(() => {
    if (phase !== 'showing') return undefined;

    let delay = flashInterval;
    if (showIndex === -1) {
      delay = ROUND_INTRO_DELAY;
    } else if (showIndex === round) {
      delay = INPUT_READY_DELAY;
    }

    const timerId = setTimeout(() => dispatch(showNext()), delay);
    return () => clearTimeout(timerId);
  }, [phase, showIndex, round, flashInterval]);

  useEffect(() => {
    if (!highlight) return undefined;

    const duration = highlight.kind === 'show' ? showDuration : FEEDBACK_HIGHLIGHT_DURATION;
    const timerId = setTimeout(() => dispatch(clearHighlight()), duration);
    return () => clearTimeout(timerId);
  }, [highlight, showDuration]);

  useEffect(() => {
    if (phase !== 'roundComplete') return undefined;

    const timerId = setTimeout(() => dispatch(nextRound()), ROUND_COMPLETE_DELAY);
    return () => clearTimeout(timerId);
  }, [phase]);

  const openSetupAction = useCallback(() => dispatch(openSetup()), []);
  const cancelSetupAction = useCallback(() => dispatch(cancelSetup()), []);

  const startAction = useCallback((selectedModeId) => {
    const selectedMode = createGameMode(selectedModeId);
    if (!selectedMode) return;
    dispatch(start(selectedModeId, generateSequence(selectedMode.rounds, random)));
  }, [random]);

  const retryAction = useCallback(() => {
    if (!mode) return;
    dispatch(retry(generateSequence(mode.rounds, random)));
  }, [random, mode]);

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
