import { isLetter } from './letters';
import { DEFAULT_MODE, isGameMode, createGameMode } from './gameMode';
import {
  DEFAULT_ORDER, isInputOrder, createInputOrder,
} from './inputOrder';
import { pointsForKey, roundBonus } from './scoring';

export const OPEN_SETUP = 'OPEN_SETUP';
export const CANCEL_SETUP = 'CANCEL_SETUP';
export const START = 'START';
export const SHOW_NEXT = 'SHOW_NEXT';
export const CLEAR_HIGHLIGHT = 'CLEAR_HIGHLIGHT';
export const KEY = 'KEY';
export const NEXT_ROUND = 'NEXT_ROUND';
export const RETRY = 'RETRY';
export const QUIT = 'QUIT';

export const openSetup = () => ({ type: OPEN_SETUP });
export const cancelSetup = () => ({ type: CANCEL_SETUP });
export const start = (modeId, firstLetter, orderId = DEFAULT_ORDER) => (
  { type: START, payload: { modeId, firstLetter, orderId } }
);
export const showNext = () => ({ type: SHOW_NEXT });
export const clearHighlight = () => ({ type: CLEAR_HIGHLIGHT });
export const pressKey = (letter) => ({ type: KEY, payload: { letter } });
export const nextRound = (nextLetter) => ({ type: NEXT_ROUND, payload: { nextLetter } });
export const retry = (firstLetter) => ({ type: RETRY, payload: { firstLetter } });
export const quit = () => ({ type: QUIT });

export const initialState = {
  phase: 'configuring',
  modeId: DEFAULT_MODE,
  orderId: DEFAULT_ORDER,
  sequence: [],
  round: 0,
  inputIndex: 0,
  showIndex: -1,
  highlight: null,
  score: 0,
};

const PLAYING_PHASES = ['showing', 'awaitingInput', 'roundComplete', 'won', 'lost'];

export function isPlaying(state) {
  return PLAYING_PHASES.includes(state.phase);
}

export function keyStatus(state, letter) {
  if (state.highlight && state.highlight.letter === letter) {
    if (state.highlight.kind === 'show') return 'active';
    if (state.highlight.kind === 'success') return 'success';
    if (state.highlight.kind === 'fail') return 'fail';
  }
  return 'idle';
}

function handleOpenSetup(state) {
  return { ...state, phase: 'configuring' };
}

function handleCancelSetup(state) {
  if (state.phase !== 'configuring') return state;
  return { ...state, phase: 'idle' };
}

function handleStart(state, action) {
  if (state.phase !== 'configuring') return state;
  const { modeId, firstLetter, orderId = DEFAULT_ORDER } = action.payload || {};
  if (!isGameMode(modeId) || !isLetter(firstLetter) || !isInputOrder(orderId)) return state;
  return {
    ...state,
    phase: 'showing',
    modeId,
    orderId,
    sequence: [firstLetter],
    round: 0,
    inputIndex: 0,
    showIndex: -1,
    highlight: null,
    score: 0,
  };
}

function handleShowNext(state) {
  if (state.phase !== 'showing') return state;
  const nextShowIndex = state.showIndex + 1;
  if (nextShowIndex > state.round) {
    return { ...state, phase: 'awaitingInput', inputIndex: 0 };
  }
  return {
    ...state,
    showIndex: nextShowIndex,
    highlight: { letter: state.sequence[nextShowIndex], kind: 'show' },
  };
}

function handleClearHighlight(state) {
  if (!state.highlight) return state;
  return { ...state, highlight: null };
}

function handleKey(state, action) {
  if (state.phase !== 'awaitingInput') return state;
  const { letter } = action.payload;
  if (!isLetter(letter)) return state;

  const order = createInputOrder(state.orderId) || createInputOrder(DEFAULT_ORDER);
  const expected = order.expectedLetter(state.sequence, state.inputIndex);
  if (letter !== expected) {
    return { ...state, phase: 'lost', highlight: { letter, kind: 'fail' } };
  }

  const mode = createGameMode(state.modeId);
  const multiplier = (mode ? mode.scoreMultiplier : 1) * order.scoreMultiplier;
  const keyPoints = pointsForKey(state.round, multiplier);

  const nextInputIndex = state.inputIndex + 1;
  const completesRound = nextInputIndex > state.round;
  if (!completesRound) {
    return {
      ...state,
      inputIndex: nextInputIndex,
      highlight: { letter, kind: 'success' },
      score: state.score + keyPoints,
    };
  }

  const isLastRound = Boolean(mode) && mode.isFinalRound(state.round);
  const bonus = roundBonus(state.round, multiplier);
  return {
    ...state,
    inputIndex: nextInputIndex,
    highlight: { letter, kind: 'success' },
    phase: isLastRound ? 'won' : 'roundComplete',
    score: state.score + keyPoints + bonus,
  };
}

function handleNextRound(state, action) {
  if (state.phase !== 'roundComplete') return state;
  const { nextLetter } = action.payload || {};
  if (!isLetter(nextLetter)) return state;
  return {
    ...state,
    phase: 'showing',
    sequence: [...state.sequence, nextLetter],
    round: state.round + 1,
    showIndex: -1,
    inputIndex: 0,
    highlight: null,
  };
}

function handleRetry(state, action) {
  if (state.phase !== 'lost') return state;
  const { firstLetter } = action.payload || {};
  if (!isLetter(firstLetter)) return state;
  return {
    ...state,
    phase: 'showing',
    sequence: [firstLetter],
    round: 0,
    showIndex: -1,
    inputIndex: 0,
    highlight: null,
    score: 0,
  };
}

function handleQuit(state) {
  if (state.phase !== 'won' && state.phase !== 'lost') return state;
  return { ...state, phase: 'idle', highlight: null };
}

const handlers = {
  [OPEN_SETUP]: handleOpenSetup,
  [CANCEL_SETUP]: handleCancelSetup,
  [START]: handleStart,
  [SHOW_NEXT]: handleShowNext,
  [CLEAR_HIGHLIGHT]: handleClearHighlight,
  [KEY]: handleKey,
  [NEXT_ROUND]: handleNextRound,
  [RETRY]: handleRetry,
  [QUIT]: handleQuit,
};

export function gameReducer(state, action) {
  const handler = handlers[action.type];
  return handler ? handler(state, action) : state;
}
