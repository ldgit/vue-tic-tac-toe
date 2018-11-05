<template>
  <div class="game">
    <div class="game-board">
      <board :squares="squares" :on-click="handleSquareClick"/>
    </div>
    <div class="game-info">
      <status :description="description" :player="player" />
    </div>
  </div>
</template>

<script>
import Board from './Board.vue';
import Status from './Status.vue';
import { calculateWinner } from '../helpers';

export default {
  components: {
    board: Board,
    status: Status,
  },
  data: function () {
    return {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  },
  methods: {
    handleSquareClick: function (squareIndex) {
      const { squares, xIsNext } = this;
      if (calculateWinner(squares) || squares[squareIndex]) {
        return;
      }

      const newSquares = squares.slice();

      newSquares[squareIndex] = xIsNext ? 'X' : 'O';
      
      this.squares = newSquares;
      this.xIsNext = !xIsNext;
    },
  },
  computed: {
    description: function () {
      return calculateWinner(this.squares) ? 'Winner' : 'Next player';
    },
    player: function () {
      const { squares, xIsNext } = this;
      return calculateWinner(squares) || (xIsNext ? 'X' : 'O');
    },
  }
};
</script>
