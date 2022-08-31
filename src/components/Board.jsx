
import React, { useRef, useEffect, useState } from 'react';

import { useGameStore } from '../store/GameStore'

import Box from '@mui/material/Box';

import Cell from './Cell';

const width = 8;
const height = 5;

// Create a React Function component that takes in input props and renders some dom content.
const Board = (props) => {

  // Define our state variables
  const [change, setChange] = useState(true);     

  // Get everything out of our global stores that we may need
  const increasePopulation = useGameStore((state) => state.increasePopulation);

  function renderCanvas(){

  }

  return (
    <div>
      {[...Array(height)].map((item, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            '& > :not(style)': {
              m: 1,
            },
          }}
        >
          {[...Array(width)].map((item, index) => (
            <Cell key={index} />
          ))}
        </Box>
      ))}
    </div>
  );
}

export default Board;