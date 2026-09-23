// Per-mode differences live here as plain data (a factory), never as Strategy
// objects/interfaces. React state only ever stores a mode id string; whoever
// needs mode data resolves it through createGameMode(id).

import { paceForRound } from './timing';

const PROFILES = {
  rookie: {
    rounds: 10, pace: { base: 1000, decay: 0.96, min: 500 }, scoreMultiplier: 1,
  },
  normal: {
    rounds: 14, pace: { base: 950, decay: 0.95, min: 450 }, scoreMultiplier: 1.5,
  },
  expert: {
    rounds: 18, pace: { base: 900, decay: 0.94, min: 380 }, scoreMultiplier: 2,
  },
  eidetic: {
    rounds: 22, pace: { base: 800, decay: 0.92, min: 300 }, scoreMultiplier: 3,
  },
  endless: {
    rounds: Infinity,
    pace: { base: 900, decay: 0.95, min: 300 },
    isEndless: true,
    scoreMultiplier: 2,
  },
};

export const MODE_IDS = ['rookie', 'normal', 'expert', 'eidetic', 'endless'];

export const DEFAULT_MODE = 'normal';

export function isGameMode(id) {
  return Object.prototype.hasOwnProperty.call(PROFILES, id);
}

export function createGameMode(id) {
  if (!isGameMode(id)) return null;

  const {
    rounds, pace, isEndless = false, scoreMultiplier,
  } = PROFILES[id];

  return Object.freeze({
    id,
    rounds,
    isEndless,
    scoreMultiplier,
    isFinalRound(round) {
      return round === rounds - 1;
    },
    paceForRound(round) {
      return paceForRound(pace, round);
    },
  });
}
