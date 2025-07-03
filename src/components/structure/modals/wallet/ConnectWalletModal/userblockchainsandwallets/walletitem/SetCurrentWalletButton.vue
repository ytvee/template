<template>
  <div class="set-current-wallet-button">
    <div v-if="isCurrentWallet" class="current">CURRENT</div>
    <div v-else class="set-current" @click="clickSetCurrentHandler">Set current</div>
  </div>
</template>

<script>
export default {
  name: "SetCurrentWalletButton",
  props: {
    isCurrentWallet: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["set-current"],
  methods: {
    clickSetCurrentHandler() {
      this.$emit("set-current");
    },
  },
};
</script>

<style scoped>
.set-current-wallet-button {
  width: 70px;
  height: 24px;
  flex-shrink: 0;
  text-align: center;

  white-space: nowrap;
  font-size: var(--smallest-font-size);
  font-weight: var(--regular-font-weight);

  display: flex;
  justify-content: center;
  align-items: center;
}
.set-current:active {
  opacity: 50%;
  transition: var(--default-transition);
}
.set-current {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  background: var(--gradient-card-dark);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  cursor: pointer;
  transition: var(--default-transition);
}
.current {
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  background: var(--gradient-card-dark);
  border-radius: var(--large-border-radius);
  user-select: none;
}
</style>
