export default function displayScore(fullGrid, score){
	// Display score
	fullGrid.flat().forEach((cell) => {
		const [rowIndex, colIndex] = cell.id.split('-').slice(1).map(Number);
		if(rowIndex == 6 && colIndex == 6){
			cell.value = score.total;
		}
		else if(rowIndex == 0 && colIndex == 6 || rowIndex == 6 && colIndex == 0){
			cell.value = score.double[0];
		}
		else if(colIndex != 0 && rowIndex == 6){
			cell.value = score.columns[colIndex - 1];
		}
		else if(rowIndex != 0 && colIndex == 6){
			cell.value = score.rows[rowIndex - 1];
		}
	})
}