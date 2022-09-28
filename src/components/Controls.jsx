import React, { useState } from 'react';

// Material UI Imports
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

// Store Imports
import { useGameStore } from '../store/GameStore';

// Create a React Function component that takes in input props and renders some dom content.
const Controls = (props) => {

  const reloadLevel = useGameStore((state) => state.reloadLevel);
  const reset   = useGameStore((state) => state.reset);

  return (
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <Button
        data-testid={`restart`}
        variant='contained'
        onClick={() => {
          reloadLevel();
        }}
      >
        Restart
      </Button>

      <Button
        data-testid="close-level"
        variant='contained'
        onClick={() => {
          reset();
        }}
      >
        Close
      </Button>
        
    </ButtonGroup>
  );
}

export default Controls;