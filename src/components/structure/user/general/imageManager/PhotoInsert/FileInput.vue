<template>
  <label class="file-input-label" :for="getFileInputId()">
    <div class="file-input">
      <div class="border-holder">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="none" stroke-width="4" stroke-dasharray="6, 14" stroke-dashoffset="0" stroke-linecap="square" />
        </svg>
      </div>
      <div class="icon-holder">
        <svg width="118" height="118" viewBox="0 0 118 118" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M59 111C32.981 111 7 85.019 7 59C7 32.981 32.981 7 59 7C85.019 7 111 32.981 111 59C111 85.019 85.019 111 59 111ZM59 0C51.252 0 43.5799 1.52608 36.4217 4.49111C29.2635 7.45614 22.7594 11.802 17.2807 17.2807C6.21605 28.3453 0 43.3522 0 59C0 74.6478 6.21605 89.6547 17.2807 100.719C22.7594 106.198 29.2635 110.544 36.4217 113.509C43.5799 116.474 51.252 118 59 118C74.6478 118 89.6547 111.784 100.719 100.719C111.784 89.6547 118 74.6478 118 59C118 51.252 116.474 43.5799 113.509 36.4217C110.544 29.2635 106.198 22.7594 100.719 17.2807C95.2406 11.802 88.7365 7.45614 81.5783 4.49111C74.4201 1.52608 66.748 0 59 0ZM64.9 29.5H53.1V53.1H29.5V64.9H53.1V88.5H64.9V64.9H88.5V53.1H64.9V29.5Z" />
        </svg>
      </div>
      <div class="label-holder">
        <h3>{{ title }}</h3>
      </div>
    </div>
  </label>
  <input :id="getFileInputId()" type="file" :disabled="!isEnabled" @change="fileInputChangeHandler" />
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: "Add new photo",
    },
    isEnabled: {
      type: Boolean,
      required: false,
      default: true,
    },
    inputId: {
      type: String,
      required: true,
    },
  },
  emits: ["event-file"],
  data() {
    return {
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
      event.target.value = null; //Same file chose leads to fire change event
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
        this.$emit("event-file", file);
      } else {
        alert("The selected file extension is not allowed!");
      }
    },
    getFileInputId() {
      return this.$props.inputId + "-file-input-id";
    },
  },
};
</script>

<style scoped>
.file-input-label {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.file-input-label .border-holder svg rect {
  stroke: var(--color-gray);
  transition: var(--default-transition);
}
.file-input-label:hover .border-holder svg rect {
  stroke: var(--color-accent-primary);
  transition: var(--default-transition);
}
.file-input-label:active .border-holder svg rect {
  stroke: var(--color-accent-primary);
  opacity: 50%;
  transition: var(--default-transition);
}
.file-input-label .icon-holder svg {
  fill: var(--color-gray);
  transition: var(--default-transition);
}
.file-input-label:hover .icon-holder svg {
  fill: var(--color-accent-primary);
  transition: var(--default-transition);
}
.file-input-label:active .icon-holder svg {
  fill: var(--color-accent-primary);
  opacity: 50%;
  transition: var(--default-transition);
}
.file-input-label .label-holder h3 {
  color: var(--color-gray);
  transition: var(--default-transition);
}
.file-input-label:hover .label-holder h3 {
  color: var(--color-accent-primary);
  transition: var(--default-transition);
}
.file-input-label:active .label-holder h3 {
  color: var(--color-gray-light);
  opacity: 50%;
  transition: var(--default-transition);
}

.file-input {
  width: 100%;
  height: 100%;
  padding: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  border-radius: var(--small-border-radius);
  position: relative;
  cursor: pointer;
}

.border-holder {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--small-border-radius);
  overflow: hidden;
}

.border-holder svg rect {
  stroke: var(--color-gray);
  rx: var(--small-border-radius);
  ry: var(--small-border-radius);
  stroke-width: calc(var(--file-input-border-width) * 2);
}

.label-holder {
  text-align: center;
}

.icon-holder {
  flex-shrink: 0;
  width: 42.9%;
  aspect-ratio: 1;
}

.icon-holder svg {
  width: 100%;
  height: 100%;
  rx: var(--small-border-radius);
  ry: var(--small-border-radius);
}

input[type="file"] {
  display: none;
}
</style>
