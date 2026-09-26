import { BiRefresh } from 'react-icons/bi';
import { GiStarAltar, GiPlayButton } from 'react-icons/gi';
import StatusBarWrapper from './styles';

export interface StatusBarProps {
  playing: boolean;
  onOpenSetup: () => void;
  score?: number;
}

function StatusBar({ playing, onOpenSetup, score = 0 }: StatusBarProps) {
  return (
    <StatusBarWrapper $playing={playing}>
      <button type="button" aria-label={playing ? 'refresh' : 'play'} onClick={onOpenSetup}>
        {playing ? <BiRefresh /> : <GiPlayButton />}
      </button>
      <GiStarAltar className="statusIcon" />
      {playing ? 'Jugando' : 'Apagado'}
      {playing && <span>{`Puntos: ${score}`}</span>}
    </StatusBarWrapper>
  );
}

export default StatusBar;
