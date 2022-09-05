import React, { useState } from 'react';

import { ThemeProvider } from '@mui/material/styles';

import { useGameStore } from '../store/GameStore'
import { useThemeStore } from '../store/ThemeStore'
import { useColorStore } from '../store/ColorStore'

import Board from '../components/Board';
import Controls from '../components/Controls';

import { Modal } from '@mui/material';

// Create a function to render our board.
const LevelSelect = (props) => {

  // Define all of our levels
  // Maybe one day these will be loaded from a JSON file.
  const [levels] = useState([
    {
      name:"level 1",
      width:3,
      height:3,
      sources:[],
      blockers:[{x:0, y:0}]
    },
    {
      name:"level 2",
      width:4,
      height:2,
      sources:[],
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

  // All of the Games colors.
  const red     = useColorStore((state) => state.red);
  const orange  = useColorStore((state) => state.orange);
  const yellow  = useColorStore((state) => state.yellow);
  const green   = useColorStore((state) => state.green);
  const blue    = useColorStore((state) => state.blue);

  let all_colors = [red, orange, yellow, green, blue];

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

                // Logic to load the level
                for(let i = 0; i < Math.floor(Math.random() * 8) + 1; i++){
                  let x = Math.floor(Math.random() * level.width);
                  let y = Math.floor(Math.random() * level.height)

                  let color =  all_colors[Math.floor(Math.random() * all_colors.length)];

                  populate(x, y, color, 0);
                  markCellAsSource(x, y);
                }
              }
            }}
          >
            {JSON.stringify(level)}
          </div>
        ))
      }
      <Modal
        open={!!loadedLevel}
        onClose={() => {
          unloadLevel();
          console.log("unloadLevel");
        }}
      >
        {!!loadedLevel ? <div 
          style={{
            borderRadius: '24px',
            border:'8px solid',
            padding: '24px',
            color:'#000000',
            overflow:'hidden',
            width:`${((loadedLevel.width+ 1) * 128)}px` ,
            height:`${((loadedLevel.height + 1) * 128)}px`
          }}
        >
          {/* If there is a level loaded, lets display that board */}
          <Board level={loadedLevel}/>
          <Controls/>
        </div> : <></>}
      </Modal>
    </ThemeProvider>
  );
}

export default LevelSelect;