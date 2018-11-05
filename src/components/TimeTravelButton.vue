<template>
  <button type="button" @click="onClick" :class="getCurrentClass()">{{ description }}</button>
</template>

<script>
export default {
  props: ['moveIndex', 'onClick', 'currentStep'],
  methods: {
    getCurrentClass: function() {
      return this.currentStep === this.moveIndex ? 'current-move-button' : 'move-button';
    },
  },
  computed: {
		description: function () {
			return this.moveIndex ? `Go to move ${this.moveIndex}` : 'Go to game start';
		},
  },
};
</script>
