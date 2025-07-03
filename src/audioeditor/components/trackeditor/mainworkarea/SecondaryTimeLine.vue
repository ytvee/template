<template>
  <div class="secondary-time-line-panel">
    <div ref="timeLineCanvasHolder" class="time-line-canvas-holder">
      <canvas ref="timeLineCanvas" class="time-line-canvas" width="0" height="35"></canvas>
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
import { useTemplateRef, shallowRef } from "vue";
import { useClickAndDrag } from "@/audioeditor/composable/useClickAndDrag";
import { useMapState, useMapMutations } from "@audioeditor/composable/utils/useStoreMaps";

import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { TrackEditorSecondaryTimeLineCanvasPainter } from "@/audioeditor/visualmodel/canvaspainters/trackeditor/TrackEditorWorkAreaCanvasPainter";
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

export default {
  name: "SecondaryTimeLine",
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
    const canvasPainter = shallowRef(null);
    function redrawTimeLine(navigationModel) {
      const drawTimeLinePayload = {
        viewportState: {
          viewportOrigin: navigationModel.viewportOrigin,
          viewportScaleX: navigationModel.viewportScaleX,
        },
        timeGridOptions: {
          timeUnitType: navigationModel.secondaryTimeLineTimeUnitType,
          absoluteTimeGridOptions: {
            baseRiskTimeStep: navigationModel.absoluteTimeGridOptions.baseRiskTimeStep,
            baseRiskTimeStepPower: navigationModel.absoluteTimeGridOptions.baseRiskTimeStepPower,
            intermediateRiskCount: navigationModel.absoluteTimeGridOptions.intermediateRiskCount,
          },
          beatsTimeGridOptions: {
            tempo: navigationModel.beatsTimeGridOptions.tempo,
            timeSignature: navigationModel.beatsTimeGridOptions.timeSignature,
          },
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

    function initializeClickAndDrag() {
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

    initializeResizableCanvas();
    initializeClickAndDrag();
    return {
      canvasPainter,
      redrawTimeLine,
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
    this.canvasPainter = new TrackEditorSecondaryTimeLineCanvasPainter(this.$refs.timeLineCanvas, trackEditorWorkAreaCanvasPainterOptions);
    this.redrawTimeLine(this.$props.navigationModel);

    document.addEventListener("mouseup", this.documentMouseUpHandler);
  },
  unmounted() {
    document.removeEventListener("mouseup", this.documentMouseUpHandler);
  },
};
</script>

<style scoped>
.secondary-time-line-panel {
  height: var(--audio-editor-time-line-height);
  display: flex;
  position: relative;
  overflow: hidden;
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
