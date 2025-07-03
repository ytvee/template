<template>
  <div class="main-work-area">
    <div class="main-work-area-content">
      <div class="central-section">
        <div class="left-column">
          <TrackMixingToolsHeaderMenu />
          <TrackMixingToolsContainer :navigation-model="navigationModel" :visual-tracks-model="visualTracksModel" />
        </div>
        <div class="audio-view-time-line-wrapper">
          <div class="time-line-panel-wrapper">
            <TimeLinePanel :navigation-model="navigationModel" />
          </div>
          <div ref="audioViewDummyRef"></div>
          <div ref="audioViewWrapper" class="audio-view-wrapper">
            <AudioView :navigation-model="navigationModel" @pointerdown="pointerDownHandler" @wheel="wheelHandler" @contextmenu="contextMenuHandler" />
          </div>
        </div>
      </div>
      <div class="bottom-panel">
        <div class="bottom-panel-placeholder"></div>
        <div class="secondary-time-line-wrapper">
          <SecondaryTimeline :navigation-model="navigationModel" />
        </div>
      </div>
    </div>
    <!-- <div class="work-area-settings-wrapper">
      <WorkAreaSettings :navigation-model="navigationModel" />
    </div> -->
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { useTemplateRef } from "vue";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { useMapState, useMapMutations, useMapActions } from "@audioeditor/composable/utils/useStoreMaps";

import TrackMixingToolsHeaderMenu from "./mainworkarea/TrackMixingToolsHeaderMenu.vue";
import TrackMixingToolsContainer from "./mainworkarea/TrackMixingToolsContainer.vue";
import AudioView from "./mainworkarea/AudioView.vue";
import TimeLinePanel from "./mainworkarea/TimeLinePanel.vue";
import SecondaryTimeline from "./mainworkarea/SecondaryTimeLine.vue";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import { useEventListener } from "@vueuse/core";
import { useClickAndDrag } from "@/audioeditor/composable/useClickAndDrag";
import { useConstantSelectors } from "@audioeditor/composable/useConstantSelectors";
// import WorkAreaSettings from "./mainworkarea/WorkAreaSettings.vue";

export default {
  name: "MainWorkArea",
  components: {
    TrackMixingToolsHeaderMenu,
    TrackMixingToolsContainer,
    AudioView,
    TimeLinePanel,
    SecondaryTimeline,
    // WorkAreaSettings,
  },
  setup() {
    const storeMutationsNavigation = useMapMutations(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, ["setAudioCursorCoordinates"]);
    const storeActionsEditingTooles = useMapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS, ["startBoxSelection", "endBoxSelection", "clearSelection"]);
    const { navigationModel } = useMapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, {
      navigationModel: (state) => state,
    });
    const constantSelectors = useConstantSelectors();

    const audioViewDummyRef = useTemplateRef("audioViewDummyRef");

    let isBoxSelectionStarted = false;

    /* audio cursor */
    const startAudioCursorCoordinates = { x: 0, y: 0 };
    /* /audio corsor */

    function boxSelectionStartHandler(event, selectionMode) {
      isBoxSelectionStarted = true;
      const pointerPoint = {
        x: event.clientX,
        y: event.clientY,
      };
      const canvasOffset = audioViewDummyRef.value.getBoundingClientRect();
      const boxSelectionStartPoint = Transformation.windowToWorld(pointerPoint, navigationModel.value, { x: canvasOffset.x, y: canvasOffset.y });
      storeActionsEditingTooles.startBoxSelection({ commandArgs: { boxSelectionStartPoint, selectionMode } });
    }
    function boxSelectionEndHandler(event) {
      if (!isBoxSelectionStarted) {
        return;
      }
      isBoxSelectionStarted = false;
      const canvasOffset = audioViewDummyRef.value.getBoundingClientRect();
      const pointerPoint = { x: event.clientX, y: event.clientY };
      const boxSelectionEndPoint = Transformation.windowToWorld(pointerPoint, navigationModel.value, { x: canvasOffset.x, y: canvasOffset.y });
      storeActionsEditingTooles.endBoxSelection({ commandArgs: { boxSelectionEndPoint } });
    }

    const dragCallback = (event, pointerX, pointerY, movementX, movementY, pointerdownEvent, movementXFromStart, movementYFromStart) => {
      switch (pointerdownEvent.button) {
        case 0: {
          break;
        }
        case 1: {
          break;
        }
        case 2: {
          storeMutationsNavigation.setAudioCursorCoordinates({
            startAudioCursorCoordinates,
            movementXFromStart,
            movementYFromStart,
          });
          break;
        }
      }
    };
    function isEventNotOnSubControlElement(event) {
      return event.target.closest(`.${constantSelectors.AUDIO_SEGMENT}, .${constantSelectors.WORKAREA_TOOLTIP}`) === null && !event.ctrlKey && !event.altKey;
    }
    const startCallback = (event) => {
      switch (event.button) {
        case 0: {
          if (isEventNotOnSubControlElement(event)) {
            boxSelectionStartHandler(event, "replace");
          }
          if (event.ctrlKey) {
            boxSelectionStartHandler(event, "add");
          }
          if (event.altKey) {
            boxSelectionStartHandler(event, "substract");
          }
          break;
        }
        case 1: {
          break;
        }
        case 2: {
          Object.assign(startAudioCursorCoordinates, navigationModel.value.audioCursorCoordinates);
          break;
        }
      }
    };
    const endCallBack = (event, pointerX, pointerY, pointerdownEvent) => {
      switch (pointerdownEvent.button) {
        case 0: {
          boxSelectionEndHandler(event);
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
          if (isEventNotOnSubControlElement(event)) {
            storeActionsEditingTooles.clearSelection({});
            storeMutationsNavigation.setAudioCursorCoordinates({
              currentTime: navigationModel.value.cursorCoordinates.x,
            });
          }
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
    useClickAndDrag(useTemplateRef("audioViewWrapper"), { dragCallback, startDragCallback: startCallback, endDragCallback: endCallBack, clickCallback }, { separateClickAndDrag: true });

    return {
      navigationModel,
      boxSelectionStartHandler,
      boxSelectionEndHandler,
    };
  },
  data() {
    return {
      oldMouseClientX: 0, //TODO: use useClickAndDrag instead
      oldMouseClientY: 0,
    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      visualTracksModel: (state) => state.visualTracksModel,
    }),
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS, {
      visualMultiSegmentSelection: (state) => state.visualMultiSegmentSelection,
    }),
  },
  mounted() {
    useEventListener(document, "pointermove", this.documentPointerMoveHandler);
    useEventListener(document, "pointerup", this.documentMouseUpHandler);
    useEventListener(document, "contextmenu", this.documentContextMenuHandler);

    this.$eventBus.on("work-area-settings-time-scale-update", this.timeScaleUpdateHandler); //TODO: remove from here
    this.$eventBus.on("work-area-settings-base-risk-time-step-update", this.baseRiskTimeStepUpdateHandler);
    this.$eventBus.on("work-area-settings-intermediate-risk-count-update", this.intermediateRiskCountUpdateHandler);
    this.$eventBus.on("drag-and-drop-dummy-mouse-move", this.documentPointerMoveHandler);
  },
  unmounted() {
    this.$eventBus.off("work-area-settings-time-scale-update", this.timeScaleUpdateHandler); //TODO: remove from here
    this.$eventBus.off("work-area-settings-base-risk-time-step-update", this.baseRiskTimeStepUpdateHandler);
    this.$eventBus.off("work-area-settings-intermediate-risk-count-update", this.intermediateRiskCountUpdateHandler);
    this.$eventBus.off("drag-and-drop-dummy-mouse-move", this.documentPointerMoveHandler);
  },
  methods: {
    ...mapMutations(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["setVisualTracks"]),
    ...mapMutations(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, ["setCursorCoordinates", "setIsDraggingViewPort", "setViewPortCoordinates", "setBaseRiskTimeStep", "setIntermediateRiskCount"]),
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, ["setTimeScale"]),
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS, ["modifyBoxSelection"]),
    /* mouse events handlers */
    documentPointerMoveHandler(event) {
      //TODO: use useClickAndDrag instead
      const canvasOffset = this.$refs.audioViewDummyRef.getBoundingClientRect();
      this.setCursorCoordinates({
        offsetPixelsX: event.clientX - canvasOffset.left,
        offsetPixelsY: event.clientY - canvasOffset.top,
      });
      this.setViewPortCoordinates({
        offsetPixelsX: event.clientX - this.oldMouseClientX,
        offsetPixelsY: event.clientY - this.oldMouseClientY,
      });
      if (this.visualMultiSegmentSelection.isBoxSelectionActive) {
        this.boxSelectionModifyHandler(event, canvasOffset);
      }

      this.oldMouseClientX = event.clientX; //TODO: use useClickAndDrag instead
      this.oldMouseClientY = event.clientY;
    },

    boxSelectionModifyHandler(event, canvasOffset) {
      const pointerPoint = { x: event.clientX, y: event.clientY };
      const boxSelectionEndPoint = Transformation.windowToWorld(pointerPoint, this.navigationModel, { x: canvasOffset.x, y: canvasOffset.y });

      this.modifyBoxSelection({ commandArgs: { boxSelectionEndPoint } });
    },

    pointerDownHandler(event) {
      switch (event.button) {
        case 0: {
          //left mouse button
          break;
        }
        case 1: {
          //middle mouse button
          this.setIsDraggingViewPort(true);
          break;
        }
        case 2: {
          //right mouse button
        }
      }
    },
    wheelHandler(event) {
      event.preventDefault();
      this.setIsDraggingViewPort(true);
      this.setViewPortCoordinates({
        offsetPixelsX: -event.deltaX,
        offsetPixelsY: -event.deltaY,
      });
      this.setIsDraggingViewPort(false);
    },
    contextMenuHandler(event) {
      event.preventDefault();
    },

    documentMouseUpHandler(event) {
      switch (event.button) {
        case 0: {
          //left mouse button
          break;
        }
        case 1: {
          //middle mouse button
          this.setIsDraggingViewPort(false); //TODO: use clickAndDrag instead
          break;
        }
        case 2: {
          //right mouse button
          break;
        }
      }
    },
    // documentContextMenuHandler(event) {
    // event.preventDefault(); //TODO: uncommit this line after when debug is finished
    // },

    /* settings handlers */
    timeScaleUpdateHandler(timeScale) {
      this.setTimeScale({ viewportScaleX: timeScale });
    },
    baseRiskTimeStepUpdateHandler(baseRiskTimeStep) {
      this.setBaseRiskTimeStep(baseRiskTimeStep);
    },
    intermediateRiskCountUpdateHandler(intermediateRiskCount) {
      this.setIntermediateRiskCount(intermediateRiskCount);
    },
  },
};
</script>

<style scoped>
.main-work-area {
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-work-area-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.central-section {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
}
.left-column {
  display: flex;
  flex-direction: column;
}
.audio-view-time-line-wrapper {
  max-width: calc(100% - var(--audio-editor-main-left-column-width) - var(--audio-editor-in-left-column-gap));
  flex-grow: 1;
  position: relative;

  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.audio-view-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
}

.time-line-panel-wrapper {
  width: 100%;
}
.bottom-panel {
  height: var(--audio-editor-bottom-panel-height);

  /* border: 1px solid red; */

  display: flex;
}
.bottom-panel-placeholder {
  width: calc(var(--audio-editor-main-left-column-width) + 20px);
  flex-shrink: 0;
}
.secondary-time-line-wrapper {
  flex-grow: 1;
  overflow: hidden;
}

.work-area-settings-wrapper {
  position: absolute;
  z-index: 40;
  right: 0;
}
</style>
