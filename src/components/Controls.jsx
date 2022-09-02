import React, { useState } from 'react';

// Material UI Imports
import Button from '@mui/material/Button';

// Store Imports
import { useGameStore } from '../store/GameStore';
import { useColorStore } from '../store/ColorStore';

// Create a React Function component that takes in input props and renders some dom content.
const Controls = (props) => {

  const reset = useGameStore((state) => state.reset);
  const populate = useGameStore((state) => state.populate);
  const markCellAsSource = useGameStore((state) => state.markCellAsSource);

  const red     = useColorStore((state) => state.red);
  const orange  = useColorStore((state) => state.orange);
  const yellow  = useColorStore((state) => state.yellow);
  const green   = useColorStore((state) => state.green);
  const blue    = useColorStore((state) => state.blue);

  let all_colors = [red, orange, yellow, green, blue];

  return (
    <div>
      <Button
        variant='outlined'
        onClick={() => {
          reset();
        }}
      >
        Restart
      </Button>

      <Button
        variant='outlined'
        onClick={() => {
          for(let i = 0; i < Math.floor(Math.random() * 8) + 1; i++){
            let x = Math.floor(Math.random() * 8);
            let y = Math.floor(Math.random() * 5)

            let color =  all_colors[Math.floor(Math.random() * all_colors.length)];

            populate(x, y, all_colors[Math.floor(Math.random() * all_colors.length)], 0);
            markCellAsSource(x, y);
          }
        }}
      >
        Populate
      </Button>
    </div>
  );
}

export default Controls;