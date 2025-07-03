<template>
  <div class="drag-and-drop" :class="{ active: isDragOver }" @drop.prevent="dropHandler" @dragover.prevent="dragoverHandler" @dragenter.prevent="dragoverHandler" @dragend.prevent="dragendHandler" @dragleave.prevent="dragendHandler" @click="addTrackButtonHandler">New Track +</div>
</template>

<script>
import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";
import { DialogTemplateNames } from "@/data/modal/constants";

export default {
  name: "DragAndDrop",
  props: {
    position: {
      type: String,
      required: false,
      default: "",
    },
  },
  emits: ["drag-and-drop-files-chosen"],
  data() {
    return {
      isDragOver: false,
      AUDIO_EDITOR_CONFIGURATION,
    };
  },
  methods: {
    dragoverHandler() {
      this.isDragOver = true;
    },
    dragendHandler() {
      this.isDragOver = false;
    },
    emitFiles(files) {
      this.$emit("drag-and-drop-files-chosen", { files });
    },
    dropHandler(event) {
      this.isDragOver = false;
      const files = [];
      if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        [...event.dataTransfer.items].forEach((item) => {
          // If dropped items aren't files, reject them
          if (item.kind === "file") {
            files.push(item.getAsFile());
          }
        });
      } else {
        files.push(...event.dataTransfer.files);
      }
      this.emitFiles(files); //TODO: many files
    },
    addTrackButtonHandler() {
      this.$modal.openModalWithName(DialogTemplateNames.AI_CHAT, {}, { isNonClosableByClickOnPeriphery: true });
    },
  },
};
</script>

<style scoped>
.drag-and-drop {
  width: var(--audio-editor-main-left-column-width);
  height: v-bind("AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackHeight+'px'");
  border-radius: var(--audio-editor-track-mixing-tools-border-radius);
  background: var(--audio-editor-color-translucent-white-2);

  padding: var(--large-padding);
  display: flex;

  align-items: center;
  justify-content: center;
  cursor: pointer;

  font-family: var(--audio-editor-font-large-family);
  font-size: var(--audio-editor-font-large-size);
  font-weight: var(--regular-font-weight);
  color: var(--audio-editor-color-translucent-white-4);

  text-align: center;

  transition: var(--default-transition);
}
.drag-and-drop:hover {
  color: var(--audio-editor-color-white);
}

.active {
  color: var(--audio-editor-color-white);
}
</style>
