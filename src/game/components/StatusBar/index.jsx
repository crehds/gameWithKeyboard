import { BiRefresh } from 'react-icons/bi';
import { GiStarAltar, GiPlayButton } from 'react-icons/gi';
import PropTypes from 'prop-types';
import StatusBarWrapper from './styles';

function StatusBar({ playing, onOpenSetup }) {
  return (
    <StatusBarWrapper $playing={playing}>
      <button type="button" aria-label={playing ? 'refresh' : 'play'} onClick={onOpenSetup}>
        {playing ? <BiRefresh /> : <GiPlayButton />}
      </button>
      <GiStarAltar className="statusIcon" />
      {playing ? 'Jugando' : 'Apagado'}
    </StatusBarWrapper>
  );
}

StatusBar.propTypes = {
  playing: PropTypes.bool.isRequired,
  onOpenSetup: PropTypes.func.isRequired,
};

export default StatusBar;
