import getGameGrid from "./getGameGrid.js";
import {scoreRules} from "../constants/scoreRules.js";

export default function calculateScore(fullGrid) {
	const score = {
		rows: [],
		columns: [],
		double: [],
	}
	const data = {
		rows: [],
		columns: [],
		double: [[]],
	}
	const gameGrid = getGameGrid(fullGrid);

	// Sort cells by context
	gameGrid.flat().forEach((cell) => {
		const [rowIndex, colIndex] = cell.id.split('-').slice(1).map(Number);
		data.rows[rowIndex] = data.rows[rowIndex] || [];
		data.columns[colIndex] = data.columns[colIndex] || [];
		data.rows[rowIndex].push(cell.value);
		data.columns[colIndex].push(cell.value);

		// Double context
		if (rowIndex + colIndex === gameGrid.length + 1) {
			data.double[0].push(cell.value);
		}
	})

	// Calculate score
	for (let dataKey in data) {
		data[dataKey].forEach((dataArray) => {
			let currentScore = 0;
			let acc = 1;
			let previousType = null;

			dataArray.forEach((cell, index) => {
				if(cell !== null && cell === previousType){
					acc++;
				}
				// Check if it's a different cell or the last element of the array
				if (cell !== previousType || index === dataArray.length - 1) {
					currentScore += scoreRules[acc] || 0;
					acc = 1;
				}
				previousType = cell;
			})

			score[dataKey].push(currentScore || scoreRules["0"]);
		})
	}

	const rowScore = score.rows.reduce(
		(acc, currentValue) => acc + currentValue,
		0
	);
	const columnScore = score.columns.reduce(
		(acc, currentValue) => acc + currentValue,
		0
	);

	return {
		...score,
		total: rowScore + columnScore + (score.double[0] * 2),
	};
}