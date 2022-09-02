
import React, { useRef, useEffect, useState } from 'react';

import { useGameStore } from '../store/GameStore'

import Box from '@mui/material/Box';

import Cell from './Cell';

// Create a React Function component that takes in input props and renders some dom content.
const Board = (props) => { 

  // Get everything out of our global stores that we may need
  const setDragging = useGameStore((state) => state.setDragging);

  const width       = useGameStore((state) => state.width);
  const height      = useGameStore((state) => state.height);

  // markCellAsSource(0, 0, "#FF0000"); 

  return (
    // This is the Parent DIV which represents a Board, it contains rows of cells
    <div
      style={{
        borderRadius: '24px',
        // backgroundColor: '#FF0000'
        border:'8px solid',
        padding: '24px',
        color:'#000000'
      }}
      onMouseLeave={(event) => { 
        setDragging(false);
      }}
    >
      {[...Array(height)].map((item, index_row) => (
        <Box
          key={index_row}
          sx={{
            display: 'flex',
            '& > :not(style)': {
              m: 1,
            },
          }}
        >
          {[...Array(width)].map((item, index_col) => (
            <Cell key={index_col} x={index_col} y={index_row}/>
          ))}
        </Box>
      ))}
    </div>
  );
}

export default Board;