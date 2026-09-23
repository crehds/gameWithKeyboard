import { DIFFICULTIES, DEFAULT_DIFFICULTY, isDifficulty } from './difficulty';

describe('difficulty', () => {
  it('maps each difficulty to its sequence length', () => {
    expect(DIFFICULTIES).toEqual({
      rookie: 10,
      normal: 14,
      expert: 18,
      eidetic: 22,
    });
  });

  it('defaults to normal', () => {
    expect(DEFAULT_DIFFICULTY).toBe('normal');
    expect(DIFFICULTIES[DEFAULT_DIFFICULTY]).toBe(14);
  });

  describe('isDifficulty', () => {
    it('is true for every own key of DIFFICULTIES', () => {
      Object.keys(DIFFICULTIES).forEach((id) => {
        expect(isDifficulty(id)).toBe(true);
      });
    });

    it('is false for an unknown id', () => {
      expect(isDifficulty('legendary')).toBe(false);
    });

    it('is false for inherited Object.prototype properties', () => {
      expect(isDifficulty('toString')).toBe(false);
      expect(isDifficulty('__proto__')).toBe(false);
    });

    it('is false for undefined', () => {
      expect(isDifficulty(undefined)).toBe(false);
    });
  });
});
