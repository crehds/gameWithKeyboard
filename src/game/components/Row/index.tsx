import Key from '../Key';
import RowWrapper from './styles';
import type { Letter } from '../../domain/letters';
import type { KeyStatus } from '../../domain/gameMachine';

export interface RowProps {
  letters: readonly Letter[];
  getStatus: (letter: Letter) => KeyStatus;
  onPress: (letter: Letter) => void;
}

function Row({ letters, getStatus, onPress }: RowProps) {
  return (
    <RowWrapper>
      {letters.map((letter) => (
        <Key key={letter} letter={letter} status={getStatus(letter)} onPress={onPress} />
      ))}
    </RowWrapper>
  );
}

export default Row;
