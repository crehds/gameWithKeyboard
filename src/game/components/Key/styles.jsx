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

export const KeyWrapper = styled.div`
  animation: ${Appear} 2.5s;
  min-width: 108px;
  padding: 36px 10px;
  border: 4px solid white;
  border-radius: 10px;
  margin: 0 11px;
  text-transform: uppercase;
  text-align: center;
  font-size: 24px;
  transition: all ease 0.1s;
  ${({ $status }) => STATUS_STYLES[$status] || ''}
`;
