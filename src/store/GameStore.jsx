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

  // Setters for width and height also resize the grid.
  grid:[],

  setWidth: (width) => set((state) => ({
    width:width,
    grid: new Array(state.width * state.height).fill(new_Cell())
  })), 
  setHeight: (height) => set((state) => ({
    height:height,
    grid: new Array(state.width * state.height).fill(new_Cell())
  })), 

  // This function populates a cell with a color
  populate: (x, y, color) => set((state) => {
    const grid = [...state.grid];
    grid[x + (y * state.width)] = {color:color};
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
  reset: () => set((state) => ({
    dragging: null,
    grid: new Array(state.width * state.height).fill(new_Cell())
  })),

  // This is a store function to load a level from disk. Levels are stored in the JSON format.

}));  


// This is the STRUCT or JSON definition for a cell, these are the cell props
function new_Cell() {
  return {
    color:DEFAULT_COLOR,
    source:false,
    value:0
  }
}