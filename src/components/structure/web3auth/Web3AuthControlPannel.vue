<template>
  <div class="web3auth-control-pannel">
    Multi-factor authentication
    <button>Enable multi-factor authentication</button>
    <div class="line-green" />
  </div>
</template>

<script>
export default {
  name: "Web3AuthControlPannel",
};
</script>

<style scoped>
.web3auth-control-pannel {
  border: 1px solid var(--color-accent-primary);
  border-radius: var(--small-border-radius);
  padding: var(--regular-padding);
  color: var(--color-light);
}
.line-green {
  border-top: 2px solid var(--color-gray-light);
  margin-bottom: 25px;
}
</style>
