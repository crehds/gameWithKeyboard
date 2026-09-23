import PropTypes from 'prop-types';
import Key from '../Key';
import RowWrapper from './styles';

function Row({ letters, getStatus }) {
  return (
    <RowWrapper>
      {letters.map((letter) => (
        <Key key={letter} letter={letter} status={getStatus(letter)} />
      ))}
    </RowWrapper>
  );
}

Row.propTypes = {
  letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  getStatus: PropTypes.func.isRequired,
};

export default Row;
