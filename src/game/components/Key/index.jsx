import PropTypes from 'prop-types';
import { KeyWrapper } from './styles';

function Key({ letter, status, onPress }) {
  return (
    <KeyWrapper
      type="button"
      $status={status}
      data-status={status}
      onClick={() => onPress(letter)}
    >
      {letter}
    </KeyWrapper>
  );
}

Key.propTypes = {
  letter: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['idle', 'active', 'success', 'fail']),
  onPress: PropTypes.func.isRequired,
};

Key.defaultProps = {
  status: 'idle',
};

export default Key;
