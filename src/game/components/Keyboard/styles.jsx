import styled from 'styled-components';

const KeyboardWrapper = styled.div`
  /* Key size bounded by both viewport width (10 keys is the widest row) and
     the height left after the header, so the whole keyboard always fits. */
  --gap: 6px;
  --key: min(
    108px,
    calc((100vw - 2 * var(--gutter, 8px) - 9 * var(--gap)) / 10),
    calc((100dvh - var(--header, 64px) - 4 * var(--gap)) / 3.3)
  );
  /* Keys stay square-ish on wide screens; on narrow portrait phones they
     grow taller than wide to enlarge the touch target. */
  --key-aspect: 1.04;

  @media (max-width: 480px) and (orientation: portrait) {
    --key-aspect: 1.45;
  }

  display: flex;
  height: 100vh;
  height: 100dvh;
  justify-content: center;
  flex-direction: column;
  padding-top: var(--header, 64px);
`;

export default KeyboardWrapper;
