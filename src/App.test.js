import { breakpoints } from '@mui/system';
import { render, rerender, screen } from '@testing-library/react';
import ReactTestUtils, { act } from 'react-dom/test-utils'; // ES6
import App from './App';

const EXPECTED_LEVEL_COUNT = 3;
test(`Ensure there are at least ${EXPECTED_LEVEL_COUNT} levels shown.`, () => {
  render(<App />);
  const levelSelect = screen.getByTestId("level-select");
  expect(levelSelect.children.length).toBeGreaterThan(EXPECTED_LEVEL_COUNT)
});


// Make sure the board is not visible under entry conditions
test(`Board is not visible when no level is loaded`, () => {
  render(<App />);
  
  const boardElements = screen.queryByTestId("board");
  expect(boardElements).toBeNull();

});

// Click every level and make sure that the level loads.
test(`Clicking Every level displays that level.`, () => {
  render(<App />);
  
  // Get all of the levels on the level select page.
  const levelSelect = screen.getByTestId("level-select");
  let levels = levelSelect.children;

  // For each level
  for(let level of levels){
    // Expect there to be no board on the screen
    expect(screen.queryByTestId("board")).toBeNull();

    // Click on the level
    act(() => {
      ReactTestUtils.Simulate.click(level);
    })

    // Expect there to now be a board. 
    expect(screen.queryByTestId("board")).toBeInTheDocument();

    // Click the close level button so that the board is no longer visible.
    act(() => {
      let closeButton = screen.queryByTestId("close-level");
      expect(closeButton).toBeInTheDocument();
      ReactTestUtils.Simulate.click(closeButton);
    })
  }
});

test(`Loading level sets active level in our Model`, () => {
  // Render the application
  const {rerender} = render(<App />);
  
  // Get all of the levels on the level select page.
  const levelSelect = screen.getByTestId("level-select");
  let level = levelSelect.children[0];

  // Expect there to be no board on the screen
  expect(screen.queryByTestId("board")).toBeNull();

  // Click on the level
  act(() => {
    ReactTestUtils.Simulate.click(level);
  })

  // Expect there to now be a board. 
  expect(screen.queryByTestId("board")).toBeInTheDocument();

  // Expect the the win condition to be false
  expect(screen.queryByTestId("win")).toBeNull();

  // TODO: Get level specific information from the store
  let width = 3;
  let height = 3;

  let solution = [
    [1, 0],
    [2, 0],
    [2, 1],
    [1, 1],
    [0, 1],
    [0, 2],
    [1, 2]
  ]

  for(let index of solution){
    
    let i = index[0];
    let j = index[1]; 

    act(() => {
      let cell = screen.queryByTestId(`cell-${i}-${j}`);
      expect(cell).toBeInTheDocument();
      ReactTestUtils.Simulate.click(cell);
    })

    rerender(<App/>);

  }

  // Expect the board to be in a win configuration after solving the board.
  // expect(screen.queryByTestId("win")).toBeInTheDocument();

  // Click the close level button so that the board is no longer visible.
  act(() => {
    let closeButton = screen.queryByTestId("close-level");
    expect(closeButton).toBeInTheDocument();
    ReactTestUtils.Simulate.click(closeButton);
  })
  
});

test(`Resetting a loaded level resets the color values of all cells to the inital layout`, () => {
  // Render the application
  const {rerender} = render(<App />);

  // Get all of the levels on the level select page.
  const levelSelect = screen.getByTestId("level-select");
  let level = levelSelect.children[0];

  // Expect there to be no board on the screen
  expect(screen.queryByTestId("board")).toBeNull();

  // Click on the level
  act(() => {
    ReactTestUtils.Simulate.click(level);
  })

  // Expect there to now be a board. 
  expect(screen.queryByTestId("board")).toBeInTheDocument();

  // Expect the the win condition to be false
  expect(screen.queryByTestId("win")).toBeNull();

  // TODO: Get level specific information from the store
  let width = 3;
  let height = 3;

  let solution = [
    [1, 0],
    [2, 0],
    [2, 1],
    [1, 1],
    [0, 1],
    [0, 2],
    [1, 2]
  ]
 
  for(let index of solution){
     
    let i = index[0];
    let j = index[1]; 

    act(() => {
      let cell = screen.queryByTestId(`cell-${i}-${j}`);
      expect(cell).toBeInTheDocument();
      ReactTestUtils.Simulate.click(cell);
    })

    rerender(<App/>);
  }

  // TODO: check that the user is in a win state
  // Expect the board to be in a win configuration after solving the board.
  // expect(screen.queryByTestId("win")).toBeInTheDocument();

  // TODO: check that the user to not be in a win state.
  act(() => {
    let restartButton = screen.queryByTestId("restart");
    expect(restartButton).toBeInTheDocument();
    ReactTestUtils.Simulate.click(restartButton);
  })

  // Click the close level button so that the board is no longer visible.
  act(() => {
    let closeButton = screen.queryByTestId("close-level");
    expect(closeButton).toBeInTheDocument();
    ReactTestUtils.Simulate.click(closeButton);
  })

});

