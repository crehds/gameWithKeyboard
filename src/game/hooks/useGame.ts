import { useCallback, useEffect, useReducer, useRef } from 'react';
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
import type { GameState } from '../domain/gameMachine';
import { randomLetter } from '../domain/letters';
import type { Letter } from '../domain/letters';
import { createGameMode } from '../domain/gameMode';
import type { ModeId } from '../domain/gameMode';
import { DEFAULT_ORDER, createInputOrder } from '../domain/inputOrder';
import type { OrderId } from '../domain/inputOrder';
import {
  ROUND_INTRO_DELAY,
  INPUT_READY_DELAY,
  FEEDBACK_HIGHLIGHT_DURATION,
  ROUND_COMPLETE_DELAY,
} from '../domain/timing';

// Function properties, not method shorthand: these are standalone callbacks
// that consumers destructure, and property syntax gets strict (not bivariant)
// parameter checks.
export interface UseGameResult {
  state: GameState;
  openSetup: () => void;
  start: (modeId: ModeId, orderId?: OrderId) => void;
  cancelSetup: () => void;
  retry: () => void;
  quit: () => void;
  pressLetter: (letter: Letter) => void;
}

export default function useGame(random: () => number = Math.random): UseGameResult {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { phase, round, showIndex, highlight, modeId } = state;

  const mode = createGameMode(modeId);
  const { flashInterval, showDuration } = mode
    ? mode.paceForRound(round)
    : { flashInterval: INPUT_READY_DELAY, showDuration: FEEDBACK_HIGHLIGHT_DURATION };

  // Keep the latest random in a ref so timers can read it at call time
  // without resetting on every re-render caused by an unstable random.
  const randomRef = useRef(random);
  useEffect(() => {
    randomRef.current = random;
  }, [random]);

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

    const timerId = setTimeout(
      () => dispatch(nextRound(randomLetter(randomRef.current))),
      ROUND_COMPLETE_DELAY,
    );
    return () => clearTimeout(timerId);
  }, [phase]);

  const openSetupAction = useCallback(() => dispatch(openSetup()), []);
  const cancelSetupAction = useCallback(() => dispatch(cancelSetup()), []);

  const startAction = useCallback(
    (selectedModeId: ModeId, selectedOrderId: OrderId = DEFAULT_ORDER) => {
      if (!createGameMode(selectedModeId) || !createInputOrder(selectedOrderId)) return;
      dispatch(start(selectedModeId, randomLetter(randomRef.current), selectedOrderId));
    },
    [],
  );

  const retryAction = useCallback(() => {
    dispatch(retry(randomLetter(randomRef.current)));
  }, []);

  const quitAction = useCallback(() => dispatch(quit()), []);
  const pressLetterAction = useCallback((letter: Letter) => dispatch(pressKey(letter)), []);

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
