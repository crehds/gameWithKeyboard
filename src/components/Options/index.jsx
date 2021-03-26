import React from 'react';
import { OptionsWrapper } from './styles';
import { BiRefresh } from 'react-icons/bi';
import { GiStarAltar } from 'react-icons/gi';
import { GiPlayButton } from 'react-icons/gi';

export const Options = (props) => {
  return (
    <OptionsWrapper
      onClick={props.handleSetupGame}
      statusGame={props.statusGame}
    >
      {props.statusGame ? (
        <BiRefresh />
      ) : (
        <div>
          <GiPlayButton />
        </div>
      )}
      <GiStarAltar className='statusGame' />
      {props.statusGame ? 'Jugando' : 'Apagado'}
    </OptionsWrapper>
  );
};
