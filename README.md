Bailey Sostek Individual Project

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

FIRST make sure to run `npm install` to get all dependencies for this project

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

When the webpage loads you will see four levels that you can play. Click on a leve to start playing it. 

to select a square, hover a cell. The cell will expand and change its border color to indicate that it is selected and can be intereacted with. If there are multiple squares that could extend onto the selected tile, the border will change color to reflect which tile will be selected. The selection method dose a distance test between the currently hovered pixel of the selected tile and its neighboring tiles. It will chose the closest valid tile to extend. 

I also implemented dragging, Simply click and drag from one tile to the next. As long as the tile the mouse moves onto is a valid connection point, the chain of colored tiles will continue. 

If you make a mistake there is a restart level button in the bottom center of the board, additionally there is a return to home screen button that will take you back to the level select page. 

Once a level has been solved, confetti will fall from the top of the webpage, I found this component here: 
https://www.npmjs.com/package/react-confetti

### `npm test -- --coverage --watchAll=false`

This command runs all test cases with coverage. You can inspect the output of this command by looking at the generated webpage located at: /coverage/lcov-report/index.html

Here is the output when I run it on my end:
NOTE i asked the professor if i could include an ignore for the index.js file and reportWebVitals.js file as there is no way to test them in jest, he said this was fine but not to spread the information around.
------------------|---------|----------|---------|---------|-------------------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                   
------------------|---------|----------|---------|---------|-------------------------------
All files         |   88.96 |    87.31 |   86.25 |   87.98 | 
 src              |     100 |      100 |     100 |     100 | 
  App.js          |     100 |      100 |     100 |     100 | 
 src/components   |   84.41 |    89.85 |   71.42 |   83.44 | 
  Board.jsx       |   88.88 |      100 |      80 |    87.5 | 24
  Cell.jsx        |   83.45 |    90.29 |      64 |   82.67 | 88,135,165-185,279-310       
  Controls.jsx    |     100 |      100 |     100 |     100 | 
  LevelCell.jsx   |   85.71 |       75 |     100 |   83.33 | 22
 src/store        |   93.33 |    81.96 |     100 |   92.85 |                               
  Colors.jsx      |     100 |      100 |     100 |     100 | 
  GameStore.jsx   |   93.04 |    81.96 |     100 |   92.59 | 97-98,101-102,119-120,148,169
  ThemeStore.jsx  |     100 |      100 |     100 |     100 | 
 src/views        |   93.93 |    83.33 |   94.11 |      92 | 
  LevelSelect.jsx |   93.93 |    83.33 |   94.11 |      92 | 119-120
------------------|---------|----------|---------|---------|-------------------------------
Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        7.146 s
Ran all test suites.
