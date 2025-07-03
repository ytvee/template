<template>
  <div
    class="record-time-range"
    :class="{ active: !offlineRecording.isRangeSpecifiedByCompositionDuration }"
    :style="{
      transform: 'translateX(' + startClientPositionX + 'px)',
      width: timeRangeWidth + 'px',
    }"
  ></div>
</template>

<script>
import { mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
export default {
  name: "RecordTimeRange",
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      offlineRecording: (state) => state.offlineRecording,
    }),
    startClientPositionX() {
      return Transformation.worldToViewport({ x: this.offlineRecording.audioRecordRange.start, y: 0 }, this.$props.navigationModel).x;
    },
    timeRangeWidth() {
      const width = Transformation.worldToViewportDistance({ x: this.offlineRecording.audioRecordRange.end - this.offlineRecording.audioRecordRange.start, y: 0 }, this.$props.navigationModel).x;
      return width >= 0 ? width : 0;
    },
  },
};
</script>

<style scoped>
.record-time-range {
  height: 100%;
  width: 20px;
  border-left: 1px dashed var(--audio-editor-color-translucent-white-1);
  border-right: 1px dashed var(--audio-editor-color-translucent-white-1);

  transition: background-color var(--default-transition), border-color var(--default-transition);
}
.active {
  background-color: var(--audio-editor-color-translucent-white-3);
  border-color: var(--audio-editor-color-white);
}
</style>
