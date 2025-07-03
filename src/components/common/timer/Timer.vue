<template>
    <div class="timer">
        <p class="number">{{ displayTime }}</p>
        <p class="title">{{ `s` }}</p>
    </div>
</template>

<script>
export default {
    name: "Timer",
    props: {
        endTime: {
            type: Number,
            required: true,
        },
        interval: {
            type: Number,
            required: true,
        },
        handleTimerCompletion: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            displayTime: this.endTime,
            delay: this.interval * 1000,
            endTimeFromNow: Math.floor(Date.now() / 1000) + this.endTime,
            timer: null,
        };
    },
    methods: {
        getTimeNowInSeconds() {
            return Math.floor(Date.now() / 1000);
        },
        endTimeAction() {
            const currentTime = this.getTimeNowInSeconds();

            if (this.endTimeFromNow > currentTime) {
                this.displayTime = this.endTimeFromNow - currentTime;

                return;
            };

            this.delay = null;
            this.handleTimerCompletion();
        },
        tick() {
            this.endTimeAction();
        },
    },
    mounted() {
        this.timer = setInterval(this.tick, this.delay);
    },
    beforeUnmount() {
        if (!this.timer) {
            return;
        };

        clearInterval(this.timer);
    }
}
</script>

<style scoped>
.timer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}
</style>