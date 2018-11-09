<template>
  <button :data-testid="testId" @click="onClick" class="square" type="button"><slot></slot></button>
</template>

<script>
export default {
  props: ['testId', 'onClick'],
};
</script>
