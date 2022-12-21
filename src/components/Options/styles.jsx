import styled, { css, keyframes } from 'styled-components';

const Wave = keyframes`
  50%,
  75% {
    transform: scale(1.5);
  }

  80%,
  100% {
    opacity: 0;
  }
`;

const OptionsWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  left: 5px;
  top: 10px;
  & svg {
    font-size: 30px;
    color: gray;
    &.statusGame {
      ${({ statusGame }) => css`
          color: ${statusGame ? 'green' : 'red'};
        `}
    }
    &.refreshGame {
      cursor: pointer;
      &:hover {
        fill: white;
      }
    }
  }

  & div {
    position: relative;
    border-radius: 50%;
    cursor: pointer;
    font-size: 30px;
    display: flex;
    align-items: center;
    margin: 0 5px;
    &::before {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      background: rgba(238, 211, 214, 0.89);
      border-radius: inherit;
      animation: ${Wave} 2s ease-out infinite;
      animation-delay: 0.2s;
    }
    &:hover > svg {
      fill: white;
    }
  }
`;

export default OptionsWrapper;
