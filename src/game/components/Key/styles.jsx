import styled, { keyframes, css } from 'styled-components';

export const Appear = keyframes`
  0% {
    color: black;
    border-color: black;
  }
  100% {
    color: white;
    border-color: white;
  }
`;

const STATUS_STYLES = {
  active: css`
    background-color: white;
    color: black;
  `,
  success: css`
    background-color: #2ecc71;
    color: white;
    border-color: #2ecc71;
  `,
  fail: css`
    background-color: #e74c3c;
    color: white;
    border-color: #e74c3c;
  `,
};

export const KeyWrapper = styled.button`
  animation: ${Appear} 2.5s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  font: inherit;
  touch-action: manipulation;
  /* Safari only supports the prefixed form, and styled-components 6 no
     longer adds vendor prefixes on its own. */
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  width: var(--key, 108px);
  height: calc(var(--key, 108px) * var(--key-aspect, 1));
  border: clamp(2px, calc(var(--key, 108px) * 0.037), 4px) solid white;
  border-radius: clamp(6px, calc(var(--key, 108px) * 0.093), 10px);
  text-transform: uppercase;
  font-size: clamp(14px, calc(var(--key, 108px) * 0.222), 24px);
  transition: all ease 0.1s;
  ${({ $status }) => STATUS_STYLES[$status] || ''}
`;
