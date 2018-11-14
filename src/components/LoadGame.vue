<template>
  <div data-testid="loadGame">
    <button type="button" @click="openLoadDialog">Load</button>
    <textarea v-if="showLoadGameDialog" v-model.lazy="gameToLoad" data-testid="importGameTextarea" />
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
  },
};
</script>
