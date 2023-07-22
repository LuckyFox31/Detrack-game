<script setup>
// -- Dependencies --
import {ref} from "vue";

// -- Constants --
const dataTypesArray = ['#', 'Z', 'O', '/', 'X', 'V'];
const scoreRules = {
  0: -5,
  1: 0,
  2: 2,
  3: 3,
  4: 8,
  5: 10,
};

// -- References --
const currentTypes = ref([
  dataTypesArray[0],
  dataTypesArray[0],
  dataTypesArray[0],
  dataTypesArray[0],
  dataTypesArray[1],
  dataTypesArray[2],
])
const dataArray = ref([]);
const choosenType = ref(dataTypesArray[0]);
const currentScore = ref(0);

// -- Init dataArray
for (let i = 0; i < 7; i++) {
  let row = [];
  for (let j = 0; j < 7; j++) {
    let cell = {
      id: `cell-${i}-${j}`,
      cell: i >= 1 && i <= 5 && j >= 1 && j <= 5,
      result: i == 6 || j == 6,
      double: i + j === 6,
      value: i == 6 || j == 6 ? 0 : null,
    };
    row.push(cell);
  }
  dataArray.value.push(row);
}
// Set choosenType in first cell
dataArray.value[1][1].value = choosenType;

// -- Functions --
function getGameGrid(){
  const gameGrid = JSON.parse(JSON.stringify(dataArray.value));
  gameGrid.shift();
  gameGrid.pop();
  gameGrid.forEach(row => {
    row.shift();
    row.pop();
  })

  return gameGrid;
}

function isCellCanBePlaced(cell){
  const gameGrid = getGameGrid();

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

function calculateScore() {
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
  const gameGrid = getGameGrid();

  gameGrid.flat().forEach((cell) => {
    const [rowIndex, colIndex] = cell.id.split('-').slice(1).map(Number);
    data.rows[rowIndex] = data.rows[rowIndex] || [];
    data.columns[colIndex] = data.columns[colIndex] || [];
    data.rows[rowIndex].push(cell.value);
    data.columns[colIndex].push(cell.value);

    // If cell is double
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
  currentScore.value = rowScore + columnScore + (score.double[0] * 2);

  // Display score
  dataArray.value.flat().forEach((cell, index) => {
    const [rowIndex, colIndex] = cell.id.split('-').slice(1).map(Number);
    if(rowIndex == 6 && colIndex == 6){
      cell.value = currentScore.value;
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


function getPlayableCells(gameGrid){
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

function dragStart(event, type){
  event.dataTransfer.setData("text/plain", type);
}

function drop(event, cell){
  if(cell.cell){
    const type = event.dataTransfer.getData("text/plain");

    if(isCellCanBePlaced(cell)){
      cell.value = type;
      const index = currentTypes.value.indexOf(type);
      currentTypes.value.splice(index, 1);
      calculateScore();
    }
  }
}
</script>

<template>
  <main>
    <div id="sheetContainer">
      <div v-for="(row, i) in dataArray" class="row" :key="i">
        <div v-for="cell in row" @dragover.prevent @drop="drop($event, cell)" :class="[cell.cell && 'cell', cell.result && 'result', cell.double && 'double']"
             :id="cell.id" :key="cell.id">{{ cell.value }}
        </div>
      </div>
    </div>
    <div id="typesContainer">
      <div v-for="(type, i) in currentTypes" draggable="true" @dragstart="dragStart($event, type)">{{ type }}</div>
    </div>
  </main>
</template>

<style scoped>
main{
  display: flex;
  align-items: center;
  justify-content: center;
}

#sheetContainer {
  width: 50vw;
  aspect-ratio: 1/1;
  background: white;
  display: grid;
  grid-template-rows: repeat(7, 1fr);
}

.row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.cell {
  border-top: 1px solid black;
  border-left: 1px solid black;
}

.double {
  background-color: lightgray;
}

.result {
  border-top: 1px solid black;
  border-left: 1px solid black;
  background-color: lightblue;
}

.cell, .double, .result {
  aspect-ratio: 1/1;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(50vw / 8);
  overflow: hidden;
  color: black;
}

#typesContainer{
  width: calc(50vw / 5);
  margin-left: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
  border: 3px solid white;
  padding: 1rem 0;
  border-radius: 1rem;
}

#typesContainer div{
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: calc(50vw / 8);
  width: calc(50vw / 7);
  aspect-ratio: 1/1;
  overflow: hidden;
  background-color: white;
  margin-bottom: 1rem;
  border-radius: 0.3rem;
}

#typesContainer div:last-child{
  margin-bottom: 0;
}
</style>