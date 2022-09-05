import create from 'zustand'

const DEFAULT_COLOR = "#282c34";

// This is a global store to hold our game data. These stores can be referenced within any child components by using the useStore Hook
export const useGameStore = create((set) => ({

  // If we are currently dragging.
	dragging: null,
	setDragging: (dragging) => set(() => ({ dragging: dragging })),

  // The grid item that we selected
  selected: null,

  // Grid width and height information
  width:8,
  height:5,

  // The currently loaded level
  loadedLevel: null,

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
    grid[x + (y * state.width)].parent = parent;

    return {grid}
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
      loadedLevel: null
    }
  }), 

  // Here we will define global actions that users can perform
  reloadLevel: ()  => set((state) => {

    const grid = new Array(state.width * state.height);

    // TODO code to regenerate the grid.

    return {
      dragging: null,
      grid: grid
    }
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

    color:DEFAULT_COLOR,
    value:0
  }
}