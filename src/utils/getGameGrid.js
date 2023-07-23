export default function getGameGrid(fullGrid){
	const gameGrid = JSON.parse(JSON.stringify(fullGrid));
	gameGrid.shift();
	gameGrid.pop();
	gameGrid.forEach(row => {
		row.shift();
		row.pop();
	})

	return gameGrid;
}