import PropTypes from 'prop-types';
import BannerWrapper from './styles';

function RoundBanner({ round, total }) {
  const text = Number.isFinite(total) ? `Nivel ${round + 1} de ${total}` : `Nivel ${round + 1}`;
  return (
    <BannerWrapper role="status">
      {text}
    </BannerWrapper>
  );
}

RoundBanner.propTypes = {
  round: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default RoundBanner;
