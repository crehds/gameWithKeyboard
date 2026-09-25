import styled from 'styled-components';

const RowWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--gap, 6px);
  margin-bottom: var(--gap, 6px);

  &:last-of-type {
    margin-bottom: 0;
    /* Roughly one key width, replicating the old -110px physical-keyboard
       stagger, but scaled with the current key size. */
    margin-left: calc(-1 * (var(--key, 108px) + var(--gap, 6px)));
  }
`;

export default RowWrapper;
