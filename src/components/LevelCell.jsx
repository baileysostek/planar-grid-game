
import React, { useRef, useEffect, useState } from 'react';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

// Global Store
import { useGameStore } from '../store/Model';

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

// Create a React Function component that takes in input props and renders some dom content.
const LevelCell = (props) => { 

  // Check what levels are complete
  const complete    = useGameStore((state) => state.complete);

  let level = props?.level;
  if(!!!level){
    level = {}; // If we dont pass a level, make an empty object for the default level.
  }

  return (
    // This is the Parent DIV which represents a Board, it contains rows of cells
    <Box 
      sx={{
        height: `${128}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        border:'8px solid black',
        cursor: 'pointer'
      }}
     >
      <Typography align='center' alignContent={'center'} variant='h3'>
        {level.name}
      </Typography> 
      {complete.has(level?.name) ? <FontAwesomeIcon icon={faStar} /> : <></>}
    </Box>
  );
}

export default LevelCell;