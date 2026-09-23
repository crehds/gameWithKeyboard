import { isLetter } from './letters';
import { DEFAULT_MODE, createGameMode } from './gameMode';

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
export const start = (modeId, sequence) => ({ type: START, payload: { modeId, sequence } });
export const showNext = () => ({ type: SHOW_NEXT });
export const clearHighlight = () => ({ type: CLEAR_HIGHLIGHT });
export const pressKey = (letter) => ({ type: KEY, payload: { letter } });
export const nextRound = () => ({ type: NEXT_ROUND });
export const retry = (sequence) => ({ type: RETRY, payload: { sequence } });
export const quit = () => ({ type: QUIT });

export const initialState = {
  phase: 'configuring',
  modeId: DEFAULT_MODE,
  sequence: [],
  round: 0,
  inputIndex: 0,
  showIndex: -1,
  highlight: null,
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

function fitsMode(sequence, modeId) {
  const mode = createGameMode(modeId);
  return Boolean(mode) && Array.isArray(sequence) && sequence.length === mode.rounds;
}

function handleStart(state, action) {
  if (state.phase !== 'configuring') return state;
  const { modeId, sequence } = action.payload || {};
  if (!fitsMode(sequence, modeId)) return state;
  return {
    ...state,
    phase: 'showing',
    modeId,
    sequence,
    round: 0,
    inputIndex: 0,
    showIndex: -1,
    highlight: null,
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

  const expected = state.sequence[state.inputIndex];
  if (letter !== expected) {
    return { ...state, phase: 'lost', highlight: { letter, kind: 'fail' } };
  }

  const nextInputIndex = state.inputIndex + 1;
  const completesRound = nextInputIndex > state.round;
  if (!completesRound) {
    return { ...state, inputIndex: nextInputIndex, highlight: { letter, kind: 'success' } };
  }

  const isLastRound = state.round === state.sequence.length - 1;
  return {
    ...state,
    inputIndex: nextInputIndex,
    highlight: { letter, kind: 'success' },
    phase: isLastRound ? 'won' : 'roundComplete',
  };
}

function handleNextRound(state) {
  if (state.phase !== 'roundComplete') return state;
  return {
    ...state,
    phase: 'showing',
    round: state.round + 1,
    showIndex: -1,
    inputIndex: 0,
    highlight: null,
  };
}

function handleRetry(state, action) {
  if (state.phase !== 'lost') return state;
  const { sequence } = action.payload || {};
  if (!fitsMode(sequence, state.modeId)) return state;
  return {
    ...state,
    phase: 'showing',
    sequence,
    round: 0,
    showIndex: -1,
    inputIndex: 0,
    highlight: null,
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
