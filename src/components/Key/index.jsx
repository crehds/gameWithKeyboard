import PropTypes from 'prop-types';
import { KeyWrapper } from './styles';

function Key(props) {
  const { dataKey, letter } = props;
  return (
    <KeyWrapper className="key" data-key={dataKey}>
      {letter}
    </KeyWrapper>
  );
}

Key.propTypes = {
  dataKey: PropTypes.string.isRequired,
  letter: PropTypes.string.isRequired,
};

export default Key;
