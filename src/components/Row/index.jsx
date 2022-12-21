import PropTypes from 'prop-types';
import Key from '../Key';
import RowWrapper from './styles';

function Row({ arrKeys = [] }) {
  return (
    <RowWrapper>
      {arrKeys.map((e) => (
        <Key key={e.dataKey} letter={e.letter} dataKey={e.dataKey} />
      ))}
    </RowWrapper>
  );
}

Row.propTypes = {
  arrKeys: PropTypes.instanceOf(Array).isRequired,
};

export default Row;
