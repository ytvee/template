<template>
  <div class="track-mixing-tools-header-menu">
    <div class="playback-time-holder">
      <span class="formatted-current-time-holder">{{ formattedCurrentTime }}</span>
      <div class="dropdown-arrow">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.56258 12.0622L6.54175 9.04134C6.50008 8.99967 6.46897 8.95467 6.44841 8.90634C6.42786 8.85801 6.4173 8.80579 6.41675 8.74967C6.41675 8.63856 6.45508 8.54134 6.53175 8.45801C6.60841 8.37467 6.70897 8.33301 6.83341 8.33301H13.1667C13.2917 8.33301 13.3926 8.37467 13.4692 8.45801C13.5459 8.54134 13.584 8.63856 13.5834 8.74967C13.5834 8.77745 13.5417 8.87467 13.4584 9.04134L10.4376 12.0622C10.3681 12.1316 10.2987 12.1802 10.2292 12.208C10.1598 12.2358 10.0834 12.2497 10.0001 12.2497C9.91675 12.2497 9.84036 12.2358 9.77092 12.208C9.70147 12.1802 9.63203 12.1316 9.56258 12.0622Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
export default {
  name: "TrackMixingToolsHeaderMenu",
  computed: {
    ...mapGetters(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, ["formattedCurrentTime"]),
  },
};
</script>

<style scoped>
.track-mixing-tools-header-menu {
  height: 35px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}
.playback-time-holder {
  display: flex;
  align-items: center;

  font-family: var(--audio-editor-font-headline-family);
  font-size: var(--audio-editor-font-heandline-size);
  font-weight: var(--largest-font-weight);
  color: var(--audio-editor-color-white);
}
.formatted-current-time-holder {
  min-width: 95px;
}
.dropdown-arrow {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--audio-editor-color-translucent-white-1);
  transition: color var(--default-transition);
}
.dropdown-arrow:hover {
  color: var(--audio-editor-color-white);
}
</style>
