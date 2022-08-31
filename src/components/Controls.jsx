import React, { useState } from 'react';

// Material UI Imports
import Button from '@mui/material/Button';

// Store Imports
import { useGameStore } from '../store/GameStore';

// Create a React Function component that takes in input props and renders some dom content.
const Controls = (props) => {

  const reset = useGameStore((state) => state.reset);

  return (
		<Button
      variant='outlined'
      onClick={() => {
        reset();
      }}
    >
      Restart
    </Button>
  );
}

export default Controls;