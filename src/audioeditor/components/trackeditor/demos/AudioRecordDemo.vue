<template>
  <div class="audio-record-demo">
    <div class="bordered-section">
      <h4>Real time recording (with AudioContext)</h4>
      <div class="toggle" @click="switchRecordHandler">
        <div class="check-mark-wrapper">
          <CheckMark :checked="recording.isAudioRecordEnabled" />
        </div>
        <span>Enable (keep disabled to avoid performance loss)</span>
      </div>

      <div class="row">
        <button :disabled="!recording.isAudioRecordEnabled" class="audio-editor-button medium-button record-button" @click="switchRecordStarted">
          <svg class="record-circle" :class="{ recording: recording.isRecording }" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" r="50%" fill="currentColor" />
            <circle cx="50%" cy="50%" r="25%" fill="red" />
          </svg>
          <span v-if="!recording.isRecording">Start record</span>
          <span v-else>Pause record</span>
        </button>
        <button :disabled="!recording.isAudioRecordEnabled" class="audio-editor-button medium-button" @click="resetRecordWithAudioContext">Reset record</button>
        <button :disabled="!recording.recordedFile" class="audio-editor-button medium-button" @click="downloadAudioContextRecord">Download record</button>
      </div>
    </div>

    <div class="bordered-section">
      <h4>Not real time recording (with OfflineAudioContext)</h4>
      <div class="row">
        <span>Record time range: </span>
        <span>start, seconds:</span>
        <div class="record-time-input-wrapper">
          <input ref="startTimeInput" :value="startTimeInputValue" type="text" class="record-time" @input="startTimeInputHandler" />
        </div>
        <span>end, seconds:</span>
        <div class="record-time-input-wrapper">
          <input ref="endTimeInput" :value="endTimeInputValue" type="text" class="record-time" @input="endTimeInputHandler" />
        </div>
        <button class="audio-editor-button medium-button" @click="isByCompositionDurationButtonHandler">
          By composition duration:
          {{ offlineRecording.isRangeSpecifiedByCompositionDuration }}
        </button>
      </div>
      <div class="row">
        <button class="audio-editor-button medium-button" @click="createAndDownloadMixdown">Create and download mixdown record</button>
        <button class="audio-editor-button medium-button" @click="createAndDownloadTracks">Create and download individual track records</button>
      </div>
      <div class="row">
        <span>state: {{ offlineRecording.offlineAudioRecorderState }}</span>
        <div v-if="isOfflineRenderingInProgress" class="crescent-loader-wrapper">
          <CrescentLoader />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { downloadFile } from "@/audioeditor/audiomodel/audioeditor/common/miscellaneous";
import { OfflineAudioRecorderState } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/OfflineAudioRecorder";

import CheckMark from "@/components/common/uielements/CheckMark.vue";
import CrescentLoader from "@/components/common/uielements/CrescentLoader";

export default {
  name: "AudioRecordDemo",
  components: {
    CheckMark,
    CrescentLoader,
  },
  data() {
    return {
      startTimeInputValue: null,
      endTimeInputValue: null,
    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      recording: (state) => state.recording,
      offlineRecording: (state) => state.offlineRecording,
    }),
    isOfflineRecordingDownloadEnabled() {
      return this.offlineRecording.recordedBlob && this.offlineRecording.offlineAudioRecorderState !== OfflineAudioRecorderState.RENDERING_IN_PROGRESS;
    },
    isOfflineRenderingInProgress() {
      return this.offlineRecording.offlineAudioRecorderState === OfflineAudioRecorderState.RENDERING_IN_PROGRESS;
    },
  },
  watch: {
    offlineRecording: {
      handler(newOfflineRecording) {
        this.startTimeInputValue = newOfflineRecording.audioRecordRange.start;
        this.endTimeInputValue = newOfflineRecording.audioRecordRange.end;
      },
      deep: true,
    },
  },
  mounted() {
    this.startTimeInputValue = this.offlineRecording.audioRecordRange.start;
    this.endTimeInputValue = this.offlineRecording.audioRecordRange.end;
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["startRecordWithAudioContext", "pauseRecordWithAudioContext", "resetRecordWithAudioContext", "setIsRangeByCompositionDuration", "switchAudioRecord", "startMixdownRecordWithOfflineAudioContext", "startTracksRecordWithOfflineAudioContext", "setAudioRecordRangeStart", "setAudioRecordRangeEnd"]),
    switchRecordStarted() {
      !this.recording.isRecording ? this.startRecordWithAudioContext() : this.pauseRecordWithAudioContext();
    },
    startTimeInputHandler(event) {
      const value = Number(event.target.value);
      this.setAudioRecordRangeStart(value);
    },
    endTimeInputHandler(event) {
      const value = Number(event.target.value);
      this.setAudioRecordRangeEnd(value);
    },
    isByCompositionDurationButtonHandler() {
      this.setIsRangeByCompositionDuration(!this.offlineRecording.isRangeSpecifiedByCompositionDuration);
    },
    switchRecordHandler() {
      this.switchAudioRecord();
    },
    downloadAudioContextRecord() {
      downloadFile(this.recording.recordedFile, "");
    },

    /* offline audio context */
    async createAndDownloadMixdown() {
      try {
        await this.startMixdownRecordWithOfflineAudioContext();
        this.downloadOfflineAudioContextRecord("mixdown");
      } catch (error) {
        console.error(error);
      }
    },
    async createAndDownloadTracks() {
      try {
        await this.startTracksRecordWithOfflineAudioContext();
        this.downloadOfflineAudioContextRecord("individual_tracks");
      } catch (error) {
        console.error(error);
      }
    },
    downloadOfflineAudioContextRecord(fileName) {
      downloadFile(this.offlineRecording.recordedBlob, fileName ?? "");
    },
    /* /offline audio context */
  },
};
</script>

<style scoped>
.audio-record-demo {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: start;
}
.bordered-section {
  border-radius: var(--audio-editor-default-border-radius);
  padding: var(--default-padding);
  display: flex;
  flex-direction: column;
  align-items: start;
}
.audio-record-demo > *:not(:last-child) {
  margin-bottom: 20px;
}
.check-mark-wrapper {
  width: 25px;
  height: 25px;
}
.row {
  display: flex;
  gap: var(--smallest-block-gap);
  align-items: center;
}
.toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.record-button {
  padding: 0 10px !important;
  justify-content: space-between !important;
}
.record-circle {
  border-radius: var(--border-raduis-circle);
  width: 20px;
  height: 20px;
  color: rgba(29, 34, 39, 0.5);
}
.record-circle.recording {
  color: rgba(255, 0, 0, 0.5);
}
.record-time-input-wrapper {
  width: 100px;
}
input[type="text"] {
  height: 25px;
  padding: 5px;
}
.crescent-loader-wrapper {
  width: 30px;
  height: 30px;
}
</style>
