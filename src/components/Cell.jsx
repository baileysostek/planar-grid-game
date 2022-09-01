
import React, { useState } from 'react';

// Material UI Imports
import Paper from '@mui/material/Paper';

// Store Variables
import { useGameStore } from '../store/GameStore';
import { useColorStore } from '../store/ColorStore';
import zIndex from '@mui/material/styles/zIndex';

const defaultSize = 100;
const hoverSize = 128;

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

  // This is the representation of if this is a source or destination Cell, or just a regular cell.
  let source = cell?.source;
  if(!source){
    source = false;
  }

  // Here we get this cells neighbors
  let up    = getCell(x, y - 1);
  let down  = getCell(x, y + 1);
  let left  = getCell(x - 1, y);
  let right = getCell(x + 1, y);

  const red     = useColorStore((state) => state.red);
  const orange  = useColorStore((state) => state.orange);
  const yellow  = useColorStore((state) => state.yellow);
  const green   = useColorStore((state) => state.green);
  const blue    = useColorStore((state) => state.blue);

  let colors = [red, orange, yellow, green, blue];

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
      }
    }
    return false;
  }

  // This functionality handles a click/select event for a cell
  const onSelect = () => {

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
              populate(x, y, colors[Math.floor(Math.random() * colors.length / 3)]);
            }
          }}

          onMouseLeave={() => {
            setHover(false);
          }}

          onMouseDown={(event) => {
            event.preventDefault();
            setDragging(true); //TODO this should be the tile we are dragging.
            populate(x, y, colors[Math.floor(Math.random() * colors.length)]);
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
            transition: 'width 2.5s, height 2.5s, background-color 2.5s, transform 2.5s, border-radius 2.5s',
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
          {/* {`${x}, ${y}, ${value}`} */}

          {source ? "S" : <div></div>}

		      {/* Control the Borders between cells */}
          {/* left */}
					{ (shouldConnectToNeighbor(up)) ? 
            <div 
              style={{
                width: `100%`,
                height: '8px',
                top: '-4px',
                left: '0px',
                position: 'absolute',
                backgroundColor:color,
                zIndex:0,
              }}
            />
            : <div/>
          }
		      {/* right */}
          { (shouldConnectToNeighbor(left)) ? 
            <div 
              style={{
                width: '8px',
                height: `100%`,
                top: '0px',
                left: '-4px',
                position: 'absolute',
                backgroundColor:color,
                zIndex:0,
              }}
            />
            : <div/>
          }

          {/* Control Corners between cells */}
          {/* Bottom Left */}
          { (shouldConnectToNeighbor(down) && shouldConnectToNeighbor(left)) ? 
            <div style={{
              width: '0px',
              height: '0px',
              position: 'absolute',
              top: `${hoverSize}px`,
              left: '0px',
              border: '8px solid',
              borderTopRightRadius: '8px',
              borderBottomWidth: '0px',
              borderLeftWidth: '0px'
            }}/>
            : <div/>
          }

          {/* Bottom right */}
          { (shouldConnectToNeighbor(down) && shouldConnectToNeighbor(right)) ? 
            <div style={{
              width: '0px',
              height: '0px',
              position: 'absolute',
              top: `${hoverSize}px`,
              left: `${hoverSize}px`,
              border: '8px solid',
              borderTopLeftRadius: '8px',
              borderBottomWidth: '0px',
              borderRightWidth: '0px'
            }}/>
            : <div/>
          }

          {/* Top Left */}
          { (shouldConnectToNeighbor(up) && shouldConnectToNeighbor(left)) ? 
            <div style={{
              width: '0px',
              height: '0px',
              position: 'absolute',
              top: '0px',
              left: '0px',
              border: '8px solid',
              borderBottomRightRadius: '8px',
              borderTopWidth: '0px',
              borderLeftWidth: '0px'
            }}/>
            : <div/>
          }

          {/* Top right */}
          { (shouldConnectToNeighbor(up) && shouldConnectToNeighbor(right)) ? 
            <div style={{
              width: '0px',
              height: '0px',
              position: 'absolute',
              top: '0px',
              left: `${hoverSize}px`,
              border: '8px solid',
              borderBottomLeftRadius: '8px',
              borderTopWidth: '0px',
              borderRightWidth: '0px'
            }}/>
            : <div/>
          }
        </Paper>
        
      </div>
		</div>
  );
}

export default Cell;