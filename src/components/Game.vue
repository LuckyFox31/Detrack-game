<script setup>
// -- Dependencies --
import {ref, watch, onMounted} from "vue";
import isCellCanBePlaced from "../utils/isCellCanBePlaced.js";
import calculateScore from "../utils/calculateScore.js";
import displayScore from "../utils/displayScore.js";
import getTwoRandomTypes from "../utils/getTwoRandomTypes.js";
import {dataTypesArray} from "../constants/dataTypes.js";
import {maxRound} from "../constants/maxRound.js";

// -- References --
const currentTypes = ref([]);
const dataArray = ref([]);
const choosenType = ref(dataTypesArray[0]);
const currentScore = ref(0);
const currentRound = ref(0);

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

// -- Watchers --
watch(currentTypes, (newCurrentTypesValue) => {
  if(newCurrentTypesValue.length === 0 && currentRound.value !== maxRound){
    currentTypes.value = getTwoRandomTypes();
    currentRound.value++;
  }
}, {deep: true});

// -- Life cycles --
onMounted(() => {
  currentTypes.value = getTwoRandomTypes();
  currentRound.value = 1;
})

// -- Functions --
function dragStart(event, type){
  event.dataTransfer.setData("text/plain", type);
}

function drop(event, cell){
  if(cell.cell){
    const type = event.dataTransfer.getData("text/plain");

    if(isCellCanBePlaced(dataArray.value, cell)){
      // Place cell
      cell.value = type;
      // Remove cell from typesContainer
      const index = currentTypes.value.indexOf(type);
      currentTypes.value.splice(index, 1);
      // Calculate and display score
      const score = calculateScore(dataArray.value);
      displayScore(dataArray.value, score);
      currentScore.value = score.total;
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