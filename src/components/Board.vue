<template>
  <div :data-testid="testId" :class="className">
    <div class="table-row">
      <square test-id="topLeftSquare" :on-click="() => $emit('square-click', 0)" :value='squares[0]' :special-icons="specialIcons" />
      <square test-id="topMiddleSquare" :on-click="() => $emit('square-click', 1)" :value='squares[1]' :special-icons="specialIcons" />
      <square test-id="topRightSquare" :on-click="() => $emit('square-click', 2)" :value='squares[2]' :special-icons="specialIcons" />
    </div>
    <div class="table-row">
      <square test-id="centerLeftSquare" :on-click="() => $emit('square-click', 3)" :value='squares[3]' :special-icons="specialIcons" />
      <square test-id="centerMiddleSquare" :on-click="() => $emit('square-click', 4)" :value='squares[4]' :special-icons="specialIcons" />
      <square test-id="centerRightSquare" :on-click="() => $emit('square-click', 5)" :value='squares[5]' :special-icons="specialIcons" />
    </div>
    <div class="table-row">
      <square test-id="bottomLeftSquare" :on-click="() => $emit('square-click', 6)" :value='squares[6]' :special-icons="specialIcons" />
      <square test-id="bottomMiddleSquare" :on-click="() => $emit('square-click', 7)" :value='squares[7]' :special-icons="specialIcons" />
      <square test-id="bottomRightSquare" :on-click="() => $emit('square-click', 8)" :value='squares[8]' :special-icons="specialIcons" />
    </div>
  </div>
</template>

<script>
import Square from './Square.vue';

export default {
  components: {
    square: Square,
  },
  props: ['testId', 'className', 'squares', 'specialIcons'],
};
</script>
