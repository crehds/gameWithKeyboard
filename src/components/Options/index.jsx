import PropTypes from 'prop-types';
import { BiRefresh } from 'react-icons/bi';
import { GiStarAltar, GiPlayButton } from 'react-icons/gi';

import OptionsWrapper from './styles';

function Options(props) {
  const { statusGame, handleSetupGame } = props;
  return (
    <OptionsWrapper statusGame={statusGame}>
      {statusGame ? (
        <BiRefresh className="refreshGame" onClick={handleSetupGame} />
      ) : (
        <div
          onClick={handleSetupGame}
          onKeyDown={handleSetupGame}
          role="button"
          tabIndex={0}
        >
          <GiPlayButton />
        </div>
      )}
      <GiStarAltar className="statusGame" />
      {statusGame ? 'Jugando' : 'Apagado'}
    </OptionsWrapper>
  );
}

Options.propTypes = {
  statusGame: PropTypes.bool.isRequired,
  handleSetupGame: PropTypes.func.isRequired,
};

export default Options;
