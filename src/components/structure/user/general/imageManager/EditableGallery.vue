<template>
  <div class="photo-insert">
    <div class="file-input-wrapper">
      <FileInput input-id="PhotoInsert" @event-file="eventFileHandler" />
    </div>
    <FileDisplay v-for="(file, index) in addedFilesArray" :key="index" :file="file" :is-removeable="true" @file-remove-event="addedfileRemoveEventHandler($event, index)" />
    <FileDisplay v-for="(file, index) in initialImages" :key="index" :file="file" :is-removeable="true" @file-remove-event="initialfileRemoveEventHandler($event, index)" />
  </div>
</template>

<script>
import FileInput from "./PhotoInsert/FileInput.vue";
import FileDisplay from "./PhotoInsert/FileDisplay.vue";
export default {
  name: "PhotoInsert",
  components: {
    FileInput,
    FileDisplay,
  },
  props: {
    initialImages: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      addedFilesArray: [],
    };
  },
  watch: {
    addedFilesArray: {
      handler(newAddedFilesArray) {
        this.$eventBus.emit("added-files-array-edited", newAddedFilesArray);
      },
      deep: true,
    },
  },
  mounted() {
    this.$eventBus.on("reset-editable-gallery-after-save-artist", this.resetGalleryEventHandler);
  },
  methods: {
    resetGalleryEventHandler() {
      this.addedFilesArray = [];
    },
    eventFileHandler(file) {
      if (this.isFileNotPresentedInArray(file)) {
        this.addedFilesArray.unshift(file);
      }
    },
    addedfileRemoveEventHandler(event, index) {
      this.addedFilesArray.splice(index, 1);
    },
    initialfileRemoveEventHandler(event, index) {
      this.$eventBus.emit("remove-image-from-gallery", index);
    },
    isFileNotPresentedInArray(file) {
      return !this.addedFilesArray.find((item) => {
        return item.name === file.name;
      });
    },
  },
};
</script>
<style scoped>
.photo-insert {
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(auto, 310px));
  justify-content: space-evenly;
  gap: 3.78%;
}
.file-input-wrapper {
  flex-basis: calc((100% - var(--horizontal-space-between-files) * 3) / 4);
  aspect-ratio: 310/280;
  min-height: 110px;
  display: flex;
  flex-direction: column;
}
</style>
