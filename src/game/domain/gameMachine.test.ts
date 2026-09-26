import {
  initialState,
  gameReducer,
  openSetup,
  cancelSetup,
  start,
  showNext,
  clearHighlight,
  pressKey,
  nextRound,
  retry,
  quit,
  isPlaying,
  keyStatus,
  START,
  KEY,
  NEXT_ROUND,
  RETRY,
} from './gameMachine';
import type { GameState, Phase, KeyStatus, GameAction } from './gameMachine';
import { pointsForKey, roundBonus } from './scoring';
import type { Letter } from './letters';

describe('gameMachine', () => {
  describe('initialState', () => {
    it('starts in the configuring phase', () => {
      expect(initialState.phase).toBe('configuring');
    });

    it('starts with a score of 0', () => {
      expect(initialState.score).toBe(0);
    });
  });

  describe('OPEN_SETUP', () => {
    it('moves to configuring from any phase', () => {
      const wonState: GameState = { ...initialState, phase: 'won' };
      expect(gameReducer(wonState, openSetup()).phase).toBe('configuring');

      const showingState: GameState = { ...initialState, phase: 'showing' };
      expect(gameReducer(showingState, openSetup()).phase).toBe('configuring');
    });
  });

  describe('CANCEL_SETUP', () => {
    it('moves from configuring to idle', () => {
      const state: GameState = { ...initialState, phase: 'configuring' };
      expect(gameReducer(state, cancelSetup()).phase).toBe('idle');
    });

    it('is ignored outside configuring', () => {
      const state: GameState = { ...initialState, phase: 'idle' };
      expect(gameReducer(state, cancelSetup())).toBe(state);
    });
  });

  describe('START', () => {
    it('moves from configuring to showing with a one-letter sequence at round 0', () => {
      const state: GameState = { ...initialState, phase: 'configuring' };
      const next = gameReducer(state, start('expert', 'A'));
      expect(next).toMatchObject({
        phase: 'showing',
        modeId: 'expert',
        sequence: ['A'],
        round: 0,
        showIndex: -1,
        inputIndex: 0,
      });
    });

    it('is ignored outside configuring', () => {
      const state: GameState = { ...initialState, phase: 'idle' };
      expect(gameReducer(state, start('expert', 'A'))).toBe(state);
    });

    it('is ignored when the mode is unknown', () => {
      const state: GameState = { ...initialState, phase: 'configuring' };
      // @ts-expect-error 'legendary' is not a member of ModeId
      expect(gameReducer(state, start('legendary', 'A'))).toBe(state);
    });

    it('is ignored when the first letter is missing or not a letter', () => {
      const state: GameState = { ...initialState, phase: 'configuring' };
      // @ts-expect-error firstLetter is required and must be a Letter
      expect(gameReducer(state, start('expert', undefined))).toBe(state);
      // @ts-expect-error '1' is not a Letter
      expect(gameReducer(state, start('expert', '1'))).toBe(state);
      // @ts-expect-error 'AB' is not a single Letter
      expect(gameReducer(state, start('expert', 'AB'))).toBe(state);
      // @ts-expect-error START requires a payload
      expect(gameReducer(state, { type: START })).toBe(state);
    });

    it('resets the score to 0', () => {
      const state: GameState = { ...initialState, phase: 'configuring', score: 999 };
      expect(gameReducer(state, start('expert', 'A')).score).toBe(0);
    });

    it('defaults the input order to forward when omitted', () => {
      const state: GameState = { ...initialState, phase: 'configuring' };
      expect(gameReducer(state, start('expert', 'A')).orderId).toBe('forward');
    });

    it('stores the given input order', () => {
      const state: GameState = { ...initialState, phase: 'configuring' };
      expect(gameReducer(state, start('expert', 'A', 'reverse')).orderId).toBe('reverse');
    });

    it('is ignored when the order id is unknown', () => {
      const state: GameState = { ...initialState, phase: 'configuring' };
      // @ts-expect-error 'sideways' is not a member of OrderId
      expect(gameReducer(state, start('expert', 'A', 'sideways'))).toBe(state);
    });
  });

  describe('SHOW_NEXT', () => {
    const showingState: GameState = {
      ...initialState,
      phase: 'showing',
      sequence: ['A', 'B', 'C'],
      round: 1,
      showIndex: -1,
      inputIndex: 0,
    };

    it('lights up the next letter of the prefix', () => {
      const next = gameReducer(showingState, showNext());
      expect(next.showIndex).toBe(0);
      expect(next.highlight).toEqual({ letter: 'A', kind: 'show' });
      expect(next.phase).toBe('showing');
    });

    it('moves to awaitingInput once the whole prefix has been shown', () => {
      const lastFlash: GameState = { ...showingState, showIndex: 1 };
      const next = gameReducer(lastFlash, showNext());
      expect(next.phase).toBe('awaitingInput');
      expect(next.inputIndex).toBe(0);
    });

    it('keeps the show loop moving, with nothing lit, if the sequence runs short', () => {
      // Unreachable through the reducer's own transitions. The timers only
      // schedule the next SHOW_NEXT when showIndex changes, so returning the
      // same state here would freeze the game in 'showing'.
      const shortSequence: GameState = { ...showingState, sequence: ['A'], showIndex: 0 };
      const next = gameReducer(shortSequence, showNext());
      expect(next.showIndex).toBe(1);
      expect(next.highlight).toBeNull();
      expect(next.phase).toBe('showing');
    });

    it('is ignored outside showing', () => {
      const state: GameState = { ...initialState, phase: 'idle' };
      expect(gameReducer(state, showNext())).toBe(state);
    });
  });

  describe('CLEAR_HIGHLIGHT', () => {
    it('clears the highlight', () => {
      const state: GameState = { ...initialState, highlight: { letter: 'A', kind: 'show' } };
      expect(gameReducer(state, clearHighlight()).highlight).toBeNull();
    });

    it('is a no-op when there is nothing to clear', () => {
      const state: GameState = { ...initialState, highlight: null };
      expect(gameReducer(state, clearHighlight())).toBe(state);
    });
  });

  describe('KEY', () => {
    const awaitingState: GameState = {
      ...initialState,
      phase: 'awaitingInput',
      sequence: ['A', 'B', 'C'],
      round: 1,
      inputIndex: 0,
    };

    it('advances inputIndex and flashes success on a correct letter', () => {
      const next = gameReducer(awaitingState, pressKey('A'));
      expect(next.inputIndex).toBe(1);
      expect(next.highlight).toEqual({ letter: 'A', kind: 'success' });
      expect(next.phase).toBe('awaitingInput');
    });

    it('completes the round when the prefix is finished', () => {
      const state: GameState = { ...awaitingState, inputIndex: 1 };
      const next = gameReducer(state, pressKey('B'));
      expect(next.phase).toBe('roundComplete');
      expect(next.inputIndex).toBe(2);
    });

    it('wins when the last round of a fixed-length mode is completed', () => {
      const lastRoundState: GameState = {
        ...initialState,
        phase: 'awaitingInput',
        modeId: 'rookie',
        sequence: Array.from({ length: 10 }, (): Letter => 'A'),
        round: 9,
        inputIndex: 9,
      };
      const next = gameReducer(lastRoundState, pressKey('A'));
      expect(next.phase).toBe('won');
    });

    it('never wins on endless, no matter how many rounds are completed', () => {
      const state: GameState = {
        ...initialState,
        phase: 'awaitingInput',
        modeId: 'endless',
        sequence: Array.from({ length: 50 }, (): Letter => 'A'),
        round: 49,
        inputIndex: 49,
      };
      const next = gameReducer(state, pressKey('A'));
      expect(next.phase).toBe('roundComplete');
    });

    it('loses on a wrong letter and flashes it as fail (wrong letter ends the game)', () => {
      const next = gameReducer(awaitingState, pressKey('Z'));
      expect(next.phase).toBe('lost');
      expect(next.highlight).toEqual({ letter: 'Z', kind: 'fail' });
    });

    it('ignores non-letter payloads', () => {
      // @ts-expect-error pressKey requires a Letter; null exercises the runtime guard
      expect(gameReducer(awaitingState, pressKey(null))).toBe(awaitingState);
    });

    it('is ignored while the sequence is still showing (early taps)', () => {
      const showingState: GameState = { ...awaitingState, phase: 'showing', showIndex: 0 };
      expect(gameReducer(showingState, pressKey('A'))).toBe(showingState);
    });

    it('regression #2: is ignored once the game has been won', () => {
      const wonState: GameState = {
        ...initialState,
        phase: 'won',
        sequence: ['A'],
        round: 0,
        inputIndex: 1,
      };
      expect(gameReducer(wonState, pressKey('A'))).toBe(wonState);
    });

    it('regression #4: a repeated key press after the round already completed is ignored (no level skip)', () => {
      const state: GameState = {
        ...initialState,
        phase: 'awaitingInput',
        sequence: ['A', 'B', 'C'],
        round: 0,
        inputIndex: 0,
      };
      const afterFirstPress = gameReducer(state, pressKey('A'));
      expect(afterFirstPress.phase).toBe('roundComplete');

      const afterSecondPress = gameReducer(afterFirstPress, pressKey('A'));
      expect(afterSecondPress).toBe(afterFirstPress);
    });

    it('does not mutate the input state (purity)', () => {
      const state: GameState = { ...awaitingState };
      // JSON.parse returns any; state is JSON-safe plain data, so the round
      // trip through JSON.stringify reproduces a GameState-shaped clone.
      const snapshot = JSON.parse(JSON.stringify(state)) as GameState;
      gameReducer(state, pressKey('A'));
      expect(state).toEqual(snapshot);
    });

    describe('scoring', () => {
      it('adds pointsForKey on a correct, non-completing key press', () => {
        const state: GameState = {
          ...initialState,
          phase: 'awaitingInput',
          modeId: 'rookie',
          sequence: ['A', 'B', 'C'],
          round: 2,
          inputIndex: 0,
          score: 100,
        };
        const next = gameReducer(state, pressKey('A'));
        expect(next.score).toBe(100 + pointsForKey(2, 1));
      });

      it('adds pointsForKey plus roundBonus when completing a non-final round', () => {
        const state: GameState = {
          ...initialState,
          phase: 'awaitingInput',
          modeId: 'normal',
          sequence: ['A', 'B'],
          round: 1,
          inputIndex: 1,
          score: 50,
        };
        const next = gameReducer(state, pressKey('B'));
        const multiplier = 1.5;
        expect(next.phase).toBe('roundComplete');
        expect(next.score).toBe(50 + pointsForKey(1, multiplier) + roundBonus(1, multiplier));
      });

      it('adds pointsForKey plus roundBonus on the winning key of the final round', () => {
        const state: GameState = {
          ...initialState,
          phase: 'awaitingInput',
          modeId: 'rookie',
          sequence: Array.from({ length: 10 }, (): Letter => 'A'),
          round: 9,
          inputIndex: 9,
          score: 0,
        };
        const next = gameReducer(state, pressKey('A'));
        expect(next.phase).toBe('won');
        expect(next.score).toBe(pointsForKey(9, 1) + roundBonus(9, 1));
      });

      it('adds nothing on a wrong key', () => {
        const state: GameState = {
          ...initialState,
          phase: 'awaitingInput',
          sequence: ['A', 'B'],
          round: 1,
          inputIndex: 0,
          score: 40,
        };
        const next = gameReducer(state, pressKey('Z'));
        expect(next.score).toBe(40);
      });

      it('multiplies the mode and reverse-order score multipliers together', () => {
        const state: GameState = {
          ...initialState,
          phase: 'awaitingInput',
          modeId: 'expert',
          orderId: 'reverse',
          sequence: ['A'],
          round: 0,
          inputIndex: 0,
          score: 0,
        };
        const next = gameReducer(state, pressKey('A'));
        expect(next.phase).toBe('roundComplete');
        expect(next.score).toBe(105); // 30 key (10*1*3) + 75 bonus (25*1*3)
      });
    });

    describe('reverse order', () => {
      const reverseAwaitingState: GameState = {
        ...initialState,
        phase: 'awaitingInput',
        orderId: 'reverse',
        sequence: ['A', 'B'],
        round: 1,
        inputIndex: 0,
      };

      it('accepts the sequence typed backwards and completes the round', () => {
        const afterFirst = gameReducer(reverseAwaitingState, pressKey('B'));
        expect(afterFirst.phase).toBe('awaitingInput');
        expect(afterFirst.inputIndex).toBe(1);

        const afterSecond = gameReducer(afterFirst, pressKey('A'));
        expect(afterSecond.phase).toBe('roundComplete');
      });

      it('loses when the forward-order letter is typed first', () => {
        const next = gameReducer(reverseAwaitingState, pressKey('A'));
        expect(next.phase).toBe('lost');
      });
    });
  });

  describe('NEXT_ROUND', () => {
    it('moves from roundComplete to showing, appending the new letter and incrementing the round', () => {
      const state: GameState = {
        ...initialState,
        phase: 'roundComplete',
        sequence: ['A'],
        round: 0,
        showIndex: 2,
        inputIndex: 1,
      };
      const next = gameReducer(state, nextRound('B'));
      expect(next).toMatchObject({
        phase: 'showing',
        sequence: ['A', 'B'],
        round: 1,
        showIndex: -1,
        inputIndex: 0,
      });
    });

    it('is ignored outside roundComplete', () => {
      const state: GameState = { ...initialState, phase: 'showing' };
      expect(gameReducer(state, nextRound('B'))).toBe(state);
    });

    it('is ignored when the next letter is missing or not a letter', () => {
      const state: GameState = {
        ...initialState,
        phase: 'roundComplete',
        sequence: ['A'],
        round: 0,
      };
      // @ts-expect-error nextLetter is required and must be a Letter
      expect(gameReducer(state, nextRound(undefined))).toBe(state);
      // @ts-expect-error '2' is not a Letter
      expect(gameReducer(state, nextRound('2'))).toBe(state);
      // @ts-expect-error NEXT_ROUND requires a payload
      expect(gameReducer(state, { type: NEXT_ROUND })).toBe(state);
    });
  });

  describe('RETRY', () => {
    it('restarts the same mode with a fresh one-letter sequence from round 0', () => {
      const state: GameState = {
        ...initialState,
        phase: 'lost',
        modeId: 'expert',
        sequence: ['A', 'B', 'C', 'D'],
        round: 3,
      };
      const next = gameReducer(state, retry('Z'));
      expect(next).toMatchObject({
        phase: 'showing',
        modeId: 'expert',
        sequence: ['Z'],
        round: 0,
        showIndex: -1,
        inputIndex: 0,
      });
    });

    it('is ignored outside lost', () => {
      const state: GameState = { ...initialState, phase: 'won' };
      expect(gameReducer(state, retry('A'))).toBe(state);
    });

    it('is ignored when the first letter is missing or not a letter', () => {
      const state: GameState = {
        ...initialState,
        phase: 'lost',
        modeId: 'expert',
        sequence: ['A', 'B', 'C'],
        round: 2,
      };
      // @ts-expect-error firstLetter is required and must be a Letter
      expect(gameReducer(state, retry(undefined))).toBe(state);
      // @ts-expect-error '9' is not a Letter
      expect(gameReducer(state, retry('9'))).toBe(state);
      // @ts-expect-error RETRY requires a payload
      expect(gameReducer(state, { type: RETRY })).toBe(state);
    });

    it('resets the score to 0', () => {
      const state: GameState = {
        ...initialState,
        phase: 'lost',
        modeId: 'expert',
        score: 999,
      };
      expect(gameReducer(state, retry('A')).score).toBe(0);
    });

    it('keeps the current orderId', () => {
      const state: GameState = {
        ...initialState,
        phase: 'lost',
        modeId: 'expert',
        orderId: 'reverse',
        sequence: ['A', 'B', 'C', 'D'],
        round: 3,
      };
      expect(gameReducer(state, retry('Z')).orderId).toBe('reverse');
    });
  });

  describe('QUIT', () => {
    it('moves from won to idle', () => {
      const state: GameState = { ...initialState, phase: 'won' };
      expect(gameReducer(state, quit()).phase).toBe('idle');
    });

    it('moves from lost to idle', () => {
      const state: GameState = { ...initialState, phase: 'lost' };
      expect(gameReducer(state, quit()).phase).toBe('idle');
    });

    it('is ignored outside won/lost', () => {
      const state: GameState = { ...initialState, phase: 'showing' };
      expect(gameReducer(state, quit())).toBe(state);
    });
  });

  describe('unknown actions', () => {
    it('returns the same state reference', () => {
      const state: GameState = { ...initialState };
      // @ts-expect-error 'NOT_A_REAL_ACTION' is not a known action type
      expect(gameReducer(state, { type: 'NOT_A_REAL_ACTION' })).toBe(state);
    });
  });

  describe('selectors', () => {
    it('isPlaying is true for every active phase', () => {
      (['showing', 'awaitingInput', 'roundComplete', 'won', 'lost'] as const).forEach((phase) => {
        expect(isPlaying({ ...initialState, phase })).toBe(true);
      });
    });

    it('isPlaying is false for configuring and idle', () => {
      expect(isPlaying({ ...initialState, phase: 'configuring' })).toBe(false);
      expect(isPlaying({ ...initialState, phase: 'idle' })).toBe(false);
    });

    it('keyStatus reflects the current highlight', () => {
      const state: GameState = { ...initialState, highlight: { letter: 'A', kind: 'success' } };
      expect(keyStatus(state, 'A')).toBe('success');
      expect(keyStatus(state, 'B')).toBe('idle');
    });

    it('keyStatus returns idle when there is no highlight', () => {
      expect(keyStatus(initialState, 'A')).toBe('idle');
    });
  });

  describe('types', () => {
    it('pins the exact Phase union', () => {
      expectTypeOf<Phase>().toEqualTypeOf<
        'configuring' | 'idle' | 'showing' | 'awaitingInput' | 'roundComplete' | 'won' | 'lost'
      >();
    });

    it('keyStatus returns KeyStatus', () => {
      expectTypeOf(keyStatus).returns.toEqualTypeOf<KeyStatus>();
    });

    it('rejects a KEY action without a letter payload', () => {
      // @ts-expect-error KEY requires a payload with a letter
      assertType<GameAction>({ type: KEY });
    });

    it('rejects an unknown action type', () => {
      // @ts-expect-error 'NOT_A_REAL_ACTION' is not a known action type
      assertType<GameAction>({ type: 'NOT_A_REAL_ACTION' });
    });
  });
});
