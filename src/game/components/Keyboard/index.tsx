import Row from '../Row';
import LAYOUT from './layout';
import KeyboardWrapper from './styles';
import type { Letter } from '../../domain/letters';
import type { KeyStatus } from '../../domain/gameMachine';

export interface KeyboardProps {
  getStatus: (letter: Letter) => KeyStatus;
  onPress: (letter: Letter) => void;
}

function Keyboard({ getStatus, onPress }: KeyboardProps) {
  return (
    <KeyboardWrapper>
      {LAYOUT.map((row) => (
        <Row key={row.join('')} letters={row} getStatus={getStatus} onPress={onPress} />
      ))}
    </KeyboardWrapper>
  );
}

export default Keyboard;
