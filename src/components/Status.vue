<template>
  <div className="game-status" data-testid="gameStatus">
    {{ description }}: <button :class=playerIconClass type="button" disabled>{{ player }}</button>
  </div>
</template>

<script>
export default {
  props: ['description', 'playerIconClass', 'player'],
};
</script>
