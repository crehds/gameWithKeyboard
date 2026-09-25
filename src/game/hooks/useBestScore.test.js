import React from 'react';
import { renderHook } from '@testing-library/react';
import useBestScore from './useBestScore';

const KEY_PREFIX = 'gameWithKeyboard.bestScore.';

function makeMemoryStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
  };
}

describe('useBestScore', () => {
  it('loads the stored best for the mode', () => {
    const storage = makeMemoryStorage({ [`${KEY_PREFIX}rookie`]: '42' });
    const { result } = renderHook(() => useBestScore('rookie', 0, false, storage));

    expect(result.current.best).toBe(42);
    expect(result.current.isNewRecord).toBe(false);
  });

  it('defaults to 0 when nothing is stored', () => {
    const storage = makeMemoryStorage();
    const { result } = renderHook(() => useBestScore('rookie', 0, false, storage));

    expect(result.current.best).toBe(0);
  });

  it('saves a new record and flags it when the game finishes above the best', () => {
    const storage = makeMemoryStorage({ [`${KEY_PREFIX}rookie`]: '10' });
    const { result, rerender } = renderHook(
      ({ score, finished }) => useBestScore('rookie', score, finished, storage),
      { initialProps: { score: 0, finished: false } },
    );

    rerender({ score: 25, finished: true });

    expect(result.current.best).toBe(25);
    expect(result.current.isNewRecord).toBe(true);
    expect(storage.getItem(`${KEY_PREFIX}rookie`)).toBe('25');
  });

  it('does not flag a new record when the score does not beat the best', () => {
    const storage = makeMemoryStorage({ [`${KEY_PREFIX}rookie`]: '100' });
    const { result, rerender } = renderHook(
      ({ score, finished }) => useBestScore('rookie', score, finished, storage),
      { initialProps: { score: 0, finished: false } },
    );

    rerender({ score: 30, finished: true });

    expect(result.current.best).toBe(100);
    expect(result.current.isNewRecord).toBe(false);
    expect(storage.getItem(`${KEY_PREFIX}rookie`)).toBe('100');
  });

  it('resets isNewRecord when a new game starts', () => {
    const storage = makeMemoryStorage();
    const { result, rerender } = renderHook(
      ({ score, finished }) => useBestScore('rookie', score, finished, storage),
      { initialProps: { score: 0, finished: false } },
    );

    rerender({ score: 40, finished: true });
    expect(result.current.isNewRecord).toBe(true);

    rerender({ score: 0, finished: false });
    expect(result.current.isNewRecord).toBe(false);
  });

  it('reloads the best when the mode changes', () => {
    const storage = makeMemoryStorage({
      [`${KEY_PREFIX}rookie`]: '10',
      [`${KEY_PREFIX}expert`]: '999',
    });
    const { result, rerender } = renderHook(
      ({ modeId }) => useBestScore(modeId, 0, false, storage),
      { initialProps: { modeId: 'rookie' } },
    );

    expect(result.current.best).toBe(10);

    rerender({ modeId: 'expert' });

    expect(result.current.best).toBe(999);
  });

  it('saves at most once per finished game, even under StrictMode double-invocation', () => {
    const storage = makeMemoryStorage();
    const setItemSpy = vi.spyOn(storage, 'setItem');

    renderHook(() => useBestScore('rookie', 50, true, storage), {
      wrapper: React.StrictMode,
    });

    expect(setItemSpy).toHaveBeenCalledTimes(1);
  });
});

describe('useBestScore - GameScreen-like transition', () => {
  it('reflects a new record after modeId changes then the game finishes', () => {
    const storage = makeMemoryStorage();
    const { result, rerender } = renderHook(
      ({ modeId, score, finished }) => useBestScore(modeId, score, finished, storage),
      { initialProps: { modeId: 'normal', score: 0, finished: false } },
    );

    rerender({ modeId: 'expert', score: 0, finished: false });
    rerender({ modeId: 'expert', score: 70, finished: false });
    rerender({ modeId: 'expert', score: 70, finished: true });

    expect(result.current.best).toBe(70);
  });
});
