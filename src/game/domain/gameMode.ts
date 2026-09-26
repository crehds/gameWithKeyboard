// Per-mode differences live here as plain data (a factory), never as Strategy
// objects/interfaces. React state only ever stores a mode id string; whoever
// needs mode data resolves it through createGameMode(id). Rules that change
// *how input is checked* (e.g. input order) are not mode data: they live in
// inputOrder.js as strategies instead.

import { paceForRound } from './timing';
import type { Pace, RoundPace } from './timing';

export const MODE_IDS = ['rookie', 'normal', 'expert', 'eidetic', 'endless'] as const;

export type ModeId = (typeof MODE_IDS)[number];

export interface GameMode {
  readonly id: ModeId;
  readonly rounds: number;
  readonly isEndless: boolean;
  readonly scoreMultiplier: number;
  readonly isFinalRound: (round: number) => boolean;
  readonly paceForRound: (round: number) => RoundPace;
}

interface ModeProfile {
  rounds: number;
  pace: Pace;
  scoreMultiplier: number;
  isEndless?: boolean;
}

const PROFILES: Record<ModeId, ModeProfile> = {
  rookie: {
    rounds: 10,
    pace: { base: 1000, decay: 0.96, min: 500 },
    scoreMultiplier: 1,
  },
  normal: {
    rounds: 14,
    pace: { base: 950, decay: 0.95, min: 450 },
    scoreMultiplier: 1.5,
  },
  expert: {
    rounds: 18,
    pace: { base: 900, decay: 0.94, min: 380 },
    scoreMultiplier: 2,
  },
  eidetic: {
    rounds: 22,
    pace: { base: 800, decay: 0.92, min: 300 },
    scoreMultiplier: 3,
  },
  endless: {
    rounds: Infinity,
    pace: { base: 900, decay: 0.95, min: 300 },
    isEndless: true,
    scoreMultiplier: 2,
  },
};

export const DEFAULT_MODE = 'normal';

export function isGameMode(id: unknown): id is ModeId {
  // hasOwnProperty coerces its key argument to a property key; a non-string
  // id (including undefined) safely reports as "not an own property".
  return Object.prototype.hasOwnProperty.call(PROFILES, id as PropertyKey);
}

// The overload lets callers who already hold a valid ModeId (most call sites,
// including this file's own tests) get a non-null GameMode back without a
// redundant null check; it mirrors createInputOrder's overload.
export function createGameMode(id: ModeId): GameMode;
export function createGameMode(id: unknown): GameMode | null;
export function createGameMode(id: unknown): GameMode | null {
  if (!isGameMode(id)) return null;

  const { rounds, pace, isEndless = false, scoreMultiplier } = PROFILES[id];

  return Object.freeze({
    id,
    rounds,
    isEndless,
    scoreMultiplier,
    isFinalRound(round: number): boolean {
      return round === rounds - 1;
    },
    paceForRound(round: number): RoundPace {
      return paceForRound(pace, round);
    },
  });
}
