<template>
  <SoundSplitterThemeProvider />
  <div class="sound-splitter no-user-select">
    <div class="midi-editor">
      midi editor
      <WorkArea />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import SoundSplitterThemeProvider from "./midieditor/SoundSplitterThemeProvider.vue";
import WorkArea from "./midieditor/WorkArea.vue";

export default {
  name: "MidiEditor",
  components: {
    SoundSplitterThemeProvider,
    WorkArea,
  },
  data() {
    return {};
  },
  mounted() {
    // this.initializeAudioEditor();
  },
  // unmounted() {},
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["initializeAudioEditor"]),
  },
};
</script>

<style scoped>
.midi-editor {
  border: 1px solid red;
  /* color: white; */
}
.no-user-select {
  user-select: none;
}
</style>
