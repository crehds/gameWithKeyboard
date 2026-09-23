import * as timing from './timing';

const { paceForRound, ...delays } = timing;

describe('timing', () => {
  it('exports every fixed delay as a positive number', () => {
    Object.values(delays).forEach((value) => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThan(0);
    });
  });

  it('reaches the first flash 2000ms after a round starts, matching legacy pacing', () => {
    expect(timing.ROUND_INTRO_DELAY).toBe(2000);
  });

  it('accepts input 400ms after the last flash starts, matching legacy pacing', () => {
    expect(timing.INPUT_READY_DELAY).toBe(400);
  });

  it('flashes feedback (success/fail) for 500ms, matching legacy pacing', () => {
    expect(timing.FEEDBACK_HIGHLIGHT_DURATION).toBe(500);
  });

  it('waits 1000ms before starting the next round, matching legacy pacing', () => {
    expect(timing.ROUND_COMPLETE_DELAY).toBe(1000);
  });

  describe('paceForRound', () => {
    const pace = { base: 1000, decay: 0.9, min: 400 };

    it('uses the base interval at round 0', () => {
      expect(paceForRound(pace, 0).flashInterval).toBe(1000);
    });

    it('decreases the interval as the round increases', () => {
      const round1 = paceForRound(pace, 1).flashInterval;
      const round2 = paceForRound(pace, 2).flashInterval;
      expect(round1).toBeLessThan(1000);
      expect(round2).toBeLessThan(round1);
    });

    it('clamps the interval at the configured minimum', () => {
      expect(paceForRound(pace, 100).flashInterval).toBe(400);
    });

    it('returns integer millisecond values', () => {
      const { flashInterval, showDuration } = paceForRound(pace, 3);
      expect(Number.isInteger(flashInterval)).toBe(true);
      expect(Number.isInteger(showDuration)).toBe(true);
    });

    it('shows the letter for half the flash interval', () => {
      const { flashInterval, showDuration } = paceForRound(pace, 2);
      expect(showDuration).toBe(Math.round(flashInterval / 2));
    });
  });
});
