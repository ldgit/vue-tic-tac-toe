<template>
  <div data-testid="loadGame">
    <button type="button" @click="openLoadDialog">Load</button>
    <!-- For some reason if using v-model changing textarea value via unit tests does not result in a new value inside
    gameToLoad property. That is why @change and a setGameToLoad event handler are used instead. -->
    <textarea v-if="showLoadGameDialog" data-testid="importGameTextarea" @change="setGameToLoad" />
    <br>
    <button v-if="showLoadGameDialog" type="button" @click="loadTheGame">Load game</button>
    <button v-if="showLoadGameDialog" type="button" @click="hideTextArea">Close</button>
  </div>
</template>

<script>
function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
}

export default {
  props: ['handleLoadGameClick'],
  data() {
    return {
      gameToLoad: '',
      showLoadGameDialog: false,
    };
  },
  methods: {
    openLoadDialog() {
      this.showLoadGameDialog = true;
    },
    hideTextArea() {
      this.showLoadGameDialog = false;
    },
    loadTheGame() {
      if (!isValidJSON(this.gameToLoad)) {
        alert('Invalid save game JSON');
        return;
      }
      this.handleLoadGameClick(JSON.parse(this.gameToLoad));
      this.showLoadGameDialog = false;
    },
    setGameToLoad(event) {
      this.gameToLoad = event.target.value;
    },
  },
};
</script>
