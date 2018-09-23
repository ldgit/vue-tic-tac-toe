<template>
  <div class="game">
    <div class="game-board">
      <board :squares="squares"/>
    </div>
    <div class="game-info">
      Here be some game info, arrrr!
    </div>
  </div>
</template>

<script>
import Board from './Board.vue';

export default {
  components: {
    board: Board,
  },
  data: function () {
    return {
      squares: Array(9).fill(null),
    };
  },
};
</script>
