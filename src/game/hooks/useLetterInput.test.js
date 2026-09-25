import { renderHook } from '@testing-library/react';
import useLetterInput from './useLetterInput';

function dispatchKeyDown(overrides = {}) {
  const event = new KeyboardEvent('keydown', { key: 'a', bubbles: true, ...overrides });
  window.dispatchEvent(event);
}

describe('useLetterInput', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls onLetter with the uppercase letter for a plain key press', () => {
    const onLetter = vi.fn();
    renderHook(() => useLetterInput(onLetter));

    dispatchKeyDown({ key: 'a' });

    expect(onLetter).toHaveBeenCalledWith('A');
  });

  it('ignores non-letter keys', () => {
    const onLetter = vi.fn();
    renderHook(() => useLetterInput(onLetter));

    dispatchKeyDown({ key: 'Enter' });
    dispatchKeyDown({ key: '1' });

    expect(onLetter).not.toHaveBeenCalled();
  });

  it('ignores repeated key events', () => {
    const onLetter = vi.fn();
    renderHook(() => useLetterInput(onLetter));

    dispatchKeyDown({ key: 'a', repeat: true });

    expect(onLetter).not.toHaveBeenCalled();
  });

  it('ignores ctrl/alt/meta combinations', () => {
    const onLetter = vi.fn();
    renderHook(() => useLetterInput(onLetter));

    dispatchKeyDown({ key: 'a', ctrlKey: true });
    dispatchKeyDown({ key: 'a', altKey: true });
    dispatchKeyDown({ key: 'a', metaKey: true });

    expect(onLetter).not.toHaveBeenCalled();
  });

  it('always calls the latest onLetter callback without re-subscribing', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ onLetter }) => useLetterInput(onLetter), {
      initialProps: { onLetter: first },
    });

    const initialSubscriptions = addSpy.mock.calls.filter(([type]) => type === 'keydown');
    expect(initialSubscriptions).toHaveLength(1);

    rerender({ onLetter: second });
    dispatchKeyDown({ key: 'a' });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('A');
    expect(addSpy.mock.calls.filter(([type]) => type === 'keydown')).toHaveLength(1);
  });

  it('regression #2: removes its listener on unmount', () => {
    const onLetter = vi.fn();
    const { unmount } = renderHook(() => useLetterInput(onLetter));

    unmount();
    dispatchKeyDown({ key: 'a' });

    expect(onLetter).not.toHaveBeenCalled();
  });
});
