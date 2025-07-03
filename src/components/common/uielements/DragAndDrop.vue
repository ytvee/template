<template>
  <div class="drag-and-drop" :class="{ active: isDragOver }" @drop.prevent="dropHandler" @dragover.prevent="dragoverHandler" @dragenter.prevent="dragoverHandler" @dragend.prevent="dragendHandler" @dragleave.prevent="dragendHandler" @click="addTrackButtonHandler">Drag and Drop audio file</div>
</template>

<script>
export default {
  name: "DragAndDrop",
  data() {
    return {
      isDragOver: false,
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
      this.$eventBus.emit("drag-and-drop-files-chosen", files);
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
      const input = document.createElement("input");
      input.multiple = true;
      input.type = "file";
      const changeCallback = () => {
        // const file = input.files[0]; //TODO: make possible multiple files
        this.emitFiles([...input.files]);
      };
      input.addEventListener("change", changeCallback);
      input.click();
    },
  },
};
</script>

<style scoped>
.drag-and-drop {
  /* todo: need to refactor variables */
  width: var(--sound-splitter-main-left-column-width);
  height: 100px;
  border-radius: var(--sound-splitter-default-border-radius);
  border: 2px dashed rgba(75, 74, 74, 0.47);
  background: rgba(103, 103, 103, 0.1);

  padding: var(--large-padding);
  display: flex;

  align-items: center;
  justify-content: center;
  cursor: pointer;

  color: var(--sound-splitter-color-grey-2);
  font-weight: var(--sound-splitter-font-weight-semi-bold);
  font-size: var(--sound-splitter-font-size-3);
  text-align: center;

  transition: var(--default-transition);
}

.active {
  color: var(--sound-splitter-color-1);
  border-color: var(--sound-splitter-color-1);
}
</style>
