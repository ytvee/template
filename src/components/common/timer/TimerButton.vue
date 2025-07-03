<template>
    <button class="timer-button" :disabled="isDisabled" @click.stop="handleClick">
        <span>{{ label }}</span>
        <Timer v-if="isDisabled" :endTime="TIMER_BUTTON_WAITING_IN_SECONDS" :interval="TIMER_BUTTON_INTERVAL"
            :handleTimerCompletion="removeDisabled" />
    </button>
</template>

<script>
import Timer from './Timer.vue';

const TIMER_BUTTON_WAITING_IN_SECONDS = 10;
const TIMER_BUTTON_INTERVAL = 1;

export default {
    name: "TimerButton",
    components: { Timer },
    props: {
        label: {
            type: String,
            required: true,
        },
        onClick: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            isDisabled: true,
            TIMER_BUTTON_WAITING_IN_SECONDS,
            TIMER_BUTTON_INTERVAL,
        };
    },
    methods: {
        removeDisabled() {
            this.isDisabled = false;
        },
        updateDisabled() {
            this.isDisabled = true;
        },
        handleClick() {
            this.onClick();

            this.updateDisabled();
        },
    },
}
</script>

<style scoped>
.timer-button {
    outline: none;
    border: none;
    background: transparent;
    background-color: transparent;
    width: 100%;
    color: var(--ui-accent-bg, #36ABBB);
    display: flex;
    gap: 5px;
    justify-content: center;
    align-items: center;
    font-size: 12px;
}

.timer-button:hover {
    color: var(--ui-accent-hover-bg, #43d2e5);
    -webkit-text-fill-color: var(--ui-accent-hover-bg, #43d2e5);
}

.timer-button:focus {
    color: var(--ui-accent-hover-bg, #43d2e5);
    outline: none;
}
</style>