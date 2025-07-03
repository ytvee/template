<template>
  <div class="track-editor">
    <div class="main-menu-wrapper">
      <MainMenu />
    </div>
    <div class="main-work-area-wrapper">
      <MainWorkArea />
    </div>
    <DemosContainer v-if="AUDIO_EDITOR_CONFIGURATION.debug.isEnabled" />
  </div>
</template>

<script>
import MainMenu from "./trackeditor/MainMenu.vue";
import MainWorkArea from "./trackeditor/MainWorkArea.vue";

import DemosContainer from "./trackeditor/demos/DemosContainer.vue";
import { AUDIO_EDITOR_CONFIGURATION } from "../data/configuration";

export default {
  name: "TrackEditor",
  components: {
    MainMenu,
    MainWorkArea,

    DemosContainer,
  },
  data() {
    return {
      AUDIO_EDITOR_CONFIGURATION,
      isAudioEditorInitialized: false,
      isUserMediaPermissionError: false,
    };
  },

  methods: {},
};
</script>

<style scoped>
.track-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.main-menu-wrapper {
  margin-top: 18px;
  margin-bottom: 9px;
}
.main-work-area-wrapper {
  flex-grow: 1;
  overflow: hidden;
}
</style>
