// Input order is a Strategy: interchangeable functions sharing one contract
// (expectedLetter(sequence, inputIndex)), selected by id, the same convention
// as gameMode.js's createGameMode(id). Unlike modes, the rule that changes
// here is *how input is checked*, so it is expressed as a strategy rather
// than as data the reducer branches on.

import type { Letter } from './letters';

export const ORDER_IDS = ['forward', 'reverse'] as const;

export type OrderId = (typeof ORDER_IDS)[number];

export interface InputOrder {
  readonly id: OrderId;
  readonly scoreMultiplier: number;
  readonly expectedLetter: (sequence: readonly Letter[], inputIndex: number) => Letter | undefined;
}

type Strategy = Omit<InputOrder, 'id'>;

const STRATEGIES: Record<OrderId, Strategy> = {
  forward: {
    scoreMultiplier: 1,
    expectedLetter(sequence, inputIndex) {
      return sequence[inputIndex];
    },
  },
  reverse: {
    scoreMultiplier: 1.5,
    expectedLetter(sequence, inputIndex) {
      return sequence[sequence.length - 1 - inputIndex];
    },
  },
};

export const DEFAULT_ORDER = 'forward';

export const REVERSE_ORDER = 'reverse';

export function isInputOrder(id: unknown): id is OrderId {
  // hasOwnProperty coerces its key argument to a property key; a non-string
  // id (including undefined) safely reports as "not an own property".
  return Object.prototype.hasOwnProperty.call(STRATEGIES, id as PropertyKey);
}

// The overload lets callers who already hold a valid OrderId (e.g. the
// reducer's `createInputOrder(state.orderId) || createInputOrder(DEFAULT_ORDER)`
// fallback) get a non-null InputOrder back without a redundant null check.
export function createInputOrder(id: OrderId): InputOrder;
export function createInputOrder(id: unknown): InputOrder | null;
export function createInputOrder(id: unknown): InputOrder | null {
  if (!isInputOrder(id)) return null;

  const { scoreMultiplier, expectedLetter } = STRATEGIES[id];

  return Object.freeze({
    id,
    scoreMultiplier,
    expectedLetter,
  });
}
