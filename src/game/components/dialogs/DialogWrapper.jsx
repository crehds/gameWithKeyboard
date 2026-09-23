import styled from 'styled-components';

const DialogWrapper = styled.dialog`
  background: #111;
  color: white;
  border: 2px solid white;
  border-radius: 10px;
  padding: 24px;
  max-width: 320px;

  &::backdrop {
    background: rgba(0, 0, 0, 0.6);
  }

  h2 {
    margin-bottom: 12px;
  }

  p {
    margin-bottom: 12px;
  }

  select {
    display: block;
    margin: 12px 0;
  }

  button {
    margin-right: 8px;
    padding: 6px 14px;
    border: 1px solid white;
    border-radius: 6px;
    background: transparent;
    color: white;
    cursor: pointer;

    &:hover {
      background: white;
      color: black;
    }
  }
`;

export default DialogWrapper;
