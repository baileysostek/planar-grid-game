import React, { useState } from 'react';

// Material UI Imports
import Button from '@mui/material/Button';

// Store Imports
import { useGameStore } from '../store/Model';

// Create a React Function component that takes in input props and renders some dom content.
const Controls = (props) => {

  const reloadLevel = useGameStore((state) => state.reloadLevel);

  return (
    <div>
      <Button
        variant='outlined'
        onClick={() => {
          reloadLevel();
        }}
      >
        Restart
      </Button>
    </div>
  );
}

export default Controls;