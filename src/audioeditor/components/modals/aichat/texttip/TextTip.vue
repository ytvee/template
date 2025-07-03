<template>
  <div class="text-tip-container" @click="$emit('select', tip)">
    {{ tip }}
  </div>
</template>

<script>
export default {
  name: "TextTip",
  props: {
    tip: { type: String, required: true },
  },
  emits: ["select"],
};
</script>

<style scoped>
.text-tip-container {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  background: var(--transparent-light-05);
  border-radius: 28px;
  font-family: "Wix Madefor Text";
  font-weight: var(--small-font-weight);
  font-size: var(--small-font-size);
  color: var(--ai-chat-button-background-color-1);
  white-space: nowrap;
  cursor: pointer;
  transition: var(--default-transition);
}
.text-tip-container:hover {
  color: white;
  transition: var(--default-transition);
}
</style>
