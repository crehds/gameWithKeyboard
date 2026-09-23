import PropTypes from 'prop-types';
import BannerWrapper from './styles';

function RoundBanner({ round, total }) {
  return (
    <BannerWrapper role="status">
      {`Nivel ${round + 1} de ${total}`}
    </BannerWrapper>
  );
}

RoundBanner.propTypes = {
  round: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default RoundBanner;
