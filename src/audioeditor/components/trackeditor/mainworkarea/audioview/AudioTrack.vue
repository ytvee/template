<template>
  <div class="audio-track" @drop.prevent="dropHandler" @dragover.prevent="dragoverHandler" @dragenter.prevent="dragoverHandler" @dragend.prevent="dragendHandler" @dragleave.prevent="dragleaveHandler">
    <DragAndDropDummy v-if="isDragOver" :navigation-model="navigationModel" />
  </div>
</template>

<script>
import DragAndDropDummy from "./audiotrack/DragAndDropDummy.vue";
export default {
  name: "AudioTrack",
  components: {
    DragAndDropDummy,
  },
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
    track: {
      type: Object,
      required: true,
    },
  },
  emits: ["drag-and-drop-segment-files-chosen"],
  data() {
    return {
      isDragOver: false,
    };
  },
  methods: {
    /* drag and drop */
    dragoverHandler(event) {
      this.isDragOver = true;
      this.$eventBus.emit("drag-and-drop-dummy-mouse-move", event);
    },
    dragendHandler() {
      this.isDragOver = false;
    },
    dragleaveHandler() {
      this.isDragOver = false;
    },
    emitFile(file, startPosition) {
      this.$emit("drag-and-drop-segment-files-chosen", { file, trackId: this.$props.track.id, startPosition });
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
      this.emitFile(files[0], this.$props.navigationModel.cursorCoordinates.x);
      // dragAndDropSegmentHandler({file: files[0], trackId: this.$props.track.id, startPosition: this.$props.navigationModel.cursorCoordinates.x}); //TODO: many files
    },

    /* /drag and drop */
  },
};
</script>

<style scoped>
.audio-track {
  width: 100%;
  height: 100%;

  display: flex;
  position: relative;
}
</style>
