<template>
  <div
    class="record-time-range"
    :class="{ active: !offlineRecording.isRangeSpecifiedByCompositionDuration }"
    :style="{
      transform: 'translateX(' + startClientPositionX + 'px)',
      width: timeRangeWidth + 'px',
    }"
    @mousedown.left="rangeMouseDownHandler"
  >
    <div class="editable-bounds-handle handle-left" :class="{ visible: isLeftHandleVisible }" @mousedown.left="editableLeftBoundMouseDownHandler"></div>
    <div class="editable-bounds-handle handle-right" :class="{ visible: isRightHandleVisible }" @mousedown.left="editableRightBoundMouseDownHandler"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";

// import { convertClientOffsetToWorldOffset, convertWorldOffsetToClientOffset } from "@/audioeditor/audiomodel/audioeditor/common/canvaspainters/canvasPainter";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";

const WIDTH_ON_WHICH_HANDLES_VISIBLE = 10; //px

export default {
  name: "RecordTimeRange",
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      oldMouseClientX: 0,
      oldMouseClientY: 0,
      isDraggingRange: false,
      isDraggingLeftBound: false,
      isDraggingRightBound: false,

      clickRecognitionMouseDownClientX: 0, //if user just click on Record Time Range it will be enabled/disabled instead of move
      clickRecognitionMouseDownClientY: 0,
    };
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
    isLeftHandleVisible() {
      return this.isDraggingLeftBound || this.timeRangeWidth < WIDTH_ON_WHICH_HANDLES_VISIBLE;
    },
    isRightHandleVisible() {
      return this.isDraggingRightBound || this.timeRangeWidth < WIDTH_ON_WHICH_HANDLES_VISIBLE;
    },
  },
  mounted() {
    document.addEventListener("mousemove", this.mouseMoveHandler);
    document.addEventListener("mouseup", this.documentMouseUpHandler);
  },
  unmounted() {
    document.removeEventListener("mousemove", this.mouseMoveHandler);
    document.removeEventListener("mouseup", this.documentMouseUpHandler);
  },
  methods: {
    convertWorldOffsetToClientOffset,
    ...mapMutations(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["setIsRangeByCompositionDuration", "setAudioRecordRangeStart"]),
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["setAudioRecordRangeEnd"]),
    mouseMoveHandler(event) {
      const offsetX = event.clientX - this.oldMouseClientX;
      this.moveRecordTimeRange(offsetX);
      this.moveEditableBoundHandler(offsetX);
      this.oldMouseClientX = event.clientX;
    },
    switchRecordTimeRangeByClick(event) {
      if (event.clientX === this.clickRecognitionMouseDownClientX && event.clientY === this.clickRecognitionMouseDownClientY) {
        this.setIsRangeByCompositionDuration(!this.offlineRecording.isRangeSpecifiedByCompositionDuration);
      }
    },
    documentMouseUpHandler(event) {
      //TODO: single documentMouseHandler for project
      switch (event.button) {
        case 0: {
          //left mouse button
          document.body.style.cursor = "";
          this.isDraggingLeftBound = false;
          this.isDraggingRightBound = false;

          this.isDraggingRange = false;
          this.switchRecordTimeRangeByClick(event);
          break;
        }
        case 1: {
          //middle mouse button
          break;
        }
        case 2: {
          //right mouse button
          break;
        }
      }
    },
    moveRecordTimeRange(offsetPixels) {
      if (this.isDraggingRange) {
        // const startPosition = this.offlineRecording.audioRecordRange.start + convertClientOffsetToWorldOffset(offsetPixels, this.$props.navigationModel.viewportScaleX);
        const startPosition = this.offlineRecording.audioRecordRange.start + Transformation.windowToWorld({ x: offsetPixels, y: 0 }, this.$props.navigationModel).x;

        this.setAudioRecordRangeStart(startPosition);
        // const endPosition = this.offlineRecording.audioRecordRange.end + convertClientOffsetToWorldOffset(offsetPixels, this.$props.navigationModel.viewportScaleX);
        this.setAudioRecordRangeEnd(endPosition);
      }
    },
    moveEditableBoundHandler(offsetPixels) {
      if (this.isDraggingLeftBound) {
        // const startPosition = this.offlineRecording.audioRecordRange.start + convertClientOffsetToWorldOffset(offsetPixels, this.$props.navigationModel.viewportScaleX);
        this.setAudioRecordRangeStart(startPosition < this.offlineRecording.audioRecordRange.end ? startPosition : this.offlineRecording.audioRecordRange.end);
      }
      if (this.isDraggingRightBound) {
        // const endPosition = this.offlineRecording.audioRecordRange.end + convertClientOffsetToWorldOffset(offsetPixels, this.$props.navigationModel.viewportScaleX);
        this.setAudioRecordRangeEnd(endPosition > this.offlineRecording.audioRecordRange.start ? endPosition : this.offlineRecording.audioRecordRange.start);
      }
    },
    rangeMouseDownHandler(event) {
      if (!event.target.closest(".editable-bounds-handle")) {
        this.isDraggingRange = true;

        this.clickRecognitionMouseDownClientX = event.clientX;
        this.clickRecognitionMouseDownClientY = event.clientY;
      }
    },
    editableLeftBoundMouseDownHandler() {
      this.isDraggingLeftBound = true;
      document.body.style.cursor = "ew-resize";
    },
    editableRightBoundMouseDownHandler() {
      this.isDraggingRightBound = true;
      document.body.style.cursor = "ew-resize";
    },
  },
};
</script>

<style scoped>
.record-time-range {
  position: absolute;
  height: 11px;
  border-radius: var(--large-border-radius);
  pointer-events: auto;
  cursor: pointer;

  background: rgba(128, 128, 128, 0.3);
}
.active {
  background: var(--gradient-primary-light-1);
}

.editable-bounds-handle {
  position: absolute;
  z-index: 10;
  top: 0;
  height: 100%;
  width: 4px;
  cursor: ew-resize;
  background: rgba(128, 0, 0, 0);
  transition: background-color var(--default-transition);
  border-radius: var(--audio-editor-default-border-radius);
}
.editable-bounds-handle:hover,
.editable-bounds-handle.visible {
  background: var(--color-light);
  transition: background-color var(--default-transition);
}
.handle-left {
  left: 0;
}
.handle-right {
  right: 0;
}
</style>
