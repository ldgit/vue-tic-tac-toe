<template>
  <div :data-testid="testId" :class="className">
    <div className="table-row">
      <square test-id="topLeftSquare" :on-click="() => onSquareClick(0)">
        {{ squares[0] }}
      </square>
      <square test-id="topMiddleSquare" :on-click="() => onSquareClick(1)">
        {{ squares[1] }}
      </square>
      <square test-id="topRightSquare" :on-click="() => onSquareClick(2)">
        {{ squares[2] }}
      </square>
    </div>
    <div className="table-row">
      <square test-id="centerLeftSquare" :on-click="() => onSquareClick(3)">
        {{ squares[3] }}
      </square>
      <square test-id="centerMiddleSquare" :on-click="() => onSquareClick(4)">
        {{ squares[4] }}
      </square>
      <square test-id="centerRightSquare" :on-click="() => onSquareClick(5)">
        {{ squares[5] }}
      </square>
    </div>
    <div className="table-row">
      <square test-id="bottomLeftSquare" :value="squares[6]" :on-click="() => onSquareClick(6)">
        {{ squares[6] }}
      </square>
      <square test-id="bottomMiddleSquare" :value="squares[7]" :on-click="() => onSquareClick(7)">
        {{ squares[7] }}
      </square>
      <square test-id="bottomRightSquare" :value="squares[8]" :on-click="() => onSquareClick(8)">
        {{ squares[8] }}
      </square>
    </div>
  </div>
</template>

<script>
import Square from './Square.vue';

export default {
  components: {
    square: Square,
  },
  props: ['testId', 'className', 'squares', 'onClick'],
  methods: {
    onSquareClick: function (squareIndex) {
      this.onClick(squareIndex);
    },
  },
};
</script>
