import styled, { css } from 'styled-components';

export const OptionsWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  left: 5px;
  top: 10px;
  & svg {
    font-size: 30px;
    color: gray;
    &.statusGame {
      ${({ statusGame }) =>
        css`
          color: ${statusGame ? 'green' : 'red'};
        `}
    }
    &:nth-of-type(1):hover {
      fill: white;
      cursor: pointer;
    }
  }
`;
