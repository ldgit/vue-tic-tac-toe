<template>
  <div class="game-status" data-testid="gameStatus">
    {{ description }}: <button :class="playerIconClass" type="button" disabled>{{ player }}</button>
  </div>
</template>

<script>
import { getPlayerEmblemClasses } from '../helpers';

export default {
  props: ['description', 'player', 'specialIcons'],
  computed: {
    playerIconClass: function () {
      const { player, specialIcons } = this;
      
      return getPlayerEmblemClasses({ value: player, specialIcons });
    },
  },
};
</script>
