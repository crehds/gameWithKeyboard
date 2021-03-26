import React from 'react';
import { OptionsWrapper } from './styles';
import { BiRefresh } from 'react-icons/bi';

export const Options = (props) => {
  return (
    <OptionsWrapper onClick={props.handleSetupGame}>
      <BiRefresh />
    </OptionsWrapper>
  );
};
