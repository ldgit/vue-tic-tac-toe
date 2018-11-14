<template>
    <div data-testid="saveGame">
        <button type="button" @click="saveState">Save</button>
        <textarea data-testid="exportGameTextarea" v-if="showGameState" v-model="currentState" />
        <button type="button" v-if="showGameState" @click="hideState">Close</button>
    </div>
</template>

<script>
export default {
    props: ['gameState'],
    data() {
        return { 
            currentState: '',
            showGameState: false,
        };
    },
    methods: {
        saveState() {
            if (this.gameState) {
                this.showGameState = true;
                this.currentState = JSON.stringify(this.gameState);
            }
        },
        hideState() {
            this.showGameState = false;
        },
    },
}
</script>

