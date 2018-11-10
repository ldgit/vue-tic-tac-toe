<template>
  <button :data-testid="testId" :class="squareClasses" type="button" @click="onClick">{{ value }}</button>
</template>

<script>
import { getSquareClasses } from '../helpers';

export default {
  props: ['value', 'testId', 'onClick', 'specialIcons'],
  computed: {
    squareClasses() {
      return getSquareClasses(this);
    },
  },
};
</script>
