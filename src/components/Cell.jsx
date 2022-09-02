
import React, { useState } from 'react';

// Material UI Imports
import Paper from '@mui/material/Paper';

// Store Variables
import { useGameStore } from '../store/GameStore';
import { useColorStore } from '../store/ColorStore';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

const defaultSize = 100;
const hoverSize = 128;

const TRANSITION_SPEED = '.33s';

// Create a React Function component that takes in input props and renders some dom content.
const Cell = (props) => {

  // Here we define all of the properties that a cell has
  let x = props.x;
  let y = props.y;

  // Here we reference variables from the global stores that we want to use later.
	const dragging    = useGameStore((state) => state.dragging);
	const setDragging = useGameStore((state) => state.setDragging);

  const populate  = useGameStore((state) => state.populate);
  const getCell   = useGameStore((state) => state.getCell);
  const setSource   = useGameStore((state) => state.setSource);

  const DEFAULT_COLOR    = useColorStore((state) => state.DEFAULT_COLOR);

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

  // Here we get this cells neighbors
  let up    = getCell(x, y - 1);
  let down  = getCell(x, y + 1);
  let left  = getCell(x - 1, y);
  let right = getCell(x + 1, y);

  let directions = [up, down, left, right];

  // Internal State
  const [hover, setHover] = useState(false);

  // Determine the cell size here
  const cellSize = (hover || !(color == DEFAULT_COLOR)) ? hoverSize : defaultSize;

  // Here we are defining helper functions to check if we have a neighbor above us that we should connect visually to.
  const shouldConnectToNeighbor = (neighbor) => {
    if(neighbor){
      // If this is the default color, return false
      if(neighbor?.color == DEFAULT_COLOR){
        return false;
      }

      // if the neighbor color is the same as our color, return true
      if ( neighbor?.color == color ) {
        // TODO add check that numeric value is increased by 1.
        if( Math.abs((value - neighbor?.value)) <= 1 ){
          return true;
        }
        // // If the numbers differ but our neighbor is a source tile we can always connect to it.
        // if( neighbor?.source){
        //   return true;
        // }
      }
    }
    return false;
  }

  const calculateCellParent = () => {

    if(color != DEFAULT_COLOR){
      return null; // This cell is already populated.
    }

    let current_max = null;

    // For each direction
    for(let direction of directions){
      if(direction){
        // if the neighbor has a non-default color.
        if ( direction?.color != DEFAULT_COLOR) {

          if(!!!(direction?.source)){
            continue; // Not a source tile
          }

          // If we are dragging
          if(dragging){
            // If we are dragging a color different from this color, continue.
            if(direction.color != dragging){
              continue; // Not the right color.
            }
          }

          // This is the right color to populate this cell with.
          if(current_max == null || (!!current_max && current_max.value < direction.value)){
            current_max = direction;
          }
        }
      }
    }

    // Now we check if we have found a parent, if we have we need to invalidate it and set ourself to a source tile
    if(!!current_max){
      setSource(current_max.x, current_max.y, false);
    }

    return current_max;
  }

  // This functionality handles a click/select event for a cell
  const populateCell = () => {
    // populate(x, y, colors[Math.floor(Math.random() * colors.length )]);
    // A cell can only be populated if it is adjacent to a color with a value of the highest color number.
    const parent = calculateCellParent();

    if(parent){
      // If we are not dragging, set that we are dragging this color
      if(!!!dragging){
        setDragging(parent.color)
      }

      // Populate this cell with the color of its parent, and the value of its parent + 1
      populate(x, y, parent.color, parent.value + 1);
      setSource(x, y, true);
    }
  }

  return (
		<div
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
          onMouseOver={() => {
            if(!dragging){
              setHover(true);
            }else{
              populateCell();
            }
          }}

          onMouseLeave={() => {
            setHover(false);
          }}

          onMouseDown={(event) => {
            event.preventDefault();
            populateCell();
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
            transition: `width ${TRANSITION_SPEED}, height ${TRANSITION_SPEED}, background-color ${TRANSITION_SPEED}, transform ${TRANSITION_SPEED}, border-radius ${TRANSITION_SPEED}`,
            transform: 'translate(-50%, -50%)',

            backgroundColor: color,
            color:'#000000',
			      boxShadow: 'none',

            zIndex:1,

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
          {/* Debug the values in the cell */}
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
        
      </div>
		</div>
  );
}

export default Cell;