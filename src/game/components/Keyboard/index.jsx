import PropTypes from 'prop-types';
import Row from '../Row';
import LAYOUT from './layout';
import KeyboardWrapper from './styles';

function Keyboard({ getStatus }) {
  return (
    <KeyboardWrapper>
      {LAYOUT.map((row) => (
        <Row key={row.join('')} letters={row} getStatus={getStatus} />
      ))}
    </KeyboardWrapper>
  );
}

Keyboard.propTypes = {
  getStatus: PropTypes.func.isRequired,
};

export default Keyboard;
