import { BiRefresh } from 'react-icons/bi';
import { GiStarAltar, GiPlayButton } from 'react-icons/gi';
import { useSetupGame } from '../../context/setupGame';

import OptionsWrapper from './styles';

function Options() {
  const { setup, handleConfig } = useSetupGame();
  const { isPlaying } = setup;

  return (
    <OptionsWrapper statusGame={isPlaying}>
      {isPlaying ? (
        <BiRefresh className="refreshGame" onClick={handleConfig} />
      ) : (
        <div>
          <GiPlayButton className="playingGame" onClick={handleConfig} />
        </div>
      )}
      <GiStarAltar className="statusGame" />
      {isPlaying ? 'Jugando' : 'Apagado'}
    </OptionsWrapper>
  );
}

export default Options;
