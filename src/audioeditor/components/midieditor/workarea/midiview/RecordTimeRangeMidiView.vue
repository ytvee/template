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
import { convertWorldOffsetToClientOffset } from "@/audioeditor/audiomodel/audioeditor/common/canvaspainters/canvasPainter";
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
      return this.convertWorldOffsetToClientOffset(this.offlineRecording.audioRecordRange.start - this.$props.navigationModel.viewportOrigin.x, this.$props.navigationModel.viewportScaleX);
    },
    timeRangeWidth() {
      const width = this.convertWorldOffsetToClientOffset(this.offlineRecording.audioRecordRange.end - this.offlineRecording.audioRecordRange.start, this.$props.navigationModel.viewportScaleX);
      return width >= 0 ? width : 0;
    },
  },
  methods: {
    convertWorldOffsetToClientOffset,
  },
};
</script>

<style scoped>
.record-time-range {
  height: 100%;
  width: 20px;
  background: rgba(128, 128, 128, 0.2);
  border-radius: var(--audio-editor-default-border-radius);
}
.active {
  background: var(--transparent-accent-20);
}
</style>
