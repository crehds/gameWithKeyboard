import { arr1, arr2, arr3 } from './keyboard';
import Row from '../Row';
import KeyboardWrapper from './styles';

function KeyBoard() {
  return (
    <KeyboardWrapper>
      <Row arrKeys={arr1} />
      <Row arrKeys={arr2} />
      <Row arrKeys={arr3} />
    </KeyboardWrapper>
  );
}

export default KeyBoard;
