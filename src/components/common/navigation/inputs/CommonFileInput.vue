<template>
  <div class="common-file-input">
    <input :id="getFileInputId()" :multiple="isMultipleFilesLoadingAllowed" type="file" :disabled="!isEnabled" @change="fileInputChangeHandler" />
    <label class="common-file-input-label" :class="{ enabled: isEnabled }" :for="getFileInputId()">
      <slot :for="getFileInputId()" />
    </label>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  props: {
    isEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    inputId: {
      type: String,
      default: "",
    },
    fileTypes: {
      type: Array,
      required: false,
      default: () => ["image/jpeg", "image/pjpeg", "image/png"],
    },
    isMultipleFilesLoadingAllowed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["event-file"],
  data() {
    return {
      // fileTypes: ["image/jpeg", "image/pjpeg", "image/png"],
    };
  },
  methods: {
    isFileTypeValid(file) {
      for (var i = 0; i < this.$props.fileTypes.length; i++) {
        if (file.type === this.$props.fileTypes[i]) {
          return true;
        }
      }
      return false;
    },
    fileInputChangeHandler(event) {
      let files = event.target.files;
      if (this.isAnyFileSelected(files)) {
        if (this.$props.isMultipleFilesLoadingAllowed) {
          this.validateFileExtensionAndEmitFilesArray(files);
        } else {
          this.validateFileExtensionAndEmitFirstFile(files);
        }
        event.target.value = null;
      }
    },
    isAnyFileSelected(files) {
      return files.length !== 0;
    },
    firstSelectedFile(files) {
      return files[0];
    },
    validateFileExtensionAndEmitFirstFile(files) {
      let file = this.firstSelectedFile(files);
      if (this.isFileTypeValid(file)) {
        this.$emit("event-file", file);
      } else {
        alert("The selected file extension is not allowed!");
      }
    },
    validateFileExtensionAndEmitFilesArray(files) {
      const [acceptedFiles, rejectedFiles] = _.partition(files, this.isFileTypeValid);
      const rejectedFilesString = JSON.stringify(rejectedFiles.map((file) => file.name));
      if (rejectedFiles.length) {
        alert(`Some added files were rejected due to their extensions: ${rejectedFilesString}`);
      }
      this.$emit("event-file", acceptedFiles);
    },

    getFileInputId() {
      return this.$props.inputId + "-file-input-id";
    },
  },
};
</script>
<style scoped>
.common-file-input {
  width: 100%;
  height: 100%;
}
input[type="file"] {
  display: none;
}
.common-file-input-label.enabled {
  cursor: pointer;
}
</style>
