<template>
  <div class="time-line-panel">
    <div ref="upper-section" class="upper-section" :class="{ 'zoom-out': isZoomOut }"></div>
    <div ref="timeLineCanvasHolder" class="time-line-canvas-holder">
      <canvas ref="timeLineCanvas" class="time-line-canvas" width="0" height="35" @mousedown.left="canvasLeftMouseDownHandler"></canvas>
    </div>
    <div class="record-time-range-wrapper">
      <RecordTimeRange :navigation-model="navigationModel" />
    </div>
    <div class="time-line-cursor-wrapper">
      <TimeLineCursor :navigation-model="navigationModel" />
    </div>
  </div>
</template>

<script>
import { useResizeableCanvas } from "@audioeditor/composable/useResizeableCanvas";
import { useClickAndDrag } from "@/audioeditor/composable/useClickAndDrag";
import { ref, useTemplateRef } from "vue";

import { useStore } from "vuex";
import { useMapState, useMapMutations } from "@audioeditor/composable/utils/useStoreMaps";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { TrackEditorTimeLineCanvasPainter } from "@/audioeditor/visualmodel/canvaspainters/trackeditor/TrackEditorWorkAreaCanvasPainter";
import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";
import TimeLineCursor from "./timelinepanel/TimeLineCursor.vue";
import RecordTimeRange from "./timelinepanel/RecordTimeRange.vue";

const trackEditorWorkAreaCanvasPainterOptions = {
  timeGridOptions: {
    BASE_RISK_WIDTH: AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.gridBaseRiskWidth,
    BASE_RISK_HEIGHT: AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.timeLineGridBaseRiskHeight,
    BASE_RISK_COLOR: AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.gridBaseRiskColor,

    INTERMEDIATE_RISK_WIDTH: AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.gridIntermediateRiskWidth,
    INTERMEDIATE_RISK_HEIGHT: AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.timeLineGridIntermediateRiskHeight, //px
    INTERMEDIATE_RISK_COLOR: AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.gridIntermediateRiskColor,

    TIME_LABEL_COLOR: AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.timeLineLabelColor,
    TIME_LABEL_FONT: AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.timeLineLabelFont,
  },
};

function setupResizableCanvas(props) {
  const canvasPainter = ref(null);
  function redrawTimeLine(navigationModel) {
    const drawTimeLinePayload = {
      viewportState: {
        viewportOrigin: navigationModel.viewportOrigin,
        viewportScaleX: navigationModel.viewportScaleX,
      },
      timeGridOptions: {
        timeUnitType: navigationModel.timeUnitType,
        absoluteTimeGridOptions: navigationModel.absoluteTimeGridOptions,
        beatsTimeGridOptions: navigationModel.beatsTimeGridOptions,
      },
    };
    canvasPainter.value.drawTimeLine(drawTimeLinePayload.viewportState, drawTimeLinePayload.timeGridOptions);
  }
  function canvasWrapperResizeHandler(width, height) {
    canvasPainter.value.updateCanvasSize(width, height);
    redrawTimeLine(props.navigationModel);
  }

  function initializeResizableCanvas() {
    useResizeableCanvas(useTemplateRef("timeLineCanvasHolder"), canvasWrapperResizeHandler);
  }

  initializeResizableCanvas();
  return {
    canvasPainter,
    redrawTimeLine,
  };
}
function setBodyCursor(value) {
  document.body.style.cursor = value;
}
function setupUpperSectionClickAndDrag() {
  const store = useStore();
  const isZoomOut = ref(false);

  let oldY;
  const startCallback = (event, x, y) => {
    oldY = y;
  };
  /**
   *  (delta * x * viewportScaleX - viewportScaleX) / viewportScaleX = delta * timeScaleMultiplier
   */
  const dragCallback = (event, x, y) => {
    const timeScaleMultiplier = AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.timeScaleMultiplier;
    const delta = -(y - oldY);
    const sx = delta * timeScaleMultiplier + 1;
    store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION + "/" + "setTimeScale", { sx });
    oldY = y;

    if (delta < 0) {
      isZoomOut.value = false;
      setBodyCursor("zoom-in");
    } else if (delta > 0) {
      isZoomOut.value = true;
      setBodyCursor("zoom-out");
    }
  };
  const endCallBack = () => {
    setBodyCursor("");
  };
  useClickAndDrag(useTemplateRef("upper-section"), { dragCallback, startDragCallback: startCallback, endDragCallback: endCallBack });
  return {
    isZoomOut,
  };
}
function setupLowerSectionClickAndDrag() {
  const { navigationModel } = useMapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, {
    navigationModel: (state) => state,
  });
  const storeMutationsNavigation = useMapMutations(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, ["setAudioCursorCoordinates"]);

  const startAudioCursorCoordinates = { x: 0, y: 0 };
  const dragCallback = (event, pointerX, pointerY, movementX, movementY, pointerdownEvent, movementXFromStart, movementYFromStart) => {
    switch (pointerdownEvent.button) {
      case 0: {
        storeMutationsNavigation.setAudioCursorCoordinates({
          startAudioCursorCoordinates,
          movementXFromStart,
          movementYFromStart,
        });
        break;
      }
      case 1: {
        break;
      }
      case 2: {
        break;
      }
    }
  };
  const startCallback = (event) => {
    switch (event.button) {
      case 0: {
        Object.assign(startAudioCursorCoordinates, navigationModel.value.audioCursorCoordinates);
        storeMutationsNavigation.setAudioCursorCoordinates({
          currentTime: navigationModel.value.cursorCoordinates.x,
        });
        startAudioCursorCoordinates.x = navigationModel.value.cursorCoordinates.x;
        break;
      }
      case 1: {
        break;
      }
      case 2: {
        break;
      }
    }
  };
  const endCallBack = (event, pointerX, pointerY, pointerdownEvent) => {
    switch (pointerdownEvent.button) {
      case 0: {
        break;
      }
      case 1: {
        break;
      }
      case 2: {
        break;
      }
    }
  };
  const clickCallback = (event) => {
    switch (event.button) {
      case 0: {
        break;
      }
      case 1: {
        break;
      }
      case 2: {
        break;
      }
    }
  };

  const timeLineCanvasRef = useTemplateRef("timeLineCanvas");
  useClickAndDrag(timeLineCanvasRef, { dragCallback, startDragCallback: startCallback, endDragCallback: endCallBack, clickCallback }, { separateClickAndDrag: false });
}

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
  },
  setup(props) {
    const setupResizableCanvasResult = setupResizableCanvas(props);
    const setupUpperSectionClickAndDragResult = setupUpperSectionClickAndDrag(props);
    setupLowerSectionClickAndDrag(props);

    return {
      ...setupResizableCanvasResult,
      ...setupUpperSectionClickAndDragResult,
    };
  },
  data() {
    return {};
  },
  watch: {
    navigationModel: {
      handler(newNavigationModel) {
        //TODO: reduce extra canvas updates
        this.redrawTimeLine(newNavigationModel);
      },
      deep: true,
    },
  },

  mounted() {
    this.canvasPainter = new TrackEditorTimeLineCanvasPainter(this.$refs.timeLineCanvas, trackEditorWorkAreaCanvasPainterOptions);
    this.redrawTimeLine(this.$props.navigationModel);
  },
};
</script>

<style scoped>
.time-line-panel {
  height: var(--audio-editor-time-line-height);
  display: flex;
  position: relative;
  overflow: hidden;
}

.upper-section {
  position: absolute;
  /* background: red; */
  width: 100%;
  height: 50%;
  cursor: zoom-in;
}

.zoom-out {
  cursor: zoom-out;
}

.time-line-canvas-holder {
  width: 100%;
}

.time-line-canvas {
  z-index: 10;
}

.time-line-cursor-wrapper {
  position: absolute;
  z-index: 30;
  width: 100%;
  height: var(--audio-editor-time-line-height);

  overflow: hidden;
  pointer-events: none;
}

.record-time-range-wrapper {
  position: absolute;
  bottom: 0px;
  width: 0px;
}
</style>
