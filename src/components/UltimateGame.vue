<template>
  <div class="table ultimate-game">
    <div class="table-row">
      <div class="table-cell">
        <div>
          <board :squares="getSquaresForBoard(0)" test-id="topLeftBoard" :class-name="getBoardClasses(0)"
                 :special-icons="state.specialIcons" @square-click="squareIndex => onSquareClick(0, squareIndex)"
          />
          <board :squares="getSquaresForBoard(1)" test-id="topMiddleBoard" :class-name="getBoardClasses(1)"
                 :special-icons="state.specialIcons" @square-click="squareIndex => onSquareClick(1, squareIndex)"
          />
          <board :squares="getSquaresForBoard(2)" test-id="topRightBoard" :class-name="getBoardClasses(2)"
                 :special-icons="state.specialIcons" @square-click="squareIndex => onSquareClick(2, squareIndex)"
          />
        </div>
        <div>
          <board :squares="getSquaresForBoard(3)" test-id="centerLeftBoard" :class-name="getBoardClasses(3)"
                 :special-icons="state.specialIcons" @square-click="squareIndex => onSquareClick(3, squareIndex)"
          />
          <board :squares="getSquaresForBoard(4)" test-id="centerMiddleBoard" :class-name="getBoardClasses(4)"
                 :special-icons="state.specialIcons" @square-click="squareIndex => onSquareClick(4, squareIndex)"
          />
          <board :squares="getSquaresForBoard(5)" test-id="centerRightBoard" :class-name="getBoardClasses(5)"
                 :special-icons="state.specialIcons" @square-click="squareIndex => onSquareClick(5, squareIndex)"
          />
        </div>
        <div>
          <board :squares="getSquaresForBoard(6)" test-id="bottomLeftBoard" :class-name="getBoardClasses(6)"
                 :special-icons="state.specialIcons" @square-click="squareIndex => onSquareClick(6, squareIndex)"
          />
          <board :squares="getSquaresForBoard(7)" test-id="bottomMiddleBoard" :class-name="getBoardClasses(7)"
                 :special-icons="state.specialIcons" @square-click="squareIndex => onSquareClick(7, squareIndex)"
          />
          <board :squares="getSquaresForBoard(8)" test-id="bottomRightBoard" :class-name="getBoardClasses(8)"
                 :special-icons="state.specialIcons" @square-click="squareIndex => onSquareClick(8, squareIndex)"
          />
        </div>
      </div>
      <div class="game-info table-cell table-large-padding max-height">
        <status
          :description="winner ? 'Winner' : 'Next player'"
          :player="winner || state.nextPlayer"
          :special-icons="state.specialIcons"
        />
        <br>
        <button type="button" @click="toggleSpecialIcons">Vue vs. React?</button>

        <br><br>

        <span>
          <load-game :handle-load-game-click="handleLoadGameClick" />
          <br>
        </span>

        <br>

        <ol>
          <li v-for="(historyItem, moveNumber) in state.history" :key="moveNumber">
            <time-travel-button :on-click="jumpTo.bind(this, moveNumber)" :move-index="moveNumber"
                                :current-step="state.pointInHistory"
            />
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import Board from './Board.vue';
import Status from './Status.vue';
import TimeTravelButton from './TimeTravelButton.vue';
import LoadGame from './LoadGame.vue';
import Ultimate from '../game';
import { calculateUltimateWinner, getColorClass } from '../helpers';

export default {
  components: {
    board: Board,
    status: Status,
    'time-travel-button': TimeTravelButton,
    'load-game': LoadGame,
  },
  data() {
    return {
      state: Ultimate.getInitialState(),
      counter: 0,
    };
  },
  computed: {
    winner() {
      const { history, pointInHistory } = this.state;
      const { boards } = history[pointInHistory];

      return calculateUltimateWinner(boards);
    },
  },
  methods: {
    getSquaresForBoard(boardIndex) {
      const { history, pointInHistory } = this.state;
      const { boards } = history[pointInHistory];

      return boards[boardIndex].squares;
    },
    onSquareClick(boardIndex, squareIndex) {
      this.state = Ultimate.playSquare(this.state, { boardIndex, squareIndex });
    },
    getBoardClasses(boardIndex) {
      const { history, pointInHistory } = this.state;
      const { boards } = history[pointInHistory];

      return `table-cell table-board-border ${getColorClass(boards[boardIndex])}`;
    },
    toggleSpecialIcons() {
      this.state.specialIcons = !this.state.specialIcons;
    },
    shouldHighlight(moveNumber) {
      const { pointInHistory } = this.state;
      return pointInHistory === moveNumber;
    },
    jumpTo(pointInHistory) {
      this.state = Ultimate.timeTravel(this.state, { pointInHistory });
    },
    getHistoryButtonDescription(moveNumber) {
      return moveNumber === 0 ? 'aaGo to game start' : `Go to move ${moveNumber}`;
    },
    handleLoadGameClick(newState) {
      this.state = newState;
    },
  },
};
</script>
