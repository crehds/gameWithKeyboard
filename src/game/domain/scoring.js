// Pure scoring formulas. `round` is 0-based (the round currently being
// played) and `multiplier` comes from the current mode's scoreMultiplier.

export function pointsForKey(round, multiplier) {
  return Math.round(10 * (round + 1) * multiplier);
}

export function roundBonus(round, multiplier) {
  return Math.round(25 * (round + 1) * multiplier);
}
