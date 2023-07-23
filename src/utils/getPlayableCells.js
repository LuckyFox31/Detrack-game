export default function getPlayableCells(gameGrid){
	const playableCells = [];

	gameGrid.flat().forEach((cell) => {
		if(cell.value){
			const [rowIndex, colIndex] = cell.id.split('-').slice(1).map(Number);
			const coord = {
				up: true,
				down: true,
				left: true,
				right: true,
			}

			switch(rowIndex){
				case 1:
					coord.up = false;
					break;

				case 5:
					coord.down = false;
					break;
			}

			switch(colIndex){
				case 1:
					coord.left = false;
					break;

				case 5:
					coord.right = false;
					break;
			}

			if(coord.up){
				playableCells.push(`cell-${rowIndex - 1}-${colIndex}`);
			}
			if(coord.down){
				playableCells.push(`cell-${rowIndex + 1}-${colIndex}`);
			}
			if(coord.left){
				playableCells.push(`cell-${rowIndex}-${colIndex - 1}`);
			}
			if(coord.right){
				playableCells.push(`cell-${rowIndex}-${colIndex + 1}`);
			}
		}
	})

	return playableCells
}