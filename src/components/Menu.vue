<script setup>
  // -- Dependencies --
  import {defineEmits, defineProps} from "vue";
  import {dataTypesArray} from "../constants/dataTypes.js";
  import {gameModes} from "../constants/gameModes.js";

  // -- Emits --
  const emit = defineEmits([
      'chooseGameMode',
      'chooseType',
  ]);

  // -- Props --
  const props = defineProps({
    currentGameMode: Number,
  });
</script>

<template>
  <main>
    <div id="sheetContainer">
      <h1>Detrak</h1>
      <div v-if="currentGameMode === 0" id="buttonsContainer" class="menuContainer">
        <button disabled title="Disponible prochainement">Jouer en ligne</button>
        <button @click="emit('chooseGameMode', gameModes.singlePlayer)">Jouer hors ligne</button>
        <a href="https://www.gigamic.com/index.php?controller=attachment&id_attachment=194" target="_blank">Regles du jeu</a>
      </div>
      <div v-else-if="currentGameMode === gameModes.singlePlayer" class="menuContainer">
        <h2>Selectionnez votre symbole</h2>
        <div class="dicesContainer">
          <button v-for="type in dataTypesArray" @click="emit('chooseType', type)" class="dice diceButton">{{ type }}</button>
        </div>
        <button @click="emit('chooseGameMode', 0)" class="goBack">Retourner au menu principal</button>
      </div>
    </div>
    <div id="typesContainer">
      <div class="rug">
        <div class="dice">{{ dataTypesArray[0] }}</div>
        <div class="dice">{{ dataTypesArray[1] }}</div>
      </div>
    </div>
    <div id="creditsContainer">
      <p>Createur => Reiner Knizia</p>
      <p>Editeur => Gigamic</p>
      <p>Developpeur => LuckyFox</p>
    </div>
    <div id="shopContainer">
      <a href="https://www.gigamic.com/jeux-de-voyage/511-detrak-3421271117919.html" target="_blank">Acheter la version physique</a>
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
  top: 50%;
  left: 10%;
  height: 90vh;
  width: 5vw;
  background-image: url("/img/pencil.webp");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  transform: translateY(-50%) rotate(190deg);
  filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.3));
}

#sheetContainer {
  position: relative;
  width: 50vw;
  aspect-ratio: 1/1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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

#sheetContainer h1{
  text-align: center;
  font-size: calc(50vw / 5)
}

#sheetContainer h2{
  text-align: center;
  font-size: calc(15vw / 5)
}

#sheetContainer .menuContainer{
  margin-top: 5vh;
  height: 20vw;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

#sheetContainer .dicesContainer{
  margin-top: 2vw;
  padding: 0 3vw;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

#sheetContainer #buttonsContainer{
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
}

#sheetContainer #buttonsContainer button, #sheetContainer #buttonsContainer a{
  font-size: calc(13vw / 6);
  font-family: 'Nanum Pen Script', cursive;
  text-decoration: none;
  background: none;
  border: none;
  color: black;
  cursor: pointer;
}

#sheetContainer #buttonsContainer button:disabled{
  color: gray;
  cursor: not-allowed;
}

#sheetContainer #buttonsContainer button:not([disabled]):hover, #sheetContainer #buttonsContainer a:hover{
  text-decoration: underline;
}

#typesContainer{
  position: absolute;
  bottom: 5%;
  right: 3%;
  width: 15vw;
  height: 40vh;
  color: black;
  padding: 0.5rem;
  background-color: #006200;
  border-radius:15px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  transform: rotate(10deg);
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

.dice{
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

.diceButton{
  width: calc(35vw / 7);
  font-size: calc(35vw / 8);
  font-family: 'Nanum Pen Script', cursive;
  border: none;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.diceButton:not(:hover){
  opacity: 0.5;
}

.goBack{
  display: block;
  margin: auto;
  background: none;
  border: none;
  text-align: center;
  font-family: 'Nanum Pen Script', cursive;
  font-size: calc(18vw / 10);
  cursor: pointer;
}

.goBack:hover{
  text-decoration: underline;
}

#typesContainer .dice:first-child{
  transform: rotate(10deg);
}

#typesContainer .dice:last-child{
  transform: rotate(-25deg);
}

#creditsContainer{
  position: absolute;
  right: 2%;
  top: 5%;
  background-color: white;
  padding: 1rem 3rem;
  font-size: calc(15vw / 10);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  transform: rotate(2deg);
}

#creditsContainer p{
  text-align: center;
}

#shopContainer{
  position: absolute;
  right: 1%;
  top: 30%;
  background-color: white;
  padding: 1rem 3rem;
  font-size: calc(15vw / 10);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  transform: rotate(-2deg);
}

#shopContainer a{
  text-align: center;
  color: black;
  text-decoration: none;
}

#shopContainer a:hover{
  text-decoration: underline;
}
</style>