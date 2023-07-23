<script setup>
import {ref} from "vue";
import Game from "./components/Game.vue";
import {dataTypesArray} from "./constants/dataTypes.js";
import {gameModes} from "./constants/gameModes.js";
import Menu from "./components/Menu.vue";

const currentChoosenType = ref('');
const currentGameMode = ref(0);
</script>

<template>
  <Game v-if="currentChoosenType && currentGameMode" :choosen-type="currentChoosenType" :game-mode="currentGameMode" />
  <Menu v-else @choose-type="choosenType => currentChoosenType = choosenType" @choose-game-mode="choosenGameMode => currentGameMode = choosenGameMode" :current-game-mode="currentGameMode"/>
</template>

<style scoped>

</style>
