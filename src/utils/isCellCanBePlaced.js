import getGameGrid from "./getGameGrid.js";
import getPlayableCells from "./getPlayableCells.js";

export default function isCellCanBePlaced(fullGrid, cell){
	const gameGrid = getGameGrid(fullGrid);

	// If choosen cell has already a value, skip
	if (cell.value){
		return false;
	}

	const playableCells = getPlayableCells(gameGrid);

	if(!playableCells.includes(cell.id)){
		return false;
	}

	return true;
}