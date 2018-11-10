<template>
  <div class="game">
    <div class="game-board">
      <board :squares="history[currentStep].squares" @square-click="handleSquareClick" />
    </div>
    <div class="game-info">
      <status :description="description" :player="player" />
      <ol>
        <li v-for="(item, moveIndex) in history" :key="moveIndex">
          <time-travel-button
            :move-index="moveIndex"
            :current-step="currentStep"
            :on-click="() => { jumpTo(moveIndex) }"
          />
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import Board from './Board.vue';
import Status from './Status.vue';
import TimeTravelButton from './TimeTravelButton.vue';
import { calculateWinner } from '../helpers';

export default {
  components: {
    board: Board,
    status: Status,
    'time-travel-button': TimeTravelButton,
  },
  data() {
    return {
      history: [
        { squares: Array(9).fill(null) },
      ],
      xIsNext: true,
      currentStep: 0,
    };
  },
  computed: {
    description: function description() {
      const { history, currentStep } = this;
      const { squares } = history[currentStep];

      return calculateWinner(squares) ? 'Winner' : 'Next player';
    },
    player: function player() {
      const { history, xIsNext, currentStep } = this;
      const { squares } = history[currentStep];

      return calculateWinner(squares) || (xIsNext ? 'X' : 'O');
    },
  },
  methods: {
    handleSquareClick: function handleSquareClick(squareIndex) {
      const { history, xIsNext, currentStep } = this;
      const gameHistory = history.slice(0, currentStep + 1);
      const { squares } = gameHistory[currentStep];

      if (calculateWinner(squares) || squares[squareIndex]) {
        return;
      }

      const newSquares = squares.slice();

      newSquares[squareIndex] = xIsNext ? 'X' : 'O';
      gameHistory.push({ squares: newSquares });

      this.history = gameHistory;
      this.xIsNext = !xIsNext;
      this.currentStep += 1;
    },
    jumpTo: function jumpTo(stepNumber) {
      this.currentStep = stepNumber;
      this.xIsNext = stepNumber % 2 === 0;
    },
  },
};
</script>
