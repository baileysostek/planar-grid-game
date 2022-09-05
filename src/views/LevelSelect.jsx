import React, { useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';

import { useGameStore } from '../store/GameStore'
import { useThemeStore } from '../store/ThemeStore'

import Board from '../components/Board';
import Controls from '../components/Controls';

import { Modal } from '@mui/material';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

// CSS
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  boxShadow: 24,
  p: 4,
  padding:'0px',
  borderRadius:'24px',
  backgroundColor:'#3A5A40'
};

// Create a function to render our board.
const LevelSelect = (props) => {

  // Define all of our levels
  // Maybe one day these will be loaded from a JSON file.
  const [levels] = useState([
    {
      name:"level 1",
      width:3,
      height:3,
      sources:[
        {x:0, y:0, color:'red'},
        {x:2, y:2, color:'red'},
      ],
      blockers:[{x:0, y:0}]
    },
    {
      name:"level 2",
      width:4,
      height:2,
      sources:[
        {x:0, y:1, color:'red'},
        {x:2, y:0, color:'red'},
        {x:3, y:0, color:'orange'},
        {x:2, y:1, color:'orange'},
      ],
      blockers:[{x:0, y:0}]
    },
    {
      name:"level 3",
      width:8,
      height:5,
      sources:[],
      blockers:[{x:0, y:0}]
    },
    {
      name:"level 4",
      width:8,
      height:5,
      sources:[],
      blockers:[{x:0, y:0}]
    },
  ]);     

  // This is the level currently loaded into our gloabl store.
  const loadedLevel = useGameStore((state) => state.loadedLevel);
  // This is a function to load a new level into our global state for the loaded level.
  const loadLevel   = useGameStore((state) => state.loadLevel);

  const reset   = useGameStore((state) => state.reset);

  // Get everything out of our global stores that we may need
  const theme = useThemeStore((state) => state.theme);

  const populate = useGameStore((state) => state.populate);
  const markCellAsSource = useGameStore((state) => state.markCellAsSource);

  const handleClose = () => {
    unloadLevel();
    console.log("unloadLevel");
  }

  const unloadLevel = () => {
    reset();
  }

  return (
    <ThemeProvider theme={theme}>
      {
        levels.map((level, index) => (
          <div key={index}
            onClick={() => {
              if(!loadedLevel){
                loadLevel(level);
              }
            }}
          >
            {JSON.stringify(level)}
          </div>
        ))
      }
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={!!loadedLevel}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={!!loadedLevel}>
            <Box sx={style}>
              {!!loadedLevel ? <div 
                style={{
                  borderRadius: '24px',
                  border:'8px solid',
                  padding: '24px',
                  color:'#000000',
                  overflow:'hidden',
                  width: 'auto',
                    width: 'auto',
                }}
              >
                {/* If there is a level loaded, lets display that board */}
                <Board level={loadedLevel}/>
                <Controls/>
              </div> : <></>}
            </Box>
          </Fade>
        </Modal>
      </div>
    </ThemeProvider>
  );
}

export default LevelSelect;