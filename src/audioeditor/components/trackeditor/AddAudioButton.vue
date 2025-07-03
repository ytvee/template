<template>
  <div class="audio-editor-button" @click="addTrackButtonHandler">
    <span>{{ content }}</span>
  </div>
</template>

<script>
export default {
  name: "AddAudioButton",
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  emits: ["add-audio-button-file-chosen"],
  methods: {
    addTrackButtonHandler() {
      const input = document.createElement("input");
      input.type = "file";
      const changeCallback = () => {
        const file = input.files[0];
        this.$emit("add-audio-button-file-chosen", file);
      };
      input.addEventListener("change", changeCallback);
      input.click();
    },
  },
};
</script>

<style scoped>
.add-audio-button-content {
  min-height: 45px;
  min-width: 164px;
  padding: var(--default-padding);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--regular-block-gap);
}
</style>
