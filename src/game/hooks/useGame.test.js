import { act, renderHook } from '@testing-library/react';
import useGame from './useGame';
import {
  ROUND_INTRO_DELAY,
  FLASH_INTERVAL,
  INPUT_READY_DELAY,
  SHOW_HIGHLIGHT_DURATION,
  ROUND_COMPLETE_DELAY,
} from '../domain/timing';

const fixedRandom = () => 0; // always produces 'A'

function advanceToAwaitingInput(round) {
  act(() => { vi.advanceTimersByTime(ROUND_INTRO_DELAY); });
  for (let i = 1; i <= round; i += 1) {
    act(() => { vi.advanceTimersByTime(FLASH_INTERVAL); });
  }
  act(() => { vi.advanceTimersByTime(INPUT_READY_DELAY); });
}

describe('useGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts in the configuring phase', () => {
    const { result } = renderHook(() => useGame(fixedRandom));
    expect(result.current.state.phase).toBe('configuring');
  });

  it('does nothing for an unknown difficulty', () => {
    const random = vi.fn(() => 0);
    const { result } = renderHook(() => useGame(random));

    act(() => result.current.start('legendary'));

    expect(result.current.state.phase).toBe('configuring');
    expect(random).not.toHaveBeenCalled();
  });

  it('starting a difficulty moves to showing with a freshly generated sequence', () => {
    const { result } = renderHook(() => useGame(fixedRandom));

    act(() => result.current.start('rookie'));

    expect(result.current.state.phase).toBe('showing');
    expect(result.current.state.sequence).toHaveLength(10);
    expect(result.current.state.sequence.every((letter) => letter === 'A')).toBe(true);
  });

  it('flashes the first letter after the round-intro delay', () => {
    const { result } = renderHook(() => useGame(fixedRandom));
    act(() => result.current.start('rookie'));

    act(() => { vi.advanceTimersByTime(ROUND_INTRO_DELAY); });

    expect(result.current.state.showIndex).toBe(0);
    expect(result.current.state.highlight).toEqual({ letter: 'A', kind: 'show' });
  });

  it('clears the show highlight after its duration', () => {
    const { result } = renderHook(() => useGame(fixedRandom));
    act(() => result.current.start('rookie'));
    act(() => { vi.advanceTimersByTime(ROUND_INTRO_DELAY); });

    act(() => { vi.advanceTimersByTime(SHOW_HIGHLIGHT_DURATION); });

    expect(result.current.state.highlight).toBeNull();
  });

  it('reaches awaitingInput after the last flash plus the input-ready delay', () => {
    const { result } = renderHook(() => useGame(fixedRandom));
    act(() => result.current.start('rookie'));

    advanceToAwaitingInput(0);

    expect(result.current.state.phase).toBe('awaitingInput');
  });

  it('accepts a correct key press and completes the round', () => {
    const { result } = renderHook(() => useGame(fixedRandom));
    act(() => result.current.start('rookie'));
    advanceToAwaitingInput(0);

    act(() => result.current.pressLetter('A'));

    expect(result.current.state.phase).toBe('roundComplete');
  });

  it('advances to the next round after the round-complete delay', () => {
    const { result } = renderHook(() => useGame(fixedRandom));
    act(() => result.current.start('rookie'));
    advanceToAwaitingInput(0);
    act(() => result.current.pressLetter('A'));

    act(() => { vi.advanceTimersByTime(ROUND_COMPLETE_DELAY); });

    expect(result.current.state.phase).toBe('showing');
    expect(result.current.state.round).toBe(1);
  });

  it('ignores non-letter presses', () => {
    const { result } = renderHook(() => useGame(fixedRandom));
    act(() => result.current.start('rookie'));
    advanceToAwaitingInput(0);

    act(() => result.current.pressLetter(null));

    expect(result.current.state.phase).toBe('awaitingInput');
    expect(result.current.state.inputIndex).toBe(0);
  });

  it('regression #4: a second press after the round already completed does not skip a level', () => {
    const { result } = renderHook(() => useGame(fixedRandom));
    act(() => result.current.start('rookie'));
    advanceToAwaitingInput(0);
    act(() => result.current.pressLetter('A'));

    expect(result.current.state.phase).toBe('roundComplete');
    const stateAfterFirstPress = result.current.state;

    act(() => result.current.pressLetter('A'));

    expect(result.current.state).toBe(stateAfterFirstPress);
  });

  it('regression #3: clears every pending timer on unmount', () => {
    const { result, unmount } = renderHook(() => useGame(fixedRandom));
    act(() => result.current.start('rookie'));
    act(() => { vi.advanceTimersByTime(ROUND_INTRO_DELAY); });

    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('regression #3: opening setup mid-sequence cancels the pending flash timer', () => {
    const { result } = renderHook(() => useGame(fixedRandom));
    act(() => result.current.start('rookie'));

    act(() => { vi.advanceTimersByTime(ROUND_INTRO_DELAY); }); // showIndex -> 0

    act(() => result.current.openSetup());
    expect(result.current.state.phase).toBe('configuring');

    act(() => { vi.advanceTimersByTime(FLASH_INTERVAL * 5); });

    expect(result.current.state.phase).toBe('configuring');
    expect(result.current.state.showIndex).toBe(0);
  });
});
