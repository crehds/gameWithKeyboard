import PropTypes from 'prop-types';
import { KeyWrapper } from './styles';

function Key({ letter, status }) {
  return (
    <KeyWrapper $status={status} data-status={status}>
      {letter}
    </KeyWrapper>
  );
}

Key.propTypes = {
  letter: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['idle', 'active', 'success', 'fail']),
};

Key.defaultProps = {
  status: 'idle',
};

export default Key;
