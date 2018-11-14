<template>
  <div data-testid="saveGame">
    <button type="button" @click="saveState">Save</button>
    <textarea v-if="showGameState" v-model="currentState" data-testid="exportGameTextarea" />
    <button v-if="showGameState" type="button" @click="hideState">Close</button>
  </div>
</template>

<script>
export default {
  props: ['gameState'],
  data() {
    return {
      currentState: '',
      showGameState: false,
    };
  },
  methods: {
    saveState() {
      if (this.gameState) {
        this.showGameState = true;
        this.currentState = JSON.stringify(this.gameState);
      }
    },
    hideState() {
      this.showGameState = false;
    },
  },
};
</script>
