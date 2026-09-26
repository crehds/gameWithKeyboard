import type { Letter } from './letters';
import { isLetter } from './letters';
import type { ModeId } from './gameMode';
import { DEFAULT_MODE, isGameMode, createGameMode } from './gameMode';
import type { OrderId } from './inputOrder';
import { DEFAULT_ORDER, isInputOrder, createInputOrder } from './inputOrder';
import { pointsForKey, roundBonus } from './scoring';

export type Phase =
  'configuring' | 'idle' | 'showing' | 'awaitingInput' | 'roundComplete' | 'won' | 'lost';

export type HighlightKind = 'show' | 'success' | 'fail';

export interface Highlight {
  readonly letter: Letter;
  readonly kind: HighlightKind;
}

// The visual state of one key, as computed by keyStatus() below.
export type KeyStatus = 'idle' | 'active' | 'success' | 'fail';

export interface GameState {
  readonly phase: Phase;
  readonly modeId: ModeId;
  readonly orderId: OrderId;
  readonly sequence: readonly Letter[];
  readonly round: number;
  readonly inputIndex: number;
  readonly showIndex: number;
  readonly highlight: Highlight | null;
  readonly score: number;
}

export const OPEN_SETUP = 'OPEN_SETUP';
export const CANCEL_SETUP = 'CANCEL_SETUP';
export const START = 'START';
export const SHOW_NEXT = 'SHOW_NEXT';
export const CLEAR_HIGHLIGHT = 'CLEAR_HIGHLIGHT';
export const KEY = 'KEY';
export const NEXT_ROUND = 'NEXT_ROUND';
export const RETRY = 'RETRY';
export const QUIT = 'QUIT';

interface OpenSetupAction {
  readonly type: typeof OPEN_SETUP;
}
interface CancelSetupAction {
  readonly type: typeof CANCEL_SETUP;
}
interface StartPayload {
  readonly modeId: ModeId;
  readonly firstLetter: Letter;
  readonly orderId?: OrderId;
}
interface StartAction {
  readonly type: typeof START;
  readonly payload: StartPayload;
}
interface ShowNextAction {
  readonly type: typeof SHOW_NEXT;
}
interface ClearHighlightAction {
  readonly type: typeof CLEAR_HIGHLIGHT;
}
interface KeyPayload {
  readonly letter: Letter;
}
interface KeyAction {
  readonly type: typeof KEY;
  readonly payload: KeyPayload;
}
interface NextRoundPayload {
  readonly nextLetter: Letter;
}
interface NextRoundAction {
  readonly type: typeof NEXT_ROUND;
  readonly payload: NextRoundPayload;
}
interface RetryPayload {
  readonly firstLetter: Letter;
}
interface RetryAction {
  readonly type: typeof RETRY;
  readonly payload: RetryPayload;
}
interface QuitAction {
  readonly type: typeof QUIT;
}

export type GameAction =
  | OpenSetupAction
  | CancelSetupAction
  | StartAction
  | ShowNextAction
  | ClearHighlightAction
  | KeyAction
  | NextRoundAction
  | RetryAction
  | QuitAction;

export const openSetup = (): OpenSetupAction => ({ type: OPEN_SETUP });
export const cancelSetup = (): CancelSetupAction => ({ type: CANCEL_SETUP });
export const start = (
  modeId: ModeId,
  firstLetter: Letter,
  orderId: OrderId = DEFAULT_ORDER,
): StartAction => ({
  type: START,
  payload: { modeId, firstLetter, orderId },
});
export const showNext = (): ShowNextAction => ({ type: SHOW_NEXT });
export const clearHighlight = (): ClearHighlightAction => ({ type: CLEAR_HIGHLIGHT });
export const pressKey = (letter: Letter): KeyAction => ({ type: KEY, payload: { letter } });
export const nextRound = (nextLetter: Letter): NextRoundAction => ({
  type: NEXT_ROUND,
  payload: { nextLetter },
});
export const retry = (firstLetter: Letter): RetryAction => ({
  type: RETRY,
  payload: { firstLetter },
});
export const quit = (): QuitAction => ({ type: QUIT });

export const initialState: GameState = {
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

const PLAYING_PHASES: readonly Phase[] = [
  'showing',
  'awaitingInput',
  'roundComplete',
  'won',
  'lost',
];

export function isPlaying(state: GameState): boolean {
  return PLAYING_PHASES.includes(state.phase);
}

export function keyStatus(state: GameState, letter: Letter): KeyStatus {
  if (state.highlight && state.highlight.letter === letter) {
    if (state.highlight.kind === 'show') return 'active';
    if (state.highlight.kind === 'success') return 'success';
    if (state.highlight.kind === 'fail') return 'fail';
  }
  return 'idle';
}

function handleOpenSetup(state: GameState): GameState {
  return { ...state, phase: 'configuring' };
}

function handleCancelSetup(state: GameState): GameState {
  if (state.phase !== 'configuring') return state;
  return { ...state, phase: 'idle' };
}

function handleStart(state: GameState, action: StartAction): GameState {
  if (state.phase !== 'configuring') return state;
  // Untyped callers can omit the payload; the guards below reject every
  // missing field, exactly as they reject invalid ones.
  const {
    modeId,
    firstLetter,
    orderId = DEFAULT_ORDER,
  }: Partial<StartPayload> = action.payload || {};
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

function handleShowNext(state: GameState): GameState {
  if (state.phase !== 'showing') return state;
  const nextShowIndex = state.showIndex + 1;
  if (nextShowIndex > state.round) {
    return { ...state, phase: 'awaitingInput', inputIndex: 0 };
  }
  const letter = state.sequence[nextShowIndex];
  // noUncheckedIndexedAccess guard: nextShowIndex is within [0, round], which
  // is always a valid sequence index; a miss means an invariant broke.
  if (letter === undefined) return state;
  return {
    ...state,
    showIndex: nextShowIndex,
    highlight: { letter, kind: 'show' },
  };
}

function handleClearHighlight(state: GameState): GameState {
  if (!state.highlight) return state;
  return { ...state, highlight: null };
}

function handleKey(state: GameState, action: KeyAction): GameState {
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

  const isLastRound = mode !== null && mode.isFinalRound(state.round);
  const bonus = roundBonus(state.round, multiplier);
  return {
    ...state,
    inputIndex: nextInputIndex,
    highlight: { letter, kind: 'success' },
    phase: isLastRound ? 'won' : 'roundComplete',
    score: state.score + keyPoints + bonus,
  };
}

function handleNextRound(state: GameState, action: NextRoundAction): GameState {
  if (state.phase !== 'roundComplete') return state;
  // Untyped callers can omit the payload; isLetter below rejects that case.
  const { nextLetter }: Partial<NextRoundPayload> = action.payload || {};
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

function handleRetry(state: GameState, action: RetryAction): GameState {
  if (state.phase !== 'lost') return state;
  // Untyped callers can omit the payload; isLetter below rejects that case.
  const { firstLetter }: Partial<RetryPayload> = action.payload || {};
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

function handleQuit(state: GameState): GameState {
  if (state.phase !== 'won' && state.phase !== 'lost') return state;
  return { ...state, phase: 'idle', highlight: null };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case OPEN_SETUP:
      return handleOpenSetup(state);
    case CANCEL_SETUP:
      return handleCancelSetup(state);
    case START:
      return handleStart(state, action);
    case SHOW_NEXT:
      return handleShowNext(state);
    case CLEAR_HIGHLIGHT:
      return handleClearHighlight(state);
    case KEY:
      return handleKey(state, action);
    case NEXT_ROUND:
      return handleNextRound(state, action);
    case RETRY:
      return handleRetry(state, action);
    case QUIT:
      return handleQuit(state);
    default: {
      // Exhaustiveness check: adding a GameAction member without a case above
      // makes `action` fail to satisfy `never` here, breaking `npm run typecheck`.
      const unhandledAction: never = action;
      void unhandledAction;
      return state;
    }
  }
}
