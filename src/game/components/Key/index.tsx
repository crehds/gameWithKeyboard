import { KeyWrapper } from './styles';
import type { Letter } from '../../domain/letters';
import type { KeyStatus } from '../../domain/gameMachine';

export interface KeyProps {
  letter: Letter;
  status?: KeyStatus;
  onPress: (letter: Letter) => void;
}

function Key({ letter, status = 'idle', onPress }: KeyProps) {
  return (
    <KeyWrapper
      type="button"
      $status={status}
      data-status={status}
      // A pointer press must not focus the key: a focused button would turn a
      // later Enter or Space into a click that replays this letter.
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onPress(letter)}
    >
      {letter}
    </KeyWrapper>
  );
}

export default Key;
