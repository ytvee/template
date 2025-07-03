<template>
  <div class="segment-import-to-daw">
    <div class="segment-import-to-daw-header" @click="isModalClosed = true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.9998 8.25524L4.33646 10.9259C4.16785 11.0933 3.95359 11.177 3.69367 11.177C3.43376 11.177 3.2195 11.0933 3.05089 10.9259C2.8835 10.7585 2.7998 10.5455 2.7998 10.2868C2.7998 10.0281 2.8835 9.81502 3.05089 9.64763L5.72154 6.97698L3.05089 4.33646C2.8835 4.16785 2.7998 3.95359 2.7998 3.69367C2.7998 3.43376 2.8835 3.2195 3.05089 3.05089C3.21828 2.8835 3.43133 2.7998 3.69002 2.7998C3.94872 2.7998 4.16176 2.8835 4.32915 3.05089L6.9998 5.72154L9.64033 3.05089C9.80893 2.8835 10.0232 2.7998 10.2831 2.7998C10.543 2.7998 10.7573 2.8835 10.9259 3.05089C11.1085 3.2335 11.1998 3.4505 11.1998 3.70189C11.1998 3.95328 11.1085 4.16237 10.9259 4.32915L8.25524 6.97698L10.9259 9.64033C11.0933 9.80893 11.177 10.0232 11.177 10.2831C11.177 10.543 11.0933 10.7573 10.9259 10.9259C10.7433 11.1085 10.5266 11.1998 10.2758 11.1998C10.025 11.1998 9.81563 11.1085 9.64763 10.9259L6.9998 8.25524Z" fill="white" />
      </svg>
    </div>
    <div class="segment-import-to-daw-content">
      <div class="sample-name">{{ uploadingSample }}</div>
      <div class="upload-process">
        <div class="loader">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6 11C5.31667 11 4.67083 10.8688 4.0625 10.6062C3.45417 10.3438 2.92292 9.98542 2.46875 9.53125C2.01458 9.07708 1.65625 8.54583 1.39375 7.9375C1.13125 7.32917 1 6.68333 1 6C1 5.30833 1.13125 4.66042 1.39375 4.05625C1.65625 3.45208 2.01458 2.92292 2.46875 2.46875C2.92292 2.01458 3.45417 1.65625 4.0625 1.39375C4.67083 1.13125 5.31667 1 6 1C6.14167 1 6.26042 1.04792 6.35625 1.14375C6.45208 1.23958 6.5 1.35833 6.5 1.5C6.5 1.64167 6.45208 1.76042 6.35625 1.85625C6.26042 1.95208 6.14167 2 6 2C4.89167 2 3.94792 2.38958 3.16875 3.16875C2.38958 3.94792 2 4.89167 2 6C2 7.10833 2.38958 8.05208 3.16875 8.83125C3.94792 9.61042 4.89167 10 6 10C7.10833 10 8.05208 9.61042 8.83125 8.83125C9.61042 8.05208 10 7.10833 10 6C10 5.85833 10.0479 5.73958 10.1438 5.64375C10.2396 5.54792 10.3583 5.5 10.5 5.5C10.6417 5.5 10.7604 5.54792 10.8562 5.64375C10.9521 5.73958 11 5.85833 11 6C11 6.68333 10.8688 7.32917 10.6062 7.9375C10.3438 8.54583 9.98542 9.07708 9.53125 9.53125C9.07708 9.98542 8.54792 10.3438 7.94375 10.6062C7.33958 10.8688 6.69167 11 6 11Z"
              fill="#52BB4D"
            />
          </svg>
        </div>
        <div class="upload-process-text">Uploading</div>
        <div class="upload-process-progress">
          <div>{{ progress }}</div>
          %
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";

export default {
  props: {
    modalProps: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      progress: 0,
      isModalClosed: false,
      uploadingSample: "Uploading Sample",
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.currentUser,
    }),
  },
  mounted() {
    this.filesChosenHandler(this.$props.modalProps);
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["addTracks"]),
    updateProgress(percent) {
      this.progress = percent;
    },
    async filesChosenHandler(files) {
      if (!files) {
        return;
      }

      const trackOptionsArray = [];

      Object.values(files).forEach((file) => {
        const trackFile = {
          musicianName: this.user?.name || file.name,
          soundSource: "custom",
          segments: [
            {
              name: file.name,
              url: URL.createObjectURL(file),
            },
          ],
        };
        trackOptionsArray.push(trackFile);
      });

      const totalTracks = trackOptionsArray.length;
      let loadingIndex = 0;
      const progressPerTrack = 100 / totalTracks;

      const animateLoading = async () => {
        for (let j = 0; j < 100 / totalTracks; j++) {
          await new Promise((resolve) => setTimeout(resolve, progressPerTrack / 100));
          loadingIndex += progressPerTrack / (100 / totalTracks);
          const percent = Math.min(Math.round(loadingIndex), 100);
          this.updateProgress(percent);
          if (this.isModalClosed) {
            break;
          }
        }
      };

      const loadTracks = async () => {
        for (let i = 0; i < totalTracks; i++) {
          if (this.isModalClosed) {
            this.$modal.close();
            break;
          }
          this.uploadingSample = trackOptionsArray[i].musicianName;
          const track = [trackOptionsArray[i]];
          animateLoading();
          await this.addTracks({ commandArgs: { tracks: track, directionToPush: "bottom" } });
        }
      };

      await loadTracks();
      this.$modal.close();
    },
  },
};
</script>

<style scoped>
.segment-import-to-daw {
  position: relative;
  min-width: 300px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid var(--transparent-light-15);
  border-radius: var(--large-border-radius-2);
  padding: var(--large-padding);
  background: var(--gradient-dark-to-light-transparent);
}

.segment-import-to-daw-header {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  justify-content: flex-end;
}

.segment-import-to-daw-header svg {
  fill-opacity: 0.4;
}

.segment-import-to-daw-header svg:hover {
  fill-opacity: 1;
  cursor: pointer;
}

.segment-import-to-daw-content {
  minheight: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--medium-block-gap);
}

.sample-name {
  padding: 0 5px;
  max-width: 250px;
  font-family: var(--wix-font-family);
  font-weight: var(--small-font-weight);
  font-size: var(--medium-font-size);
  text-align: right;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload-process {
  min-width: 115px;
  display: flex;
  gap: var(--small-block-gap);

  font-family: var(--wix-font-family);
  font-weight: var(--large-font-weight);
  font-size: var(--small-font-size);
  line-height: 100%;
  color: var(--color-success);
}

.loader svg {
  -webkit-animation: spin 1s linear infinite;
  -moz-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

.upload-process-progress {
  display: flex;
}

.upload-process-progress div {
  min-width: 15px;
  text-align: center;
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}
@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
