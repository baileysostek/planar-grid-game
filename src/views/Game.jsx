
import React, { useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';

import Board from '../components/Board';

import { useGameStore } from '../store/GameStore'
import { useThemeStore } from '../store/ThemeStore'
import Controls from '../components/Controls';

// Create a function to render our board.
const Game = (props) => {

  // Get everything out of our global stores that we may need
  const theme = useThemeStore((state) => state.theme);

  if(!props.level){
    return <div></div>
  }

  return (
    <ThemeProvider theme={theme}>
      <Board level={props.level}/>
      <Controls/>
    </ThemeProvider>
  );
}

export default Game;