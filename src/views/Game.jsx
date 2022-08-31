
import React, { useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';

import Board from '../components/Board';

import { useGameStore } from '../store/GameStore'
import { useThemeStore } from '../store/ThemeStore'

// Create a function to render our board.
const Game = (props) => {

  // Define our state variables
  const [change, setChange] = useState(true);     

  const bears = useGameStore((state) => state.bears)

  // Get everything out of our global stores that we may need
  const theme = useThemeStore((state) => state.theme);

  return (
    <ThemeProvider theme={theme}>
      <Board/>
    </ThemeProvider>
  );
}

export default Game;