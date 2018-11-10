<template>
  <button :data-testid="testId" @click="onClick" :class="squareClasses" type="button">{{ value }}</button>
</template>

<script>
import { getSquareClasses } from '../helpers';

export default {
  props: ['value', 'testId', 'onClick', 'specialIcons'],
  computed: {
    squareClasses: function () {
      return getSquareClasses(this);
    },
  },
};
</script>
