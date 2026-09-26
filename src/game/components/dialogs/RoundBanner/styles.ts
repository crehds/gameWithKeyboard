import styled from 'styled-components';

const BannerWrapper = styled.div`
  /* Sits below the reserved header, so it never overlaps the status bar. */
  position: fixed;
  top: var(--header, 64px);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100vw - 2 * var(--gutter, 8px));
  color: white;
  font-size: clamp(14px, 4vw, 20px);
  text-align: center;
`;

export default BannerWrapper;
