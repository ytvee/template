<template>
  <label
    :for="getFileInputId()"
    class="button change-cover-button change-cover-button-dark"
    :class="{
      [theme[themeType]]: themeType,
    }"
  >
    <span v-show="!isWithCover"> Upload cover image </span>
    <span v-show="isWithCover"> Change cover image </span>
  </label>
  <input :id="getFileInputId()" ref="fileInput" type="file" @change="fileInputChangeHandler" />
</template>

<script>
export default {
  name: "FollowButton",
  components: {},
  props: {
    themeType: {
      type: String,
      required: true,
    },
    isWithCover: {
      type: Boolean,
      required: false,
      default: false,
    },
    inputId: {
      type: String,
      required: true,
    },
  },
  // emits: ["event-file"],
  data() {
    return {
      theme: {
        light: "change-cover-button-light",
        dark: "change-cover-button-dark",
      },
      fileTypes: ["image/jpeg", "image/pjpeg", "image/png"],
    };
  },
  methods: {
    isFileTypeValid(file) {
      for (var i = 0; i < this.fileTypes.length; i++) {
        if (file.type === this.fileTypes[i]) {
          return true;
        }
      }
      return false;
    },
    fileInputChangeHandler(event) {
      let files = event.target.files;
      if (this.isAnyFileSelected(files)) {
        this.validateFileExtensionAndEmit(files);
      }
    },
    isAnyFileSelected(files) {
      return files.length !== 0;
    },
    firstSelectedFile(files) {
      return files[0];
    },
    validateFileExtensionAndEmit(files) {
      let file = this.firstSelectedFile(files);
      if (this.isFileTypeValid(file)) {
        this.$eventBus.emit("cover-edited", file);
      } else {
        this.resetFileInput();
        alert("The selected file extension is not allowed!");
      }
    },
    resetFileInput() {
      this.$refs.fileInput.value = "";
    },
    getFileInputId() {
      return this.$props.inputId + "-change-cover-file-input-id";
    },
  },
};
</script>

<style scoped>
input[type="file"] {
  display: none;
}
.profile-button {
  border-color: var(--color-dark);
  -webkit-text-fill-color: var(--color-dark);
}
.profile-button:hover {
  background: var(--color-dark);
  border-color: var(--color-dark);
  -webkit-text-fill-color: var(--color-accent-primary);
}
/* dark theme like button */

.change-cover-button {
  padding: var(--padding-button-1);
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-dark);
  border: 2px solid;
  border-radius: var(--small-border-radius);
  cursor: pointer;

  height: 40px;
  min-width: 160px;
}

.change-cover-button-dark {
  border-color: var(--color-dark);
  color: var(--color-accent-primary) !important;
}

.change-cover-button-dark path {
  stroke: var(--color-dark);
}

.change-cover-button-dark:hover {
  -webkit-text-fill-color: var(--color-accent-primary) !important;
  color: var(--color-accent-primary) !important;
  border: 2px solid var(--color-dark);
  fill: var(--color-accent-primary);
  stroke: var(--color-dark);
  background: var(--color-dark);
}

.change-cover-button-dark:hover path {
  stroke: var(--color-accent-primary);
  fill: var(--color-accent-primary);
}

.change-cover-button-dark:active {
  border: 2px solid var(--color-dark);
  fill: var(--color-gray-light);
  background: var(--color-dark);
  opacity: 50%;
}

.change-cover-button-dark.liked {
  -webkit-text-fill-color: var(--color-dark) !important;
  color: var(--color-dark);
  border: 2px solid var(--color-dark);
  fill: var(--color-gray-light);
  background: var(--gradient-card-dark);
}

.change-cover-button-dark:active path,
.change-cover-button-dark.liked path {
  fill: var(--color-gray-light);
  stroke: var(--color-gray-light);
}

/* change-cover-button-dark-with-accent-background */
.change-cover-button-dark-with-accent-background {
  border-color: var(--color-dark);
  background: var(--color-gray-light);
}

.change-cover-button-dark-with-accent-background path {
  stroke: var(--color-dark);
  fill: var(--color-dark);
}

.change-cover-button-dark-with-accent-background:hover {
  border: 2px solid var(--color-dark);
  fill: var(--color-gray-light);
  stroke: var(--color-dark);
  background: var(--color-dark);
}

.change-cover-button-dark-with-accent-background:hover path {
  stroke: var(--color-gray-light);
  fill: var(--color-gray-light);
}

.change-cover-button-dark-with-accent-background:active {
  border: 2px solid var(--color-dark);
  fill: var(--color-gray-light);
  background: var(--color-dark);
  opacity: 50%;
}

.change-cover-button-dark-with-accent-background.liked {
  border: 2px solid var(--color-dark);
  fill: var(--color-gray-light);
  background: var(--color-dark);
}

.change-cover-button-dark-with-accent-background:active path,
.change-cover-button-dark-with-accent-background.liked path {
  fill: var(--color-gray-light);
  stroke: var(--color-gray-light);
}

.fit {
  width: 20%;
}
</style>
