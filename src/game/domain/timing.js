// Every delay used by the game lives here so pacing can be tuned from one place.
// Values preserve the legacy pacing: a round banner is visible while the first
// flash is pending, flashes are spaced 1000ms apart starting 2000ms into the
// round, input is accepted 400ms after the last flash starts, a flash (either
// "showing" a letter or giving success/fail feedback) lasts 500ms, and the
// next round starts 1000ms after the current one is completed.

export const ROUND_INTRO_DELAY = 2000;
export const FLASH_INTERVAL = 1000;
export const INPUT_READY_DELAY = 400;
export const SHOW_HIGHLIGHT_DURATION = 500;
export const FEEDBACK_HIGHLIGHT_DURATION = 500;
export const ROUND_COMPLETE_DELAY = 1000;
