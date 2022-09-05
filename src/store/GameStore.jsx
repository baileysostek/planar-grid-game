import create from 'zustand'

import colors, { DEFAULT_COLOR } from '../store/Colors';

// This is a global store to hold our game data. These stores can be referenced within any child components by using the useStore Hook
export const useGameStore = create((set) => ({

  // If we are currently dragging.
	dragging: null,
	setDragging: (dragging) => set(() => ({ dragging: dragging })),

  // The grid item that we selected
  selected: null,

  // Grid width and height information
  width:8,
  setWidth: (width) => set(() => ({ width: width })),
  height:8,
  setHeight: (height) => set(() => ({ height: height })),

  // The currently loaded level
  loadedLevel: null,

  // This stores if the game state is in a win condition or not.
  win:false,

  // Setters for width and height also resize the grid.
  grid:[],

  // This function populates a cell with a color
  populate: (x, y, color, value, parent = null) => set((state) => {
    const grid = [...state.grid];

    // Make sure that the grid cell that we are editing is empty
    if(grid[x + (y * state.width)]?.color){
      if(!(grid[x + (y * state.width)]?.color == DEFAULT_COLOR)){
        return {grid};// Return the same state if we cant edit this object.
      }
    }

    if(!grid[x + (y * state.width)]){
      grid[x + (y * state.width)] = new_Cell(x, y);
    }


    grid[x + (y * state.width)].color = color;
    grid[x + (y * state.width)].value = value;

    if(parent){
      grid[parent.x + (parent.y * state.width)].child = grid[x + (y * state.width)];
      parent = grid[parent.x + (parent.y * state.width)];
    }

    grid[x + (y * state.width)].parent = parent;

    return {
      grid:grid,
    }
  }), 

  winCheck: () => set((state) => {
    
    // Check for win here. 
    let win = true; // We assume we are in a won state and search for violations of that assumption. 
    let colorBuffer = new Map();
    
    // Win checking logic.
    loop:for(let j = 0; j < state.height; j++){
      for(let i = 0; i < state.width; i++){
        // If we failed break the loop.
        if(!win){
          break loop;
        } 

        // If a grid cell does not have a value, this is a failure state. 
        if(!state.grid[i + (j * state.width)]){
          win = false;
          continue;
        }else{
          // Get the Grid cell
          let cell = state.grid[i + (j * state.width)];

          // If this cell does not have a color
          if(!cell.color){
            win = false;
            continue;
          }else{
            if(cell.color == DEFAULT_COLOR){
              win = false;
              continue;
            }
          }

          // In this case we DO have a grid cell with a color and a value, we want to make sure that each color only has ONE entry for each numeric value, this means that we only have 1 path of each color
          // initialize Set Map if we dont have a set for this color.
          if(!colorBuffer.has(cell.color)){
            colorBuffer.set(cell.color, new Set());
          }

          // Make sure that our set does not contain this value for this color yet.
          if(cell.value > 0){
            if(!(colorBuffer.get(cell.color).has(cell.value))){
              // Insert our value into the color set
              (colorBuffer.get(cell.color)).add(cell.value);
            }else{
              // We already have a cell of this color with this value, this is a failure state.
              win = false;
              continue;
            }
          }

          // Check to see if this is a source tile
          if(!!cell.source){

            // if this is a source tile, it NEEDS to be adjacent to another source tile of the same color.
            let neighborCoords = [
              {x:cell.x , y:cell.y - 1}, // UP
              {x:cell.x , y:cell.y + 1}, // DOWN
              {x:cell.x - 1 , y:cell.y}, // LEFT
              {x:cell.x + 1 , y:cell.y}, // RIGHT
            ];

            // For each neighbor we need to check...
            let adjacentToValidSourceTile = false;
            
            for(let coords of neighborCoords){
              if(coords.x >= 0 && coords.x < state.width){
                if(coords.y >= 0 && coords.y < state.width){
                  let index = (coords.x + (coords.y * state.width))
                  // Bounds check
                  if(index >= 0 && index < (state.width * state.height)){
                    if(state.grid[index]){
                      let neighbor = state.grid[index];
                      if(neighbor.color == cell.color){
                        if(neighbor.source){
                          adjacentToValidSourceTile = true; // We have a neighbor.
                        }
                      }
                    }
                  }
                }
              }
            }

            // We found an invalid case
            if(!adjacentToValidSourceTile){
              win = false;
              continue;
            }
          }
        }
      }
    }

    return{
      win:win
    }

  }),

  // This function populates a cell with a color
  getCell: (x, y) => useGameStore((state) => {
    // Validate X is in range
    if(x >=0 && x < state.width){
      // Validate Y is in range
      if(y >=0 && y < state.height){
        // Get the value at this valid position in the grid.
        if(state.grid[x + (y * state.width)]){
          return state.grid[x + (y * state.width)];
        }
      }
    }

    // Nothing found return null
    return null;
  }), 


  // Here we will define global actions that users can perform
  reset: ()  => set((state) => {

    const grid = new Array(state.width * state.height);

    return {
      dragging: null,
      grid: grid,
      loadedLevel: null,
      win:false,
    }
  }), 

  // Here we will define global actions that users can perform
  reloadLevel: ()  => set((state) => {

    state.loadLevel(state.loadedLevel);

    return {};
  }), 

  // This is a store function to load a level from disk. Levels are stored in the JSON format.

  // This function sets an object to be a source tile of a color. 
  markCellAsSource: (x, y) => set((state) => {
    const grid = [...state.grid];

    grid[x + (y * state.width)].value = 0;
    grid[x + (y * state.width)].source = true;

    return {grid}
  }), 

  setSource: (x, y, source) => set((state) => {
    const grid = [...state.grid];

    grid[x + (y * state.width)].source = source;

    return {grid}
  }), 

  loadLevel: (level)  => set((state) => {

    state.setWidth(level.width);
    state.setHeight(level.height);

    state.reset();

    // Place all sources in the level
    for(let source of level?.sources){
      let x = source.x;
      let y = source.y;

      let color =  colors[source.color];
      if(color == undefined){
        color = source.color;
      }

      state.populate(x, y, color, 0);
      state.markCellAsSource(x, y);
    }

    return {
      loadedLevel: level,
    }
  }), 

}));  


// This is the STRUCT or JSON definition for a cell, these are the cell props
function new_Cell(x, y) {
  return {
    source:false,

    x:x,
    y:y,

    parent:null,
    child:null,

    color:colors.DEFAULT_COLOR,
    value:0
  }
}