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
  NEXT_ROUND,
  RETRY,
} from './gameMachine';
import { pointsForKey, roundBonus } from './scoring';

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
      const wonState = { ...initialState, phase: 'won' };
      expect(gameReducer(wonState, openSetup()).phase).toBe('configuring');

      const showingState = { ...initialState, phase: 'showing' };
      expect(gameReducer(showingState, openSetup()).phase).toBe('configuring');
    });
  });

  describe('CANCEL_SETUP', () => {
    it('moves from configuring to idle', () => {
      const state = { ...initialState, phase: 'configuring' };
      expect(gameReducer(state, cancelSetup()).phase).toBe('idle');
    });

    it('is ignored outside configuring', () => {
      const state = { ...initialState, phase: 'idle' };
      expect(gameReducer(state, cancelSetup())).toBe(state);
    });
  });

  describe('START', () => {
    it('moves from configuring to showing with a one-letter sequence at round 0', () => {
      const state = { ...initialState, phase: 'configuring' };
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
      const state = { ...initialState, phase: 'idle' };
      expect(gameReducer(state, start('expert', 'A'))).toBe(state);
    });

    it('is ignored when the mode is unknown', () => {
      const state = { ...initialState, phase: 'configuring' };
      expect(gameReducer(state, start('legendary', 'A'))).toBe(state);
    });

    it('is ignored when the first letter is missing or not a letter', () => {
      const state = { ...initialState, phase: 'configuring' };
      expect(gameReducer(state, start('expert', undefined))).toBe(state);
      expect(gameReducer(state, start('expert', '1'))).toBe(state);
      expect(gameReducer(state, start('expert', 'AB'))).toBe(state);
      expect(gameReducer(state, { type: START })).toBe(state);
    });

    it('resets the score to 0', () => {
      const state = { ...initialState, phase: 'configuring', score: 999 };
      expect(gameReducer(state, start('expert', 'A')).score).toBe(0);
    });

    it('defaults the input order to forward when omitted', () => {
      const state = { ...initialState, phase: 'configuring' };
      expect(gameReducer(state, start('expert', 'A')).orderId).toBe('forward');
    });

    it('stores the given input order', () => {
      const state = { ...initialState, phase: 'configuring' };
      expect(gameReducer(state, start('expert', 'A', 'reverse')).orderId).toBe('reverse');
    });

    it('is ignored when the order id is unknown', () => {
      const state = { ...initialState, phase: 'configuring' };
      expect(gameReducer(state, start('expert', 'A', 'sideways'))).toBe(state);
    });
  });

  describe('SHOW_NEXT', () => {
    const showingState = {
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
      const lastFlash = { ...showingState, showIndex: 1 };
      const next = gameReducer(lastFlash, showNext());
      expect(next.phase).toBe('awaitingInput');
      expect(next.inputIndex).toBe(0);
    });

    it('is ignored outside showing', () => {
      const state = { ...initialState, phase: 'idle' };
      expect(gameReducer(state, showNext())).toBe(state);
    });
  });

  describe('CLEAR_HIGHLIGHT', () => {
    it('clears the highlight', () => {
      const state = { ...initialState, highlight: { letter: 'A', kind: 'show' } };
      expect(gameReducer(state, clearHighlight()).highlight).toBeNull();
    });

    it('is a no-op when there is nothing to clear', () => {
      const state = { ...initialState, highlight: null };
      expect(gameReducer(state, clearHighlight())).toBe(state);
    });
  });

  describe('KEY', () => {
    const awaitingState = {
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
      const state = { ...awaitingState, inputIndex: 1 };
      const next = gameReducer(state, pressKey('B'));
      expect(next.phase).toBe('roundComplete');
      expect(next.inputIndex).toBe(2);
    });

    it('wins when the last round of a fixed-length mode is completed', () => {
      const lastRoundState = {
        ...initialState,
        phase: 'awaitingInput',
        modeId: 'rookie',
        sequence: Array.from({ length: 10 }, () => 'A'),
        round: 9,
        inputIndex: 9,
      };
      const next = gameReducer(lastRoundState, pressKey('A'));
      expect(next.phase).toBe('won');
    });

    it('never wins on endless, no matter how many rounds are completed', () => {
      const state = {
        ...initialState,
        phase: 'awaitingInput',
        modeId: 'endless',
        sequence: Array.from({ length: 50 }, () => 'A'),
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
      expect(gameReducer(awaitingState, pressKey(null))).toBe(awaitingState);
    });

    it('is ignored while the sequence is still showing (early taps)', () => {
      const showingState = { ...awaitingState, phase: 'showing', showIndex: 0 };
      expect(gameReducer(showingState, pressKey('A'))).toBe(showingState);
    });

    it('regression #2: is ignored once the game has been won', () => {
      const wonState = {
        ...initialState,
        phase: 'won',
        sequence: ['A'],
        round: 0,
        inputIndex: 1,
      };
      expect(gameReducer(wonState, pressKey('A'))).toBe(wonState);
    });

    it('regression #4: a repeated key press after the round already completed is ignored (no level skip)', () => {
      const state = {
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
      const state = { ...awaitingState };
      const snapshot = JSON.parse(JSON.stringify(state));
      gameReducer(state, pressKey('A'));
      expect(state).toEqual(snapshot);
    });

    describe('scoring', () => {
      it('adds pointsForKey on a correct, non-completing key press', () => {
        const state = {
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
        const state = {
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
        const state = {
          ...initialState,
          phase: 'awaitingInput',
          modeId: 'rookie',
          sequence: Array.from({ length: 10 }, () => 'A'),
          round: 9,
          inputIndex: 9,
          score: 0,
        };
        const next = gameReducer(state, pressKey('A'));
        expect(next.phase).toBe('won');
        expect(next.score).toBe(pointsForKey(9, 1) + roundBonus(9, 1));
      });

      it('adds nothing on a wrong key', () => {
        const state = {
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
        const state = {
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
      const reverseAwaitingState = {
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
      const state = {
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
      const state = { ...initialState, phase: 'showing' };
      expect(gameReducer(state, nextRound('B'))).toBe(state);
    });

    it('is ignored when the next letter is missing or not a letter', () => {
      const state = {
        ...initialState,
        phase: 'roundComplete',
        sequence: ['A'],
        round: 0,
      };
      expect(gameReducer(state, nextRound(undefined))).toBe(state);
      expect(gameReducer(state, nextRound('2'))).toBe(state);
      expect(gameReducer(state, { type: NEXT_ROUND })).toBe(state);
    });
  });

  describe('RETRY', () => {
    it('restarts the same mode with a fresh one-letter sequence from round 0', () => {
      const state = {
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
      const state = { ...initialState, phase: 'won' };
      expect(gameReducer(state, retry('A'))).toBe(state);
    });

    it('is ignored when the first letter is missing or not a letter', () => {
      const state = {
        ...initialState,
        phase: 'lost',
        modeId: 'expert',
        sequence: ['A', 'B', 'C'],
        round: 2,
      };
      expect(gameReducer(state, retry(undefined))).toBe(state);
      expect(gameReducer(state, retry('9'))).toBe(state);
      expect(gameReducer(state, { type: RETRY })).toBe(state);
    });

    it('resets the score to 0', () => {
      const state = {
        ...initialState,
        phase: 'lost',
        modeId: 'expert',
        score: 999,
      };
      expect(gameReducer(state, retry('A')).score).toBe(0);
    });

    it('keeps the current orderId', () => {
      const state = {
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
      const state = { ...initialState, phase: 'won' };
      expect(gameReducer(state, quit()).phase).toBe('idle');
    });

    it('moves from lost to idle', () => {
      const state = { ...initialState, phase: 'lost' };
      expect(gameReducer(state, quit()).phase).toBe('idle');
    });

    it('is ignored outside won/lost', () => {
      const state = { ...initialState, phase: 'showing' };
      expect(gameReducer(state, quit())).toBe(state);
    });
  });

  describe('unknown actions', () => {
    it('returns the same state reference', () => {
      const state = { ...initialState };
      expect(gameReducer(state, { type: 'NOT_A_REAL_ACTION' })).toBe(state);
    });
  });

  describe('selectors', () => {
    it('isPlaying is true for every active phase', () => {
      ['showing', 'awaitingInput', 'roundComplete', 'won', 'lost'].forEach((phase) => {
        expect(isPlaying({ ...initialState, phase })).toBe(true);
      });
    });

    it('isPlaying is false for configuring and idle', () => {
      expect(isPlaying({ ...initialState, phase: 'configuring' })).toBe(false);
      expect(isPlaying({ ...initialState, phase: 'idle' })).toBe(false);
    });

    it('keyStatus reflects the current highlight', () => {
      const state = { ...initialState, highlight: { letter: 'A', kind: 'success' } };
      expect(keyStatus(state, 'A')).toBe('success');
      expect(keyStatus(state, 'B')).toBe('idle');
    });

    it('keyStatus returns idle when there is no highlight', () => {
      expect(keyStatus(initialState, 'A')).toBe('idle');
    });
  });
});
