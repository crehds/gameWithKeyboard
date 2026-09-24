import styled from 'styled-components';

const DialogWrapper = styled.dialog`
  background: #111;
  color: white;
  border: 2px solid white;
  border-radius: 10px;
  padding: 24px;
  max-width: min(320px, calc(100vw - 32px));

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

  label {
    display: block;
    margin: 12px 0;
  }

  /* The reverse-order checkbox label: keep the box pinned to the first
     line and let the text wrap cleanly beside it. */
  label:has(input[type='checkbox']) {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  input[type='checkbox'] {
    flex-shrink: 0;
    margin-top: 3px;
  }

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
  }

  button {
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
