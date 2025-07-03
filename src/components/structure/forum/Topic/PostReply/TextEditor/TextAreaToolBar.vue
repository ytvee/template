<template>
  <div class="text-area-tool-bar">
    <div class="tool-button svg-button">
      <CommonFileInput :input-id="getInputId" :is-multiple-files-loading-allowed="true" @event-file="eventFileHandler">
        <svg width="28" height="31" viewBox="0 0 28 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M25.9567 13.8144L13.3895 26.3816C12.2301 27.5409 10.6578 28.1922 9.01825 28.1922C7.37873 28.1922 5.80636 27.5409 4.64704 26.3816C3.48773 25.2223 2.83643 23.6499 2.83643 22.0104C2.83643 20.3709 3.48773 18.7985 4.64704 17.6392L18.3071 3.97916C19.0316 3.25459 20.0144 2.84752 21.0391 2.84752C22.0638 2.84752 23.0465 3.25459 23.7711 3.97916C24.4956 4.70373 24.9027 5.68646 24.9027 6.71116C24.9027 7.73586 24.4956 8.71859 23.7711 9.44316L12.2967 20.9176C12.0068 21.2074 11.6137 21.3702 11.2038 21.3702C10.794 21.3702 10.4009 21.2074 10.111 20.9176C9.82122 20.6277 9.6584 20.2347 9.6584 19.8248C9.6584 19.4149 9.82122 19.0218 10.111 18.732L20.4927 8.35036L18.8535 6.71116L8.47185 17.0928C7.74727 17.8173 7.34021 18.8001 7.34021 19.8248C7.34021 20.8495 7.74727 21.8322 8.47185 22.5568C9.19642 23.2814 10.1792 23.6884 11.2039 23.6884C12.2286 23.6884 13.2113 23.2814 13.9359 22.5568L25.4103 11.0824C26.5696 9.92305 27.2209 8.35068 27.2209 6.71116C27.2209 5.07164 26.5696 3.49927 25.4103 2.33996C24.251 1.18064 22.6786 0.529343 21.0391 0.529343C19.3995 0.529343 17.8272 1.18064 16.6679 2.33996L3.00784 16C1.41378 17.594 0.518247 19.756 0.518247 22.0104C0.518247 24.2647 1.41378 26.4267 3.00784 28.0208C4.6019 29.6148 6.76391 30.5104 9.01825 30.5104C11.2726 30.5104 13.4346 29.6148 15.0287 28.0208L27.5959 15.4536L25.9567 13.8144Z"
          />
        </svg>
      </CommonFileInput>
    </div>
  </div>
</template>
<script>
import CommonFileInput from "@/components/common/navigation/inputs/CommonFileInput.vue";
export default {
  name: "TextAreaToolBar",
  components: {
    CommonFileInput,
  },
  props: {
    labelPrefix: {
      type: String,
      required: true,
    },
    filesToUploadCount: {
      type: Number,
      required: true,
    },
  },
  emits: ["text-area-tool-bar-append-images"],
  computed: {
    getInputId() {
      return this.$props.labelPrefix + "text-area-tool-bar-attach-images";
    },
  },
  methods: {
    getImageIdForUpload(indexInAppendedArrayOfFiles) {
      return indexInAppendedArrayOfFiles + this.$props.filesToUploadCount;
    },
    eventFileHandler(appendedFiles) {
      const filesToUploadMarkdownStrings = appendedFiles.map((file, index) => `![${file.name}|image](upload://${this.getImageIdForUpload(index)})`);
      this.$emit("text-area-tool-bar-append-images", {
        appendedFiles: appendedFiles,
        filesToUploadMarkdownStrings: filesToUploadMarkdownStrings,
      });
    },
  },
};
</script>

<style scoped>
.text-area-tool-bar {
  display: flex;
}

.tool-button {
  cursor: pointer;
}

.tool-button svg {
  fill: var(--color-gray);
  transition: var(--default-transition);
}
</style>
