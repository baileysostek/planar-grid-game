import React, { useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';

import { useGameStore } from '../store/GameStore'
import { useThemeStore } from '../store/ThemeStore'
import { background } from '../store/Colors'

import Board from '../components/Board';
import Controls from '../components/Controls';

// Material UI Imports
import { Modal } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';

import Confetti from 'react-confetti';
import LevelCell from '../components/LevelCell';

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
  backgroundColor:background
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
      blockers:[]
    },
    {
      name:"level 2",
      width:8,
      height:4,
      sources:[
        {x:1, y:0, color:'red'},
        {x:4, y:2, color:'red'},
        {x:4, y:1, color:'yellow'},
        {x:4, y:3, color:'yellow'},
        {x:2, y:0, color:'blue'},
        {x:5, y:0, color:'blue'},
      ],
      blockers:[{x:1, y:1}]
    },
    {
      name:"level 3",
      width:8,
      height:8,
      sources:[
        {x:7, y:0, color:'blue'},
        {x:7, y:7, color:'blue'},
        {x:4, y:2, color:'yellow'},
        {x:7, y:6, color:'yellow'},
        {x:0, y:7, color:'red'},
        {x:4, y:4, color:'red'},
      ],
      blockers:[]
    },
    {
      name:"Challenge",
      width:7,
      height:7,
      sources:[
        {x:0, y:6, color:'yellow'},
        {x:1, y:6, color:'red'},
        {x:2, y:6, color:'orange'},
        {x:3, y:0, color:'yellow'},
        {x:3, y:4, color:'green'},
        {x:5, y:1, color:'cyan'},
        {x:5, y:3, color:'green'},
        {x:5, y:4, color:'cyan'},
        {x:5, y:5, color:'orange'},
        {x:6, y:3, color:'red'},
        {x:6, y:4, color:'blue'},
        {x:6, y:6, color:'blue'},
      ],
      blockers:[]
    },
  ]);     

  // This is the level currently loaded into our gloabl store.
  const loadedLevel = useGameStore((state) => state.loadedLevel);
  // This is a function to load a new level into our global state for the loaded level.
  const loadLevel   = useGameStore((state) => state.loadLevel);

  const reset   = useGameStore((state) => state.reset);

  // Hook calls used for testing
  const winCheck          = useGameStore((state) => state.winCheck);
  const setSource         = useGameStore((state) => state.setSource);
  const markLevelComplete = useGameStore((state) => state.markLevelComplete);

  // Get everything out of our global stores that we may need
  const theme = useThemeStore((state) => state.theme);

  const win   = useGameStore((state) => state.win);

  const handleClose = () => {
    reset();
  }

  return (
    <ThemeProvider theme={theme}>
      <div data-testid="level-select">
        {
          levels.map((level, index) => (
            <div key={index}
              onClick={() => {
                if(!loadedLevel){
                  loadLevel(level);
                }
              }}
            >
              <LevelCell level={level} />
            </div>
          ))
        }
      </div>
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
            <div>
              {win ? 
                <Confetti
                  data-testid="win"
                  // width={800}
                  // height={800}
                /> : <></>
              }
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
            </div>
          </Fade>
        </Modal>
      </div>
      {/* Here we render a fragment that contains clickable divs that allow us to test our Zustand Store */}
      <div
        style={{width:'0px', height:'0px'}}
        data-testid="check-win"
        onClick={() => {
          winCheck();
        }}
      />
      <div
        style={{width:'0px', height:'0px'}}
        data-testid="check-set-source"
        onClick={() => {
          // Strictly used for testing hooks.
          setSource(0, 0, true);
          setSource(0, 0, false);
        }}
      />
      <div
        style={{width:'0px', height:'0px'}}
        data-testid="mark-level-complete"
        onClick={() => {
          // Strictly used for testing hooks.
          markLevelComplete(loadedLevel);
        }}
      />
    </ThemeProvider>
  );
}

export default LevelSelect;