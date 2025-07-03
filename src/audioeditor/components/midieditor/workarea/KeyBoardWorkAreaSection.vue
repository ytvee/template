<template>
  <div class="key-board-work-area-section">
    <div class="key-board-holder" :style="{ transform: 'translateY(' + containerY + 'px)' }">
      <PianoKeyBoard :start-octave="0" :end-octave="3" :start-key="KeyBoardKeyName.A" :end-key="KeyBoardKeyName.C" :position="KEYBOARD_POSITION.VERTICAL_LEFT" :note-scale="navigationModel.noteScale" />
    </div>
    <div class="place-holder-helper"></div>
    <div class="place-holder"></div>
  </div>
</template>

<script>
import { convertWorldOffsetToClientOffset } from "@/audioeditor/audiomodel/audioeditor/common/canvaspainters/canvasPainter";

import { KeyBoardKeyName } from "@audioeditor/audiomodel/audioeditor/midieditor/midiUtils";
import PianoKeyBoard, { KEYBOARD_POSITION } from "../common/PianoKeyBoard.vue";
import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";

export default {
  name: "KeyBoardWorkAreaSection",
  components: {
    PianoKeyBoard,
  },
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      KeyBoardKeyName,
      KEYBOARD_POSITION,
      AUDIO_EDITOR_CONFIGURATION,
    };
  },
  computed: {
    containerY() {
      const offsetTrackUnits = -this.$props.navigationModel.viewportOrigin.y;
      return convertWorldOffsetToClientOffset(offsetTrackUnits, this.$props.navigationModel.noteScale);
    },
  },
  methods: {
    convertWorldOffsetToClientOffset,
  },
};
</script>

<style scoped>
.key-board-work-area-section {
  position: relative;
  overflow: hidden;
  min-height: 100%;
}
.track-mixing-tools-wrapper:not(:last-child) {
  margin-bottom: v-bind("AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackVerticalGap+'px'");
}
.place-holder-helper {
  height: var(--audio-editor-time-line-height);
}
.place-holder {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: var(--audio-editor-time-line-height);
  background: red;
}
.dummy-wrapper {
  margin-bottom: v-bind("AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackVerticalGap+'px'");
}
</style>
