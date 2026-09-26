// Pure scoring formulas. `round` is 0-based (the round currently being
// played) and `multiplier` is the current mode's scoreMultiplier times the
// current input order's.

import type { ModeId } from './gameMode';
import type { OrderId } from './inputOrder';
import { DEFAULT_ORDER } from './inputOrder';

export function pointsForKey(round: number, multiplier: number): number {
  return Math.round(10 * (round + 1) * multiplier);
}

export function roundBonus(round: number, multiplier: number): number {
  return Math.round(25 * (round + 1) * multiplier);
}

// The default (forward) order keeps the bare mode id so best scores saved
// before input order existed keep matching their legacy storage key.
export function bestScoreSlot(modeId: ModeId, orderId: OrderId): string {
  return orderId === DEFAULT_ORDER ? modeId : `${modeId}.${orderId}`;
}
