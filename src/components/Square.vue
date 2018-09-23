<template>
  <button :data-testid="testId" class="square" type="button">
    {{ value }}
  </button>
</template>

<script>
export default {
  props: ['testId', 'value'],
};
</script>
