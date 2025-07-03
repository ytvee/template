<template>
  <AudioEditorThemeProvider />
  <div v-if="isAudioEditorInitialized" class="audio-editor no-user-select">
    <TrackEditor />
    <!-- <MidiEditor /> -->
  </div>
  <div v-else>
    <h1 v-if="!isUserMediaPermissionError">AudioEditor is initializing...</h1>
    <div v-else>
      <h1>Give microfone permission to initialize audioEditor</h1>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AudioEditorThemeProvider from "./components/theme/AudioEditorThemeProvider.vue";
import TrackEditor from "./components/TrackEditor.vue";
import { AUDIO_EDITOR_BASE_MODULE, AUDIO_EDITOR_SUBMODULES } from "./data/store/storeModules";
import { useHotkeysController } from "@/audioeditor/controller/hotkeysController/useHotkeysController";
// import MidiEditor from "./components/MidiEditor.vue";

export default {
  name: "AudioEditor",
  components: {
    AudioEditorThemeProvider,
    TrackEditor,
    // MidiEditor,
  },
  setup() {
    useHotkeysController();
  },
  data() {
    return {
      isUserMediaPermissionError: false,
    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_BASE_MODULE, {
      isAudioEditorInitialized: (state) => state.isInitialized,
    }),
    ...mapState({
      user: (state) => state.user.currentUser,
    }),
  },
  async created() {
    try {
      await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      await this.initializeAudioEditorWithFlag();
    } catch (error) {
      console.error(error);
      this.isUserMediaPermissionError = true;
    }
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_BASE_MODULE, ["initializeAudioEditor"]),
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["addTracks"]),
    async initializeAudioEditorWithFlag() {
      this.isUserMediaPermissionError = false;
      if (!this.isAudioEditorInitialized) {
        await this.initializeAudioEditor();
        this.onAudioEditorInitialized();
      }
    },
    async onAudioEditorInitialized() {
      /* test */ //TODO: remove
      // await this.addTestTrack();
      /* /test */
    },
    /* helpers */
    async addTestTrack() {
      const testSampleSrc = "sample1.wav";
      const responce = await fetch(testSampleSrc);
      const blob = await responce.blob();
      const file = new File([blob], testSampleSrc);

      const trackOptionsArray = [
        {
          musicianName: this.user?.currentUser?.name || file.name,
          soundSource: "custom",
          segments: [
            {
              name: this.user?.name || file.name,
              startPosition: 0, //seconds
              url: URL.createObjectURL(blob),
            },
          ],
        },
      ];

      this.addTracks({ commandArgs: { tracks: trackOptionsArray, directionToPush: "bottom" } });
    },
    /* /helpers */
  },
};
</script>

<style>
.no-user-select {
  user-select: none;
}
</style>
<style scoped>
.audio-editor {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;

  /* height: 800px; */
  height: 100vh;
}

.bottom-buttons-holder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bottom-buttons-holder > * {
  margin-bottom: 10px;
}

.add-segment-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--audio-editor-color-white);
}

.add-segment-wrapper input {
  width: 50px;
}
</style>
