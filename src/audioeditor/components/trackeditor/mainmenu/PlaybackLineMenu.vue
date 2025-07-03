<template>
  <div class="line-menu">
    <div class="line-menu-item" @click="playButtonHandler">
      <div class="solid play-button-content">
        <svg v-if="!isPlaying" width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.666748 10.3128V1.68783C0.666748 1.45172 0.750082 1.25366 0.916748 1.09366C1.08341 0.933662 1.27786 0.85394 1.50008 0.854495C1.56953 0.854495 1.64258 0.864773 1.71925 0.885329C1.79591 0.905884 1.86869 0.937273 1.93758 0.979495L8.72925 5.29199C8.85425 5.37533 8.94814 5.47949 9.01091 5.60449C9.07369 5.72949 9.1048 5.86144 9.10425 6.00033C9.10369 6.13922 9.07258 6.27116 9.01091 6.39616C8.94925 6.52116 8.85536 6.62533 8.72925 6.70866L1.93758 11.0212C1.86814 11.0628 1.79536 11.0942 1.71925 11.1153C1.64314 11.1364 1.57008 11.1467 1.50008 11.1462C1.27786 11.1462 1.08341 11.0662 0.916748 10.9062C0.750082 10.7462 0.666748 10.5484 0.666748 10.3128Z" fill="currentColor" />
        </svg>
        <svg v-else width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.33333 11.6667C7.875 11.6667 7.48278 11.5036 7.15667 11.1775C6.83056 10.8514 6.66722 10.4589 6.66667 10V1.66667C6.66667 1.20833 6.83 0.816112 7.15667 0.490001C7.48333 0.16389 7.87556 0.000556968 8.33333 1.41243e-06C8.79111 -0.000554143 9.18361 0.162779 9.51083 0.490001C9.83806 0.817223 10.0011 1.20945 10 1.66667V10C10 10.4583 9.83694 10.8508 9.51083 11.1775C9.18472 11.5042 8.79222 11.6672 8.33333 11.6667ZM1.66667 11.6667C1.20833 11.6667 0.816111 11.5036 0.49 11.1775C0.163889 10.8514 0.000555556 10.4589 0 10V1.66667C0 1.20833 0.163333 0.816112 0.49 0.490001C0.816667 0.16389 1.20889 0.000556968 1.66667 1.41243e-06C2.12444 -0.000554143 2.51694 0.162779 2.84417 0.490001C3.17139 0.817223 3.33444 1.20945 3.33333 1.66667V10C3.33333 10.4583 3.17028 10.8508 2.84417 11.1775C2.51806 11.5042 2.12556 11.6672 1.66667 11.6667Z" fill="currentColor" />
        </svg>
      </div>
    </div>
    <div class="line-menu-item" @click="stopButtonHandler">
      <svg width="11" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 8.33333V1.66667C0 1.20833 0.163333 0.816111 0.49 0.49C0.816666 0.163889 1.20889 0.000555556 1.66667 0H8.33333C8.79167 0 9.18417 0.163333 9.51083 0.49C9.8375 0.816666 10.0006 1.20889 10 1.66667V8.33333C10 8.79167 9.83694 9.18417 9.51083 9.51083C9.18472 9.8375 8.79222 10.0006 8.33333 10H1.66667C1.20833 10 0.816111 9.83694 0.49 9.51083C0.163889 9.18472 0.000555556 8.79222 0 8.33333Z" fill="currentColor" />
      </svg>
    </div>
    <div class="line-menu-item">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.00008 11.8337C4.37508 11.8337 2.99675 11.2678 1.86508 10.1362C0.733415 9.00449 0.167304 7.62588 0.166748 6.00033C0.166193 4.37477 0.732304 2.99644 1.86508 1.86533C2.99786 0.734216 4.37619 0.168105 6.00008 0.166994C7.62397 0.165883 9.00258 0.731994 10.1359 1.86533C11.2692 2.99866 11.8351 4.37699 11.8334 6.00033C11.8317 7.62366 11.2659 9.00227 10.1359 10.1362C9.00592 11.27 7.6273 11.8359 6.00008 11.8337Z" fill="currentColor" />
      </svg>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";

export default {
  name: "PlaybackLineMenu",
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, {
      isPlaying: (state) => state.isPlaying,
      isPlaybackCycled: (state) => state.isPlaybackCycled,
    }),
  },
  methods: {
    ...mapMutations(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, ["setAudioCursorCoordinates"]),
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, ["setIsPlaybackCycled", "play", "pause"]),
    playButtonHandler() {
      this.isPlaying ? this.pause() : this.play();
    },
    stopButtonHandler() {
      this.pause();
      this.setAudioCursorCoordinates({
        currentTime: 0,
      });
    },
    repeatButtonHandler() {
      this.setIsPlaybackCycled(!this.isPlaybackCycled);
    },
  },
};
</script>

<style scoped>
.play-button-content {
  width: 50px;
}
</style>
