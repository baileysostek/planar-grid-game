
import React, { useState, useRef, useEffect } from 'react';

// Material UI Imports
import Paper from '@mui/material/Paper';

// Store Variables
import { useGameStore } from '../store/GameStore';
import { DEFAULT_COLOR, BLACK } from '../store/Colors';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

const defaultSize = 100;
const hoverSize = 128;

const TRANSITION_SPEED = '.33s';

// Create a React Function component that takes in input props and renders some dom content.
const Cell = React.forwardRef((props, ref) => {

  // Here we define all of the properties that a cell has
  let x = props.x;
  let y = props.y;

  // Here we reference variables from the global stores that we want to use later.
	const dragging    = useGameStore((state) => state.dragging);
	const setDragging = useGameStore((state) => state.setDragging);

  const populate  = useGameStore((state) => state.populate);
  const winCheck  = useGameStore((state) => state.winCheck);
  const getCell   = useGameStore((state) => state.getCell);
  const setSource   = useGameStore((state) => state.setSource);

  // Get a ref to our rendered div.
  const component = React.useRef();

  // Extract information from the global state an put it into this cell.
  let cell = getCell(x, y);
  
  let color = cell?.color;
  if(!color){
    color = DEFAULT_COLOR;
  }

  // This is the numeric value of this cell
  let value = cell?.value;
  if(!value){
    value = 0;
  }

  // This is the numeric value of this cell
  let source = cell?.source;
  if(!source){
    source = false;
  }

  // This is the numeric value of this cell
  let parent = cell?.parent;
  if(!parent){
    parent = null;
  }

  let child = cell?.child;
  if(!child){
    child = null;
  }

  // Here we get this cells neighbors
  let up    = getCell(x, y - 1);
  let down  = getCell(x, y + 1);
  let left  = getCell(x - 1, y);
  let right = getCell(x + 1, y);

  let directions = [up, down, left, right];

  // Internal State
  const [hover, setHover] = useState(false);
  const [borderColor, setBorderColor] = useState('#000000');

  // Determine the cell size here
  const cellSize = (hover || !(color == DEFAULT_COLOR)) ? hoverSize : defaultSize;

  // Here we are defining helper functions to check if we have a neighbor above us that we should connect visually to.
  const shouldConnectToNeighbor = (neighbor) => {
    if(neighbor){
      // If this is the default color, return false
      if(neighbor?.color == DEFAULT_COLOR){
        return false;
      }
      
      // if the neighbor is our parent we can connect to it.
      if(neighbor == parent){
        return true;
      }

      // If the neighbor is our child we can connect to it.
      if(neighbor == child){
        return true;
      }

      // If we are a source tile and we see a source tile next to us of the same color, we can connect to it
      if(neighbor?.color == color){
        if(neighbor?.source && source){
          return true;
        }
      }

    }
    return false;
  }

  const calculateCellParent = (screenPos) => {

    if(color != DEFAULT_COLOR){
      return null; // This cell is already populated.
    }

    let current_max = [];

    // For each direction
    for(let direction of directions){
      if(direction){
        // if the neighbor has a non-default color.
        if ( direction?.color != DEFAULT_COLOR) {

          // If the direction is not a source tile we can skip it.
          if(!!!(direction?.source)){
            continue; // Not a source tile
          }

          // If we are dragging
          if(dragging){
            // If we are dragging a color different from this color, continue.
            if(direction.color != dragging){
              continue; // Not the right color.
            }else{
              // This is the correct color, check if this new value is larger.
              let newCellBigger = true;
              for(let cell of current_max){
                if(cell){
                  if(direction.value < cell.value){
                    newCellBigger = false;
                    break;
                  }
                }
              }
              if(newCellBigger){
                current_max = [];
                current_max.push(direction);
              }
              continue;
            }
          }

          // If we get to this point, this is a possible cell to evaluate.
          current_max.push(direction);
        }
      }
    }

    // Sort these elements by distance to see which we are closest to.

    if(current_max.length > 1){
      // Start with a really big number
      let closestDistance = Number.MAX_VALUE;
      let closestElement = null;
      for(let element of current_max){
        // Calculate distances for each element.
        // Get the screen pos for this element
        let elementX = (element.x * hoverSize) + (hoverSize / 2);
        let elementY = (element.y * hoverSize) + (hoverSize / 2);

        // Now we do some maths.
        // Credit here to our friend Pythagoras, this is code I wrote based off of his theorem 
        // Two point distance function, sqrt(x^2 + y^2)
        let distance = Math.sqrt((elementX - screenPos.x) * (elementX - screenPos.x) + (elementY - screenPos.y) * (elementY - screenPos.y));

        if(distance <= closestDistance){
          closestDistance = distance;
          closestElement = element;
        }
      }
      
      // Return closest element
      return closestElement;
    }else{
      return current_max[0];
    }
  }

  // This functionality handles a click/select event for a cell
  const populateCell = (screenPos = null) => {
    // populate(x, y, colors[Math.floor(Math.random() * colors.length )]);
    // A cell can only be populated if it is adjacent to a color with a value of the highest color number.
    const parent = calculateCellParent(screenPos);

    if(parent){

      // If we are not dragging, set that we are dragging this color
      if(!!!dragging){
        setDragging(parent.color)
      }

      // Populate this cell with the color of its parent, and the value of its parent + 1
      populate(x, y, parent.color, parent.value + 1, parent);
      setSource(x, y, true);
      // The parent now has a new child cell, so we need to say that the parent is no longer a source.
      setSource(parent.x, parent.y, false);

      // Make sure we set this cell's border color back to the default border color
      setBorderColor('#000000');

      // Check for win
      winCheck();
    }
  }

  // This function gets us the relative world coordinates from a mouse event. This will let us detect which cell we are closest to.
  const calculateRelativeMouseCoords = (event)=> {

    // This may be null if this button was clicked through Jest
    let mouseEvent = event;

    // If from jest
    if(!mouseEvent){
      mouseEvent = {"nativeEvent":{
        "offsetX":0,
        "offsetY":0
      }}
    }

    // Get the relative position of where the mouse is in this cell
    let relativeX = mouseEvent.nativeEvent.offsetX;
    let relativeY = mouseEvent.nativeEvent.offsetY;

    // Now we offset this position by this cells index in the grid * the size of a cell + (size / 2)
    relativeX += (x * hoverSize)
    relativeY += (y * hoverSize)

    return {x:relativeX, y:relativeY}

  }

  // This function determines what the border color for a cell should be. It is referenced by mouse event functions within the cell render function.
  const determineBorderColor = (event) => {
    // If we have not set this to a value yet, it has an ambiguous value, display what we are planning on setting this to have a value of.
    let mostValidParent = calculateCellParent(calculateRelativeMouseCoords(event));
    if(mostValidParent){
      setHover(true);
      setBorderColor(mostValidParent.color);
    }
  }

  // Here are functions which our mouse listeners call
  const onOver = (event) => {
    if(!dragging){
      determineBorderColor(event);
    }else{
      populateCell(calculateRelativeMouseCoords(event));
    }
  }

  const onDown = (event) => {
    populateCell(calculateRelativeMouseCoords(event));
  }


  // This is the render function for a cell. This function is called once per frame to determine the DOM representation of a cell.
  return (
		<div
      data-testid={`cell-${x}-${y}`}
      ref={component}
      style={{
				width:hoverSize,
				height:hoverSize
      }}
			draggable = {false}
      onMouseUp={(event) => {
        setDragging(false);
      }}
    >
      <div
        style={{
          transform: 'translate(64px, 64px)',
        }}
      >
        <Paper 
          onMouseOver={(event) => {
            onOver(event);
          }}

          onMouseMove={(event) => {
            if(!dragging){
              determineBorderColor(event);
            }
          }}

          onMouseLeave={() => {
            setHover(false);
            setBorderColor('#000000');
          }}

          onMouseDown={(event) => {
            event.preventDefault();
            onDown(event);
          }}

          onMouseUp={(event) => {
            event.preventDefault();
            setDragging(false);
          }}

          sx={{
            textAlign: 'center',
            height: cellSize,
            width: cellSize,
            lineHeight: '60px',
            transition: `width ${TRANSITION_SPEED}, height ${TRANSITION_SPEED}, background-color ${TRANSITION_SPEED}, color ${TRANSITION_SPEED}, transform ${TRANSITION_SPEED}, border-radius ${TRANSITION_SPEED}`,
            transform: 'translate(-50%, -50%)',

            backgroundColor: color,
            color:borderColor,
			      boxShadow: 'none',

            zIndex:1,

            // Change the cursor so that it looks like we can click this
            cursor: (hover && !value) ? 'pointer' : 'default',

            // Control if a border is shown or not.
            borderTop     : shouldConnectToNeighbor(up) ? 0 : 8.5,
            borderBottom  : shouldConnectToNeighbor(down) ? 0 : 8.5,
            borderLeft    : shouldConnectToNeighbor(left) ? 0 : 8.5,
            borderRight   : shouldConnectToNeighbor(right) ? 0 : 8.5,

            // Control the padding appended to populated cells.
            paddingTop     : shouldConnectToNeighbor(up) ? ((shouldConnectToNeighbor(left) || shouldConnectToNeighbor(right)) ? '8px' : '8px') : '0px',
            paddingBottom  : shouldConnectToNeighbor(down) ? ((shouldConnectToNeighbor(left) || shouldConnectToNeighbor(right)) ? '8px' : '8px') : '0px',
            paddingLeft    : shouldConnectToNeighbor(left) ? ((shouldConnectToNeighbor(up) || shouldConnectToNeighbor(down)) ? '8px' : '8px') : '0px',
            paddingRight   : shouldConnectToNeighbor(right) ? ((shouldConnectToNeighbor(up) || shouldConnectToNeighbor(down)) ? '8px' : '8px') : '0px',

            // Control the rounding level on the corners of the cell.
            borderTopLeftRadius : (shouldConnectToNeighbor(up) || shouldConnectToNeighbor(left)) ? '0px' : '24px',
            borderTopRightRadius : (shouldConnectToNeighbor(up) || shouldConnectToNeighbor(right)) ? '0px' : '24px',
            borderBottomLeftRadius : (shouldConnectToNeighbor(down) || shouldConnectToNeighbor(left)) ? '0px' : '24px',
            borderBottomRightRadius : (shouldConnectToNeighbor(down) || shouldConnectToNeighbor(right)) ? '0px' : '24px',

            //Control the Drop shadow around each of our cells
          }}
        >
          {/* Render the cell's values */}
          {value > 0 ? 
            <Box sx={{
              height: `${hoverSize}px`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>
              <Typography align='center' alignContent={'center'} variant='h3'>
                {value}
              </Typography> 
            </Box>
          : <div/> }

          {/* Render a Zero on all starting tiles except for blocker tiles */}
          {value == 0 && (color != DEFAULT_COLOR) && (color != BLACK) ? 
            <Box sx={{
              height: `${hoverSize}px`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}>
              <Typography align='center' alignContent={'center'} variant='h3'>
                {value}
              </Typography> 
            </Box>
          : <div/> }

          {/* {source ? `${value}` : <div></div>} */}

		      {/* Control the Borders between cells */}
          {/* Vertical Axis */}
          <div 
            style={{
              width: `100%`,
              height: shouldConnectToNeighbor(up) ? '8px' : '0px',
              top: shouldConnectToNeighbor(up) ? '-4px' : '4px',
              left: '0px',
              position: 'absolute',
              backgroundColor:shouldConnectToNeighbor(up) ? color : DEFAULT_COLOR,
              zIndex:0,
              transition: `width ${TRANSITION_SPEED}, height ${TRANSITION_SPEED}, top ${TRANSITION_SPEED}, background-color ${TRANSITION_SPEED}`,
            }}
          />
					
		      {/* Horisontal Axis */}
          <div 
            style={{
              width: shouldConnectToNeighbor(left) ? '8px' : '0px',
              height: '100%',
              top: '0px',
              left: shouldConnectToNeighbor(left) ? '-4px' : '4px',
              position: 'absolute',
              backgroundColor:shouldConnectToNeighbor(left) ? color : DEFAULT_COLOR,
              zIndex:0,
              transition: `width ${TRANSITION_SPEED}, height ${TRANSITION_SPEED}, left ${TRANSITION_SPEED}, background-color ${TRANSITION_SPEED}`,
            }}
          />

          
        </Paper>
        
        <div>
          {/* Here we render a fragment that contains clickable divs that allow us to test our mouse event functions*/}
          <div
            style={{width:'0px', height:'0px'}}
            data-testid={`cell-${x}-${y}-over`}
            onClick={() => {
              onOver(null); // Spoof mouse event.
            }}
          />
          <div
            style={{width:'0px', height:'0px'}}
            data-testid={`cell-${x}-${y}-move`}
            onClick={() => {

            }}
          />
          <div
            style={{width:'0px', height:'0px'}}
            data-testid={`cell-${x}-${y}-leave`}
            onClick={() => {

            }}
          />
          <div
            style={{width:'0px', height:'0px'}}
            data-testid={`cell-${x}-${y}-down`}
            onClick={() => {
              onDown(null); // Spoof mouse event.
            }}
          />
          <div
            style={{width:'0px', height:'0px'}}
            data-testid={`cell-${x}-${y}-up`}
            onClick={() => {

            }}
          />
        </div>

      </div>
		</div>
  );
})

export default Cell;