<template>
  <div class="support-buttons">
    <RefreshButton />
    <TextTip
      v-for="(tip, idx) in messageTips"
      :key="idx"
      :tip="tip"
      @select="$emit('select-tip', $event)"
    />
  </div>
</template>

<script>
import RefreshButton from "@audioeditor/components/modals/aichat/refreshbutton/RefreshButton.vue";
import TextTip from "@audioeditor/components/modals/aichat/texttip/TextTip.vue";

export default {
  name: "SupportButtons",
  components: { RefreshButton, TextTip },
  props: {
    messageTips: { type: Array, required: true },
  },
  emits: ["select-tip"],
};
</script>

<style scoped>
.support-buttons {
  display: none !important;
  margin-left: 25px;
  width: 100%;
  display: flex;
  gap: var(--small-block-gap);
  overflow-x: auto;
  overflow-y: hidden;
  user-select: none;
}

.support-buttons,
.support-buttons > div {
  opacity: 0.5;
  pointer-events: none;
}
</style>
