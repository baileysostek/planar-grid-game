
import React, { useState } from 'react';

// Material UI Imports
import Paper from '@mui/material/Paper';
import { useGameStore } from '../store/GameStore';

const defaultSize = 100;
const hoverSize = 128;

// Create a React Function component that takes in input props and renders some dom content.
const Cell = (props) => {

	const [hover, setHover] = useState(false);
	const [color, setColor] = useState("#282c34");

	const dragging = useGameStore((state) => state.dragging);
	const setDragging = useGameStore((state) => state.setDragging);

  return (
		<div
      style={{
				width:hoverSize,
				height:hoverSize
      }}
			draggable = {false}
    >
			<Paper 
				elevation={!hover ? 8 : 12} 
				
				onMouseOver={() => {
					if(!dragging){
						setHover(true);
					}else{
						setColor("#FF0000");
					}
				}}

				onMouseLeave={() => {
					setHover(false);
				}}

				onMouseDown={(event) => {
					event.preventDefault();
					setDragging(true); //TODO this should be the tile we are dragging.
					setColor("#FF0000");
				}}

				onMouseUp={(event) => {
					event.preventDefault();
					setDragging(false);
				}}

				sx={{
					textAlign: 'center',
					height: !hover ? defaultSize : hoverSize,
					width:!hover ? defaultSize : hoverSize,
					lineHeight: '60px',
					transition: 'width 0.125s, height 0.125s, background-color 0.125s, transform 0.125s',
					transform: 'translate(-50%, -50%)',
					borderRadius: '24px',
					backgroundColor: color,
					color:'',
					border: 8,
				}}
			>

			</Paper>
		</div>
  );
}

export default Cell;