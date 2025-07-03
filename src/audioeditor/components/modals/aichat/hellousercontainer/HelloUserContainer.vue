<template>
  <div
    class="hello-user-container"
    :style="{ top: isFullPage ? '35%' : '30%' }"
  >
    What sound are you going for?
  </div>
</template>

<script>
export default {
  name: "HelloUserContainer",
  props: {
    isFullPage: { type: Boolean, required: true },
  },
};
</script>

<style scoped>
.hello-user-container {
  width: 768px;
  text-align: center;
  font-family: var(--chat-font-family);
  font-weight: var(--small-font-weight);
  font-size: var(--very-large-font-size);
  color: var(--ai-chat-color-white);
}
</style>
