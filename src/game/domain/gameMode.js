// Per-mode differences live here as plain data (a factory), never as Strategy
// objects/interfaces. React state only ever stores a mode id string; whoever
// needs mode data resolves it through createGameMode(id).

const PROFILES = {
  rookie: { rounds: 10 },
  normal: { rounds: 14 },
  expert: { rounds: 18 },
  eidetic: { rounds: 22 },
};

export const MODE_IDS = ['rookie', 'normal', 'expert', 'eidetic'];

export const DEFAULT_MODE = 'normal';

export function isGameMode(id) {
  return Object.prototype.hasOwnProperty.call(PROFILES, id);
}

export function createGameMode(id) {
  if (!isGameMode(id)) return null;

  const { rounds } = PROFILES[id];

  return Object.freeze({
    id,
    rounds,
    isFinalRound(round) {
      return round === rounds - 1;
    },
  });
}
