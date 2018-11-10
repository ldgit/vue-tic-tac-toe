<template>
  <button type="button" :class="getCurrentClass()" @click="onClick">{{ description }}</button>
</template>

<script>
export default {
  props: ['moveIndex', 'onClick', 'currentStep'],
  computed: {
    description() {
      return this.moveIndex ? `Go to move ${this.moveIndex}` : 'Go to game start';
    },
  },
  methods: {
    getCurrentClass() {
      return this.currentStep === this.moveIndex ? 'current-move-button' : 'move-button';
    },
  },
};
</script>
