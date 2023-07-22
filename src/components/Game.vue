<script setup>
// -- Dependencies --
import {ref} from "vue";

// -- Constants --
const dataTypesArray = ['#', 'Z', 'O', '/', 'X', 'V'];

// -- References --
const currentTypes = ref([
    dataTypesArray[0],
    dataTypesArray[1],
    dataTypesArray[2],
])
const dataArray = ref([]);

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

function isCellCanBePlaced(cell){
  const gameGrid = getGameGrid();

  // Check if there is already an element placed on the grid
  const isGridEmpty = gameGrid.every(row => {
    return row.every(cell => {
      return cell.value === null
    })
  });

  // If the grid is empty, the only possible placement is cell-1-1
  if (isGridEmpty && cell.id !== 'cell-1-1') {
    return false;
  }

  // If choosen cell has already a value, skip
  if (cell.value){
    return false;
  }

  const playableCells = getPlayableCells(gameGrid);

  if(!playableCells.includes(cell.id) && !isGridEmpty){
    return false;
  }

  return true;
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