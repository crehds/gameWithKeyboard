import * as timing from './timing';

describe('timing', () => {
  it('exports every delay as a positive number', () => {
    Object.values(timing).forEach((value) => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThan(0);
    });
  });

  it('reaches the first flash 2000ms after a round starts, matching legacy pacing', () => {
    expect(timing.ROUND_INTRO_DELAY).toBe(2000);
  });

  it('spaces consecutive flashes 1000ms apart, matching legacy pacing', () => {
    expect(timing.FLASH_INTERVAL).toBe(1000);
  });

  it('accepts input 400ms after the last flash starts, matching legacy pacing', () => {
    expect(timing.INPUT_READY_DELAY).toBe(400);
  });

  it('flashes a shown or fed-back key for 500ms, matching legacy pacing', () => {
    expect(timing.SHOW_HIGHLIGHT_DURATION).toBe(500);
    expect(timing.FEEDBACK_HIGHLIGHT_DURATION).toBe(500);
  });

  it('waits 1000ms before starting the next round, matching legacy pacing', () => {
    expect(timing.ROUND_COMPLETE_DELAY).toBe(1000);
  });
});
