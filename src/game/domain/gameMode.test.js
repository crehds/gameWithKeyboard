import {
  MODE_IDS, DEFAULT_MODE, isGameMode, createGameMode,
} from './gameMode';

describe('gameMode', () => {
  it('orders mode ids from easiest to hardest', () => {
    expect(MODE_IDS).toEqual(['rookie', 'normal', 'expert', 'eidetic']);
  });

  it('defaults to normal', () => {
    expect(DEFAULT_MODE).toBe('normal');
  });

  describe('isGameMode', () => {
    it('is true for every known mode id', () => {
      MODE_IDS.forEach((id) => {
        expect(isGameMode(id)).toBe(true);
      });
    });

    it('is false for an unknown id', () => {
      expect(isGameMode('legendary')).toBe(false);
    });

    it('is false for inherited Object.prototype properties', () => {
      expect(isGameMode('toString')).toBe(false);
      expect(isGameMode('__proto__')).toBe(false);
    });

    it('is false for undefined', () => {
      expect(isGameMode(undefined)).toBe(false);
    });
  });

  describe('createGameMode', () => {
    it('returns null for an unknown id', () => {
      expect(createGameMode('legendary')).toBeNull();
    });

    it.each([
      ['rookie', 10],
      ['normal', 14],
      ['expert', 18],
      ['eidetic', 22],
    ])('builds %s with %i rounds', (id, rounds) => {
      const mode = createGameMode(id);
      expect(mode.id).toBe(id);
      expect(mode.rounds).toBe(rounds);
    });

    it('returns a frozen object', () => {
      expect(Object.isFrozen(createGameMode('rookie'))).toBe(true);
    });

    describe('isFinalRound', () => {
      it('is false before the last round index', () => {
        const mode = createGameMode('rookie');
        expect(mode.isFinalRound(8)).toBe(false);
      });

      it('is true at the last round index', () => {
        const mode = createGameMode('rookie');
        expect(mode.isFinalRound(9)).toBe(true);
      });
    });
  });
});
