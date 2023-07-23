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
      <div class="rug">
        <div class="dice" v-for="(type, i) in currentTypes" draggable="true" @dragstart="dragStart($event, type)">{{ type }}</div>
      </div>
    </div>
    <div id="roundContainer">
      <p>Tour {{ currentRound }} / {{ maxRound }}</p>
    </div>
    <div id="choosenTypeContainer">
      <p><span>Mon symbole :</span> <span class="type">{{ choosenType }}</span></p>
    </div>
  </main>
</template>

<style scoped>
main{
  display: flex;
  align-items: center;
  justify-content: center;
}

main::after{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 90vh;
  width: 5vw;
  background-image: url("public/img/pencil.webp");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  transform: translate(75px, -85px) rotate(-130deg);
  filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.3));
}

#sheetContainer {
  position: relative;
  width: 50vw;
  aspect-ratio: 1/1;
  background: white;
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

#sheetContainer::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(1.5deg);
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  z-index: -1;
}

#sheetContainer::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-3deg);
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  z-index: -1;
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
  width: 15vw;
  height: 40vh;
  margin-left: 3rem;
  color: black;
  padding: 0.5rem;
  background-color: #006200;
  border-radius:15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

#typesContainer .rug{
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border: 2px dashed #c4c4c4;
  border-radius:10px;
  position:relative;
  box-shadow: 0 0 0 1px #007b00;
}

#typesContainer .dice{
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: calc(50vw / 8);
  width: calc(50vw / 7);
  aspect-ratio: 1/1;
  overflow: hidden;
  background-color: #e7e7e7;
  border-radius: 0.3rem;
  box-shadow:
      inset 0 5px #f0f0f0,
      inset 0 -5px #bbb,
      inset 5px 0 #d7d7d7,
      inset -5px 0 #d7d7d7;
}

#roundContainer{
  position: absolute;
  right: 5%;
  top: 5%;
  background-color: white;
  padding: 1rem 3rem;
  font-size: calc(30vw / 8);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  transform: rotate(2deg);
}

#choosenTypeContainer{
  position: absolute;
  right: 5%;
  bottom: 8%;
  background-color: white;
  padding: 0.5rem 2rem;
  font-size: calc(15vw / 8);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  transform: rotate(-3deg);
}

#choosenTypeContainer p{
  display: flex;
  align-items: center;
}

#choosenTypeContainer p span:first-child{
  margin-right: 1rem;
}

#choosenTypeContainer p .type{
  font-size: calc(30vw / 8);
}
</style>