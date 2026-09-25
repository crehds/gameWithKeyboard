import {
  MODE_IDS, DEFAULT_MODE, isGameMode, createGameMode,
} from './gameMode';

describe('gameMode', () => {
  it('orders mode ids from easiest to hardest, with endless last', () => {
    expect(MODE_IDS).toEqual(['rookie', 'normal', 'expert', 'eidetic', 'endless']);
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

    it('is not endless for the four fixed-length modes', () => {
      ['rookie', 'normal', 'expert', 'eidetic'].forEach((id) => {
        expect(createGameMode(id).isEndless).toBe(false);
      });
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

    describe('endless', () => {
      const mode = createGameMode('endless');

      it('has no round limit', () => {
        expect(mode.rounds).toBe(Infinity);
      });

      it('is flagged as endless', () => {
        expect(mode.isEndless).toBe(true);
      });

      it('never reaches a final round', () => {
        [0, 1, 49, 10000].forEach((round) => {
          expect(mode.isFinalRound(round)).toBe(false);
        });
      });
    });

    describe('scoreMultiplier', () => {
      const EXPECTED = {
        rookie: 1,
        normal: 1.5,
        expert: 2,
        eidetic: 3,
        endless: 2,
      };

      MODE_IDS.forEach((id) => {
        it(`is ${EXPECTED[id]} for ${id}`, () => {
          expect(createGameMode(id).scoreMultiplier).toBe(EXPECTED[id]);
        });
      });
    });

    describe('paceForRound', () => {
      const EXPECTED = {
        rookie: { base: 1000, min: 500 },
        normal: { base: 950, min: 450 },
        expert: { base: 900, min: 380 },
        eidetic: { base: 800, min: 300 },
        endless: { base: 900, min: 300 },
      };

      MODE_IDS.forEach((id) => {
        describe(id, () => {
          const mode = createGameMode(id);
          const { base, min } = EXPECTED[id];

          it('starts at its base interval on round 0', () => {
            expect(mode.paceForRound(0).flashInterval).toBe(base);
          });

          it('decreases the interval as rounds progress', () => {
            const round1 = mode.paceForRound(1).flashInterval;
            const round2 = mode.paceForRound(2).flashInterval;
            expect(round1).toBeLessThan(base);
            expect(round2).toBeLessThan(round1);
          });

          it('clamps at its minimum interval, which is below its base', () => {
            expect(min).toBeLessThan(base);
            expect(mode.paceForRound(1000).flashInterval).toBe(min);
          });

          it('shows the letter for half of the flash interval', () => {
            const { flashInterval, showDuration } = mode.paceForRound(3);
            expect(showDuration).toBe(Math.round(flashInterval / 2));
          });
        });
      });
    });
  });
});
