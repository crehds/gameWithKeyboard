import BannerWrapper from './styles';

export interface RoundBannerProps {
  round: number;
  total: number;
  reversed?: boolean;
}

function RoundBanner({ round, total, reversed = false }: RoundBannerProps) {
  const text = Number.isFinite(total) ? `Nivel ${round + 1} de ${total}` : `Nivel ${round + 1}`;
  return (
    <BannerWrapper role="status">
      {text}
      {reversed && ' ¡Al revés!'}
    </BannerWrapper>
  );
}

export default RoundBanner;
