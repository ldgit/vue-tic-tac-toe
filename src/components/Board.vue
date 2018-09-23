<template>
  <div :data-testid="testId" :class="className">
    <div className="table-row">
      <square test-id="topLeftSquare" :value="squares[0]" />
      <square test-id="topMiddleSquare" :value="squares[1]" />
      <square test-id="topRightSquare" :value="squares[2]" />
    </div>
    <div className="table-row">
      <square test-id="centerLeftSquare" :value="squares[3]" />
      <square test-id="centerMiddleSquare" :value="squares[4]" />
      <square test-id="centerRightSquare" :value="squares[5]" />
    </div>
    <div className="table-row">
      <square test-id="bottomLeftSquare" :value="squares[6]" />
      <square test-id="bottomMiddleSquare" :value="squares[7]" />
      <square test-id="bottomRightSquare" :value="squares[8]" />
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
