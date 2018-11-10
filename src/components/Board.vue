<template>
  <div :data-testid="testId" :class="className">
    <div class="table-row">
      <square test-id="topLeftSquare" :on-click="() => $emit('square-click', 0)">{{ squares[0] }}</square>
      <square test-id="topMiddleSquare" :on-click="() => $emit('square-click', 1)">{{ squares[1] }}</square>
      <square test-id="topRightSquare" :on-click="() => $emit('square-click', 2)">{{ squares[2] }}</square>
    </div>
    <div class="table-row">
      <square test-id="centerLeftSquare" :on-click="() => $emit('square-click', 3)">{{ squares[3] }}</square>
      <square test-id="centerMiddleSquare" :on-click="() => $emit('square-click', 4)">{{ squares[4] }}</square>
      <square test-id="centerRightSquare" :on-click="() => $emit('square-click', 5)">{{ squares[5] }}</square>
    </div>
    <div class="table-row">
      <square test-id="bottomLeftSquare" :on-click="() => $emit('square-click', 6)">{{ squares[6] }}</square>
      <square test-id="bottomMiddleSquare" :on-click="() => $emit('square-click', 7)">{{ squares[7] }}</square>
      <square test-id="bottomRightSquare" :on-click="() => $emit('square-click', 8)">{{ squares[8] }}</square>
    </div>
  </div>
</template>

<script>
import Square from './Square.vue';

export default {
  components: {
    square: Square,
  },
  props: ['testId', 'className', 'squares'],
};
</script>
