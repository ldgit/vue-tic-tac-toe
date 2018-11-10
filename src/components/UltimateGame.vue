<template>
  <div class="table ultimate-game">
    <div class="table-row">
      <div class="table-cell">
        <div>
          <board :squares="getSquaresForBoard(0)" v-on:square-click="squareIndex => onSquareClick(0, squareIndex)" test-id="topLeftBoard" 
            :class-name="getBoardClasses(0)" />
          <board :squares="getSquaresForBoard(1)" v-on:square-click="squareIndex => onSquareClick(1, squareIndex)" test-id="topMiddleBoard" 
            :class-name="getBoardClasses(1)" />
          <board :squares="getSquaresForBoard(2)" v-on:square-click="squareIndex => onSquareClick(2, squareIndex)" test-id="topRightBoard" 
            :class-name="getBoardClasses(2)" />
        </div>
        <div>
          <board :squares="getSquaresForBoard(3)" v-on:square-click="squareIndex => onSquareClick(3, squareIndex)" test-id="centerLeftBoard" 
            :class-name="getBoardClasses(3)" />
          <board :squares="getSquaresForBoard(4)" v-on:square-click="squareIndex => onSquareClick(4, squareIndex)" test-id="centerMiddleBoard" 
            :class-name="getBoardClasses(4)" />
          <board :squares="getSquaresForBoard(5)" v-on:square-click="squareIndex => onSquareClick(5, squareIndex)" test-id="centerRightBoard" 
            :class-name="getBoardClasses(5)" />
        </div>
        <div>
          <board :squares="getSquaresForBoard(6)" v-on:square-click="squareIndex => onSquareClick(6, squareIndex)" test-id="bottomLeftBoard" 
            :class-name="getBoardClasses(6)" />
          <board :squares="getSquaresForBoard(7)" v-on:square-click="squareIndex => onSquareClick(7, squareIndex)" test-id="bottomMiddleBoard" 
            :class-name="getBoardClasses(7)" />
          <board :squares="getSquaresForBoard(8)" v-on:square-click="squareIndex => onSquareClick(8, squareIndex)" test-id="bottomRightBoard" 
            :class-name="getBoardClasses(8)" />
        </div>
      </div>
      <div class="game-info table-cell table-large-padding max-height">
        <status
          :description="winner ? 'Winner' : 'Next player'"
          :player="winner || state.nextPlayer"
          :special-icons="state.specialIcons"
        />
        <br />
        <!-- TODO: Enable this -->
        <button type="button" @click="() => 'this.toggleSpecialIcons'">Vue vs. React?</button>
        <br /><br />
        
        <br />
        <ol>
          <!-- TODO: History goes here -->
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import Board from './Board.vue';
import Status from './Status.vue';
import Ultimate from '../game';
import { calculateUltimateWinner, getColorClass } from '../helpers';

export default {
  data: function () {
    return {
      state: Ultimate.getInitialState(),
      counter: 0,
    };
  },
  components: {
    board: Board,
    status: Status,
  },
  methods: {
    getSquaresForBoard: function (boardIndex) {
      const { history, pointInHistory } = this.state;
      const { boards } = history[pointInHistory];

      return boards[boardIndex].squares;
    },
    onSquareClick: function (boardIndex, squareIndex) {
      this.state = Ultimate.playSquare(this.state, { boardIndex, squareIndex });
    },
    getBoardClasses: function (boardIndex) {
      const { history, pointInHistory } = this.state;
      const { boards } = history[pointInHistory];

      return `table-cell table-board-border ${getColorClass(boards[boardIndex])}`;
    },
  },
  computed: {
    winner: function () {
      const { history, pointInHistory } = this.state;
      const { boards } = history[pointInHistory];

      return calculateUltimateWinner(boards);
    },
  },
}
</script>
