// Every delay used by the game lives here so pacing can be tuned from one place.
// Values preserve the legacy pacing: a round banner is visible while the first
// flash is pending, flashes speed up round over round per the current game
// mode's pace profile (see paceForRound below), input is accepted 400ms after
// the last flash starts, a feedback flash (success/fail) lasts 500ms, and the
// next round starts 1000ms after the current one is completed.

export const ROUND_INTRO_DELAY = 2000;
export const INPUT_READY_DELAY = 400;
export const FEEDBACK_HIGHLIGHT_DURATION = 500;
export const ROUND_COMPLETE_DELAY = 1000;

// Pure: given a mode's { base, decay, min } pace profile and the current
// round (0-based), returns how long a flash stays spaced from the next one
// (flashInterval) and how long the shown letter stays highlighted
// (showDuration, half of the interval). The interval decays exponentially
// round over round and is clamped at `min` so the game never becomes
// unplayable.
export function paceForRound(pace, round) {
  const { base, decay, min } = pace;
  const flashInterval = Math.max(min, Math.round(base * decay ** round));
  const showDuration = Math.round(flashInterval / 2);
  return { flashInterval, showDuration };
}
