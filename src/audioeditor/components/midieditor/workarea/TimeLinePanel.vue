<template>
  <div class="time-line-panel">
    <div ref="timeLine" class="time-line">
      <canvas ref="timeLineCanvas" class="time-line-canvas" width="0" height="0" @mousedown.left="canvasLeftMouseDownHandler"></canvas>
      <div class="record-time-range-wrapper">
        <RecordTimeRange :navigation-model="navigationModel" />
      </div>
      <div class="time-line-cursor-wrapper">
        <TimeLineCursor :navigation-model="navigationModel" @mousedown.left="cursorLeftMouseDownHandler" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { WorkAreaCanvasPainter } from "@/audioeditor/audiomodel/audioeditor/common/canvaspainters/canvasPainter";
import TimeLineCursor from "./timelinepanel/TimeLineCursor.vue";
import RecordTimeRange from "./timelinepanel/RecordTimeRange.vue";

const workAreaCanvasPainterOptions = {
  BASE_RISK_WIDTH: 1, //px
  BASE_RISK_HEIGHT: 16, //px
  BASE_RISK_COLOR: "#676767",

  INTERMEDIATE_RISK_WIDTH: 1, //px
  INTERMEDIATE_RISK_HEIGHT: 10, //px
  INTERMEDIATE_RISK_COLOR: "#676767",
};

export default {
  name: "TimeLine",
  components: {
    TimeLineCursor,
    RecordTimeRange,
  },
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
    resizeOberverWidth: {
      type: Number,
      required: true,
    },
    resizeObserverHeight: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      workAreaCanvasPainter: null,
    };
  },
  watch: {
    navigationModel: {
      handler(oldNavigationModel, newNavigationModel) {
        //TODO: reduce extra canvas updates
        this.workAreaCanvasPainter.drawTimeLineTimeRisks(newNavigationModel.viewportOrigin.x, newNavigationModel.viewportScaleX, newNavigationModel.absoluteTimeGridOptions.baseRiskTimeStep, newNavigationModel.absoluteTimeGridOptions.intermediateRiskCount);
      },
      deep: true,
    },
    resizeOberverWidth: {
      //TODO: redo with composable
      handler(newWidth) {
        this.resizeObserverHandler("x", newWidth);
      },
    },
    resizeObserverHeight: {
      handler(newHeight) {
        this.resizeObserverHandler("y", newHeight);
      },
    },
  },
  mounted() {
    this.workAreaCanvasPainter = new WorkAreaCanvasPainter(this.$refs.timeLine, this.$refs.timeLineCanvas, workAreaCanvasPainterOptions);
    // this.initializeResizeObserver();
    this.workAreaCanvasPainter.drawTimeLineTimeRisks(this.$props.navigationModel.viewportOrigin.x, this.$props.navigationModel.viewportScaleX, this.$props.navigationModel.absoluteTimeGridOptions.baseRiskTimeStep, this.$props.navigationModel.absoluteTimeGridOptions.intermediateRiskCount);
    document.addEventListener("mouseup", this.documentMouseUpHandler);
  },
  unmounted() {
    document.removeEventListener("mouseup", this.documentMouseUpHandler);
  },
  methods: {
    ...mapMutations(AUDIO_EDITOR_SUBMODULES.MIDI_EDITOR, ["setAudioCursorCoordinates", "setIsDraggingAudioCursor"]),
    resizeObserverHandler(axis, updatedSize) {
      this.workAreaCanvasPainter.updateCanvasSize(axis, updatedSize);
      this.workAreaCanvasPainter.drawTimeLineTimeRisks(this.$props.navigationModel.viewportOrigin.x, this.$props.navigationModel.viewportScaleX, this.$props.navigationModel.absoluteTimeGridOptions.baseRiskTimeStep, this.$props.navigationModel.absoluteTimeGridOptions.intermediateRiskCount);
    },
    canvasLeftMouseDownHandler() {
      this.setIsDraggingAudioCursor(true);
      this.setAudioCursorCoordinates({
        currentTime: this.$props.navigationModel.cursorCoordinates.x,
      });
    },
    cursorLeftMouseDownHandler() {
      this.setIsDraggingAudioCursor(true);
    },
    documentMouseUpHandler(event) {
      switch (event.button) {
        case 0: {
          //left mouse button
          this.setIsDraggingAudioCursor(false);
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
  },
};
</script>

<style scoped>
.time-line-panel {
  height: var(--audio-editor-time-line-height);
  background: red;
  display: flex;
}

.time-line {
  flex-grow: 1;
  display: flex;
}
.time-line-canvas {
  z-index: 10;
}
.time-line-cursor-wrapper {
  position: absolute;
  z-index: 30;
  top: -2px;
  width: 100%;
  height: calc(var(--audio-editor-time-line-height) + 5px);

  overflow: hidden;
  pointer-events: none;
}

.record-time-range-wrapper {
  position: absolute;
  z-index: 20;
  top: 0px;
  width: 100%;
  height: 100%;

  overflow: hidden;
  pointer-events: none;
  display: flex;
  align-iteseconds: center;
}
</style>
