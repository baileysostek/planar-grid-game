import create from 'zustand'

// This is a global store to hold our game data. These stores can be referenced within any child components by using the useStore Hook

export const useGameStore = create((set) => ({
	dragging: null,
	setDragging: (dragging) => set(() => ({ dragging: dragging })),

  // Here we will define global actions that users can perform
  reset: () => set(() => ({
    dragging: null
  })),

}));