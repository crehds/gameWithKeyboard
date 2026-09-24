import PropTypes from 'prop-types';
import Key from '../Key';
import RowWrapper from './styles';

function Row({ letters, getStatus, onPress }) {
  return (
    <RowWrapper>
      {letters.map((letter) => (
        <Key key={letter} letter={letter} status={getStatus(letter)} onPress={onPress} />
      ))}
    </RowWrapper>
  );
}

Row.propTypes = {
  letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  getStatus: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default Row;
