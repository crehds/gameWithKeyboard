// Input order is a Strategy: interchangeable functions sharing one contract
// (expectedLetter(sequence, inputIndex)), selected by id, the same convention
// as gameMode.js's createGameMode(id). Unlike modes, the rule that changes
// here is *how input is checked*, so it is expressed as a strategy rather
// than as data the reducer branches on.

const STRATEGIES = {
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

export const ORDER_IDS = ['forward', 'reverse'];

export const DEFAULT_ORDER = 'forward';

export const REVERSE_ORDER = 'reverse';

export function isInputOrder(id) {
  return Object.prototype.hasOwnProperty.call(STRATEGIES, id);
}

export function createInputOrder(id) {
  if (!isInputOrder(id)) return null;

  const { scoreMultiplier, expectedLetter } = STRATEGIES[id];

  return Object.freeze({
    id,
    scoreMultiplier,
    expectedLetter,
  });
}
