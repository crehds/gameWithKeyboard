import reducer from './reducer';
import initialSetup from './initialSetup';

describe('reducer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('init', () => {
    it('replaces the state with the action payload', () => {
      const state = {
        isPlaying: false, levels: null, boardKeys: null, currentLevel: null,
      };
      const payload = {
        isPlaying: true, levels: 5, boardKeys: [65, 66], currentLevel: 0,
      };

      const result = reducer(state, { type: 'init', payload });

      expect(result).toEqual(payload);
    });

    it('does not mutate the input state', () => {
      const state = {
        isPlaying: false, levels: null, boardKeys: null, currentLevel: null,
      };
      const stateCopy = { ...state };
      const payload = {
        isPlaying: true, levels: 5, boardKeys: [65], currentLevel: 0,
      };

      reducer(state, { type: 'init', payload });

      expect(state).toEqual(stateCopy);
    });
  });

  describe('next', () => {
    it('increments currentLevel while keeping the rest of the state', () => {
      const state = {
        isPlaying: true, levels: 5, boardKeys: [65, 66, 67], currentLevel: 1,
      };

      const result = reducer(state, { type: 'next' });

      expect(result).toEqual({ ...state, currentLevel: 2 });
    });

    it('does not mutate the input state', () => {
      const state = {
        isPlaying: true, levels: 5, boardKeys: [65, 66, 67], currentLevel: 1,
      };
      const stateCopy = { ...state };

      reducer(state, { type: 'next' });

      expect(state).toEqual(stateCopy);
    });
  });

  describe('reset', () => {
    it('regenerates boardKeys with the same length as levels and resets currentLevel to 0', () => {
      const state = {
        isPlaying: true, levels: 4, boardKeys: [65, 66, 67, 68], currentLevel: 3,
      };

      const result = reducer(state, { type: 'reset' });

      expect(result.currentLevel).toBe(0);
      expect(result.boardKeys).toHaveLength(4);
      expect(result.isPlaying).toBe(true);
    });

    it('does not mutate the input state', () => {
      const state = {
        isPlaying: true, levels: 4, boardKeys: [65, 66, 67, 68], currentLevel: 3,
      };
      const stateCopy = { ...state, boardKeys: [...state.boardKeys] };

      reducer(state, { type: 'reset' });

      expect(state).toEqual(stateCopy);
    });
  });

  describe('lose', () => {
    it('returns the game back to its initial state', () => {
      const state = {
        isPlaying: true, levels: 4, boardKeys: [65, 66, 67, 68], currentLevel: 3,
      };

      const result = reducer(state, { type: 'lose' });

      expect(result).toEqual(initialSetup);
    });

    it('does not mutate the input state', () => {
      const state = {
        isPlaying: true, levels: 4, boardKeys: [65, 66, 67, 68], currentLevel: 3,
      };
      const stateCopy = { ...state, boardKeys: [...state.boardKeys] };

      reducer(state, { type: 'lose' });

      expect(state).toEqual(stateCopy);
    });
  });

  describe('unknown action', () => {
    it('returns a copy of the state unchanged (passthrough)', () => {
      const state = {
        isPlaying: true, levels: 4, boardKeys: [65, 66, 67, 68], currentLevel: 3,
      };

      const result = reducer(state, { type: 'not-a-real-action' });

      expect(result).toEqual(state);
      expect(result).not.toBe(state);
    });

    it('does not mutate the input state', () => {
      const state = {
        isPlaying: true, levels: 4, boardKeys: [65, 66, 67, 68], currentLevel: 3,
      };
      const stateCopy = { ...state, boardKeys: [...state.boardKeys] };

      reducer(state, { type: 'not-a-real-action' });

      expect(state).toEqual(stateCopy);
    });
  });
});
