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
} from './gameMachine';
import { DIFFICULTIES } from './difficulty';

const EXPERT_LENGTH = DIFFICULTIES.expert;

function buildSequence(length) {
  return Array.from({ length }, (_, index) => String.fromCharCode(65 + (index % 26)));
}

describe('gameMachine', () => {
  describe('initialState', () => {
    it('starts in the configuring phase', () => {
      expect(initialState.phase).toBe('configuring');
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
    it('moves from configuring to showing with round 0 and showIndex -1', () => {
      const state = { ...initialState, phase: 'configuring' };
      const sequence = buildSequence(EXPERT_LENGTH);
      const next = gameReducer(state, start('expert', sequence));
      expect(next).toMatchObject({
        phase: 'showing',
        difficulty: 'expert',
        sequence,
        round: 0,
        showIndex: -1,
        inputIndex: 0,
      });
    });

    it('is ignored outside configuring', () => {
      const state = { ...initialState, phase: 'idle' };
      expect(gameReducer(state, start('expert', ['A']))).toBe(state);
    });

    it('is ignored when the difficulty is unknown', () => {
      const state = { ...initialState, phase: 'configuring' };
      expect(gameReducer(state, start('legendary', buildSequence(EXPERT_LENGTH)))).toBe(state);
    });

    it('is ignored when the sequence length does not match the difficulty', () => {
      const state = { ...initialState, phase: 'configuring' };
      expect(gameReducer(state, start('expert', buildSequence(EXPERT_LENGTH - 1)))).toBe(state);
    });
  });

  describe('SHOW_NEXT', () => {
    const showingState = {
      ...initialState, phase: 'showing', sequence: ['A', 'B', 'C'], round: 1, showIndex: -1, inputIndex: 0,
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
      ...initialState, phase: 'awaitingInput', sequence: ['A', 'B', 'C'], round: 1, inputIndex: 0,
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

    it('wins when the last round is completed', () => {
      const lastRoundState = {
        ...initialState, phase: 'awaitingInput', sequence: ['A', 'B'], round: 1, inputIndex: 1,
      };
      const next = gameReducer(lastRoundState, pressKey('B'));
      expect(next.phase).toBe('won');
    });

    it('loses on a wrong letter and flashes it as fail (wrong letter ends the game)', () => {
      const next = gameReducer(awaitingState, pressKey('Z'));
      expect(next.phase).toBe('lost');
      expect(next.highlight).toEqual({ letter: 'Z', kind: 'fail' });
    });

    it('ignores non-letter payloads', () => {
      expect(gameReducer(awaitingState, pressKey(null))).toBe(awaitingState);
    });

    it('regression #2: is ignored once the game has been won', () => {
      const wonState = {
        ...initialState, phase: 'won', sequence: ['A'], round: 0, inputIndex: 1,
      };
      expect(gameReducer(wonState, pressKey('A'))).toBe(wonState);
    });

    it('regression #4: a repeated key press after the round already completed is ignored (no level skip)', () => {
      const state = {
        ...initialState, phase: 'awaitingInput', sequence: ['A', 'B', 'C'], round: 0, inputIndex: 0,
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
  });

  describe('NEXT_ROUND', () => {
    it('moves from roundComplete to showing with the round incremented', () => {
      const state = {
        ...initialState, phase: 'roundComplete', round: 0, showIndex: 2, inputIndex: 1,
      };
      const next = gameReducer(state, nextRound());
      expect(next).toMatchObject({
        phase: 'showing', round: 1, showIndex: -1, inputIndex: 0,
      });
    });

    it('is ignored outside roundComplete', () => {
      const state = { ...initialState, phase: 'showing' };
      expect(gameReducer(state, nextRound())).toBe(state);
    });
  });

  describe('RETRY', () => {
    it('restarts the same difficulty with a new sequence from round 0', () => {
      const state = {
        ...initialState, phase: 'lost', difficulty: 'expert', sequence: buildSequence(EXPERT_LENGTH), round: 3,
      };
      const newSequence = buildSequence(EXPERT_LENGTH).reverse();
      const next = gameReducer(state, retry(newSequence));
      expect(next).toMatchObject({
        phase: 'showing', difficulty: 'expert', sequence: newSequence, round: 0, showIndex: -1, inputIndex: 0,
      });
    });

    it('is ignored outside lost', () => {
      const state = { ...initialState, phase: 'won' };
      expect(gameReducer(state, retry(['A']))).toBe(state);
    });

    it('is ignored when the new sequence length does not match the difficulty', () => {
      const state = {
        ...initialState, phase: 'lost', difficulty: 'expert', sequence: buildSequence(EXPERT_LENGTH), round: 3,
      };
      expect(gameReducer(state, retry(buildSequence(EXPERT_LENGTH - 1)))).toBe(state);
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
