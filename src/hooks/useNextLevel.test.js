import { renderHook } from '@testing-library/react';
import useNextLevel from './useNextLevel';

const {
  successMock, failMock, warningMock, showLevelMock, sweetAlertFactoryMock,
} = vi.hoisted(() => {
  const success = vi.fn();
  const fail = vi.fn();
  const warning = vi.fn();
  const showLevel = vi.fn();
  const factory = vi.fn(() => ({
    success, fail, warning, showLevel,
  }));
  return {
    successMock: success,
    failMock: fail,
    warningMock: warning,
    showLevelMock: showLevel,
    sweetAlertFactoryMock: factory,
  };
});

vi.mock('../utils/sweetAlert', () => ({
  default: sweetAlertFactoryMock,
}));

function pressKey(onKeyDown, keyCode) {
  onKeyDown({ keyCode });
}

describe('useNextLevel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = `
      <div data-key="65"></div>
      <div data-key="66"></div>
      <div data-key="67"></div>
    `;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    successMock.mockClear();
    failMock.mockClear();
    warningMock.mockClear();
    showLevelMock.mockClear();
  });

  it('dispatches next after the correct full prefix for the current round is pressed', () => {
    const updateSetup = vi.fn();
    const setup = { boardKeys: [65, 66], currentLevel: 1, levels: 3 };
    const { result } = renderHook(() => useNextLevel(setup, updateSetup));
    const [, onKeyDown] = result.current;

    pressKey(onKeyDown, 65);
    pressKey(onKeyDown, 66);

    expect(updateSetup).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);

    expect(updateSetup).toHaveBeenCalledWith({ type: 'next' });
  });

  it('calls sweetAlert.fail when a wrong letter key is pressed, and dispatches reset when the modal is confirmed', () => {
    const updateSetup = vi.fn();
    const setup = { boardKeys: [65, 66], currentLevel: 1, levels: 3 };
    const { result } = renderHook(() => useNextLevel(setup, updateSetup));
    const [, onKeyDown] = result.current;

    pressKey(onKeyDown, 67); // boardKeys[0] is 65, this is wrong

    vi.advanceTimersByTime(400);
    expect(failMock).toHaveBeenCalledTimes(1);

    const { confirm } = failMock.mock.calls[0][0];
    confirm();

    expect(updateSetup).toHaveBeenCalledWith({ type: 'reset' });
  });

  it('dispatches lose when the fail modal is cancelled', () => {
    const updateSetup = vi.fn();
    const setup = { boardKeys: [65, 66], currentLevel: 1, levels: 3 };
    const { result } = renderHook(() => useNextLevel(setup, updateSetup));
    const [, onKeyDown] = result.current;

    pressKey(onKeyDown, 67);

    vi.advanceTimersByTime(400);
    const { cancel } = failMock.mock.calls[0][0];
    cancel();

    expect(updateSetup).toHaveBeenCalledWith({ type: 'lose' });
  });

  it('calls sweetAlert.success when the last key of the whole game is pressed', () => {
    const updateSetup = vi.fn();
    const setup = { boardKeys: [65, 66, 67], currentLevel: 2, levels: 3 };
    const { result } = renderHook(() => useNextLevel(setup, updateSetup));
    const [, onKeyDown] = result.current;

    pressKey(onKeyDown, 65);
    pressKey(onKeyDown, 66);
    pressKey(onKeyDown, 67);

    vi.advanceTimersByTime(400);

    expect(successMock).toHaveBeenCalledTimes(1);
  });

  // Bug #1 (fixed in production code as part of this task): a non-letter key
  // must be ignored — it must neither lose the game nor advance the sequence.
  it('ignores a non-letter key (e.g. Shift) without losing, then still advances to next on the real key', () => {
    const updateSetup = vi.fn();
    const setup = { boardKeys: [65, 66], currentLevel: 1, levels: 3 };
    const { result } = renderHook(() => useNextLevel(setup, updateSetup));
    const [, onKeyDown] = result.current;

    pressKey(onKeyDown, 65);
    pressKey(onKeyDown, 16); // Shift
    pressKey(onKeyDown, 66);

    vi.advanceTimersByTime(1000);

    expect(updateSetup).toHaveBeenCalledWith({ type: 'next' });
    expect(failMock).not.toHaveBeenCalled();
  });

  it.todo('removes the window keydown listener when the player wins, instead of leaving it attached (known bug #2, fixed in step 3)');
  it.todo('does not dispatch next twice when the last key of a round is pressed twice within the 1s delay (known bug #4, fixed in step 3)');
});
