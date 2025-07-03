<template>
  <div class="audio-view-cursor" :style="{ transform: 'translateX(' + cursorClientPositionX + 'px)' }">
    <Transition>
      <div v-if="visualScissors.isEnabled" class="scissors workarea-tooltip" @click="scissorsSlice">
        <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.64605 0.566185L6.7943 5.92345L4.94255 0.566185C4.78963 0.132694 4.30539 -0.100048 3.86335 0.0413168C3.42131 0.191278 3.18398 0.657562 3.32813 1.09965L5.8935 8.5142L4.92501 11.3135C4.51723 11.0472 4.04971 10.855 3.54874 10.7972C2.70769 10.6973 1.8754 10.9222 1.21275 11.4385C0.541334 11.9547 0.125598 12.6882 0.0236521 13.513C-0.0782939 14.3377 0.151085 15.1539 0.677534 15.8038C1.20398 16.4622 1.95186 16.8699 2.79292 16.9699C4.526 17.1784 6.11493 15.9537 6.31882 14.2542C6.33555 14.1292 6.34431 14.0042 6.34431 13.8793C6.34431 13.5379 6.28457 13.213 6.17466 12.8959L6.79511 11.105L7.4235 12.9131C7.27935 13.338 7.21961 13.7965 7.27934 14.2628C7.492 15.9623 9.07217 17.1784 10.8053 16.9785C11.6463 16.8785 12.3942 16.4622 12.9206 15.8124C13.3627 15.2625 13.6 14.5877 13.6 13.8965C13.6 13.7715 13.6 13.6465 13.5745 13.5215C13.4726 12.6968 13.0481 11.9633 12.3854 11.4471C11.714 10.9308 10.8905 10.7059 10.0494 10.8058C9.54846 10.8644 9.08094 11.0472 8.67315 11.3221L7.70466 8.5228L10.27 1.10825C10.3043 1.01687 10.3122 0.933292 10.3122 0.841915C10.3122 0.492002 10.0916 0.167083 9.73482 0.0507122C9.29278 -0.0992493 8.80854 0.134286 8.65562 0.575582L8.64605 0.566185ZM4.62794 14.0628C4.53476 14.854 3.79566 15.4211 2.98804 15.3211C2.59697 15.2797 2.24893 15.0798 2.00283 14.7798C1.79894 14.5213 1.68823 14.2136 1.68823 13.8887C1.68823 13.8301 1.68823 13.7723 1.69699 13.7137C1.7392 13.3302 1.94309 12.9889 2.24892 12.7475C2.55476 12.5062 2.94583 12.4062 3.33608 12.4476C3.72714 12.489 4.07519 12.689 4.32128 12.9889C4.55943 13.2888 4.66933 13.6637 4.62712 14.055L4.62794 14.0628ZM11.3221 12.7545C11.628 12.9959 11.8319 13.338 11.8741 13.7207C11.925 14.1042 11.8143 14.4791 11.5682 14.7868C11.3221 15.0868 10.9733 15.2867 10.591 15.3281C9.78417 15.4195 9.05301 14.8618 8.95107 14.0698C8.95107 14.0112 8.94231 13.9534 8.94231 13.8949C8.94231 13.5699 9.05301 13.2614 9.25691 13.0037C9.50301 12.7038 9.85187 12.5038 10.2421 12.4624C10.6332 12.4124 11.0155 12.521 11.3293 12.7623L11.3221 12.7545Z"
            fill="#4A4D50"
          />
        </svg>
      </div>
    </Transition>
  </div>
</template>

<script>
import { useMapActions, useMapState } from "@/audioeditor/composable/utils/useStoreMaps";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";

export default {
  name: "AudioViewCursor",
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { visualScissors } = useMapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS, {
      visualScissors: (state) => state.visualScissors,
    });
    const { scissorsSlice } = useMapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS, ["scissorsSlice"]);

    return {
      visualScissors,
      scissorsSlice,
    };
  },
  computed: {
    cursorClientPositionX() {
      return Transformation.worldToViewport({ x: this.$props.navigationModel.audioCursorCoordinates.x, y: 0 }, this.$props.navigationModel).x;
    },
  },
};
</script>

<style scoped>
.audio-view-cursor {
  position: absolute;
  height: 100%;
  width: 1px;
  background: var(--audio-editor-color-white);
  display: flex;
  justify-content: center;
}
.arrow-holder {
  position: absolute;
  bottom: calc(var(--audio-editor-time-line-height) + 2px);
  display: flex;
}
.scissors {
  position: relative;
  flex-shrink: 0;
  /* left: -11px; */
  top: 85px;

  width: 22px;
  height: 40px;

  border-radius: 11px;
  background: var(--audio-editor-color-white);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.v-enter-active,
.v-leave-active {
  transition: opacity var(--default-transition);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
