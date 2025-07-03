<template>
  <div class="work-area">
    <div class="work-area-main-section">
      <div class="keyboard-section-wrapper">
        <KeyBoardWorkAreaSection :navigation-model="navigationModel" />
      </div>
      <div ref="audioViewTimeLineRef" class="midi-view-time-line-wrapper">
        <MidiView :navigation-model="navigationModel" :resize-oberver-width="resizeOberverWidth" :resize-observer-height="resizeObserverHeight" @mousedown.middle="middleMouseDownHandler" @mousedown.right="rightMouseDownHandler" @mouseup.right="rightMouseUpHandler" @contextmenu="contextMenuHandler" />
        <div class="time-line-panel-wrapper">
          <TimeLinePanel :navigation-model="navigationModel" :resize-oberver-width="resizeOberverWidth" :resize-observer-height="resizeObserverHeight" />
        </div>
      </div>
    </div>
    <div class="work-area-settings-wrapper">
      <WorkAreaSettings :navigation-model="navigationModel" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { useResizeObserver } from "@vueuse/core";
import { isTouchDeviceEvent } from "@/audioeditor/audiomodel/audioeditor/common/miscellaneous";

import KeyBoardWorkAreaSection from "./workarea/KeyBoardWorkAreaSection.vue";
import MidiView from "./workarea/MidiView.vue";
import TimeLinePanel from "./workarea/TimeLinePanel.vue";
import WorkAreaSettings from "./workarea/WorkAreaSettings.vue";

export default {
  name: "MainWorkArea",
  components: {
    KeyBoardWorkAreaSection,
    MidiView,
    TimeLinePanel,
    WorkAreaSettings,
  },
  data() {
    return {
      oldMouseClientX: 0,
      oldMouseClientY: 0,

      resizeOberverWidth: 0,
      resizeObserverHeight: 0,
    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      navigationModel: (state) => state.navigationModel,
      // visualTracksModel: (state) => state.visualTracksModel,
    }),
  },
  mounted() {
    document.addEventListener("mousemove", this.mouseMoveHandler); //TODO: useEventListener
    document.addEventListener("mouseup", this.documentMouseUpHandler);
    document.addEventListener("contextmenu", this.documentContextMenuHandler);
    this.initializeResizeObserver();

    this.$eventBus.on("work-area-settings-time-scale-update", this.timeScaleUpdateHandler);
    this.$eventBus.on("work-area-settings-note-scale-update", this.noteScaleUpdateHandler);

    this.$eventBus.on("work-area-settings-base-risk-time-step-update", this.baseRiskTimeStepUpdateHandler);
    this.$eventBus.on("work-area-settings-intermediate-risk-count-update", this.intermediateRiskCountUpdateHandler);
    this.$eventBus.on("drag-and-drop-dummy-mouse-move", this.mouseMoveHandler);
  },
  unmounted() {
    document.removeEventListener("mousemove", this.mouseMoveHandler);
    document.removeEventListener("mouseup", this.documentMouseUpHandler);
    document.removeEventListener("contextmenu", this.documentContextMenuHandler);
    this.$eventBus.off("work-area-settings-time-scale-update", this.timeScaleUpdateHandler);
    this.$eventBus.off("work-area-settings-note-scale-update", this.noteScaleUpdateHandler);
    this.$eventBus.off("work-area-settings-base-risk-time-step-update", this.baseRiskTimeStepUpdateHandler);
    this.$eventBus.off("work-area-settings-intermediate-risk-count-update", this.intermediateRiskCountUpdateHandler);
    this.$eventBus.off("drag-and-drop-dummy-mouse-move", this.mouseMoveHandler);
  },
  methods: {
    ...mapMutations(AUDIO_EDITOR_SUBMODULES.MIDI_EDITOR, ["setCursorCoordinates", "setIsDraggingAudioCursor", "setAudioCursorCoordinates", "setIsDraggingViewPort", "setViewPortCoordinates", "setTimeScale", "setNoteScale", "setBaseRiskTimeStep", "setIntermediateRiskCount"]),
    initializeResizeObserver() {
      const resizeObserverCallback = (entries) => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;

        this.resizeOberverWidth = width;
        this.resizeObserverHeight = height;
      };
      useResizeObserver(this.$refs.audioViewTimeLineRef, (entries) => {
        window.requestAnimationFrame(() => {
          if (!Array.isArray(entries) || !entries.length) {
            return;
          }
          resizeObserverCallback(entries);
        });
      });
    },

    /* mouse events handlers */
    mouseMoveHandler(event) {
      if (isTouchDeviceEvent()) {
        return;
      }
      const offset = this.$refs.audioViewTimeLineRef.getBoundingClientRect();
      this.setCursorCoordinates({
        offsetPixelsX: event.clientX - offset.left,
        offsetPixelsY: event.clientY - offset.top,
      });
      this.setAudioCursorCoordinates({
        //TODO: remove. Use useClickAndDrag
        offsetPixelsX: event.clientX - this.oldMouseClientX,
        offsetPixelsY: event.clientY - this.oldMouseClientY,
      });
      this.setViewPortCoordinates({
        //TODO: remove. Use useClickAndDrag
        offsetPixelsX: event.clientX - this.oldMouseClientX,
        offsetPixelsY: event.clientY - this.oldMouseClientY,
      });

      this.oldMouseClientX = event.clientX;
      this.oldMouseClientY = event.clientY;
    },
    middleMouseDownHandler() {
      this.setIsDraggingViewPort(true);
    },
    contextMenuHandler(event) {
      event.preventDefault();
    },
    rightMouseDownHandler() {
      this.setIsDraggingAudioCursor(true);
    },
    rightMouseUpHandler() {
      this.setIsDraggingAudioCursor(false);
    },
    documentMouseUpHandler(event) {
      //TODO: remove. Use useClickAndDrag
      switch (event.button) {
        case 0: {
          //left mouse button
          break;
        }
        case 1: {
          //middle mouse button
          this.setIsDraggingViewPort(false);
          break;
        }
        case 2: {
          //right mouse button
          this.setIsDraggingAudioCursor(false);
          break;
        }
      }
    },
    // documentContextMenuHandler(event) {
    // event.preventDefault(); //TODO: uncommit this line after when debug is finished
    // },

    /* settings handlers */
    timeScaleUpdateHandler(timeScale) {
      this.setTimeScale(timeScale);
    },
    noteScaleUpdateHandler(noteScale) {
      this.setNoteScale(noteScale);
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
* {
  --audio-editor-midi-editor-work-area-keyboard-width: 100px; /* TODO: remake */
}
.work-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.work-area-main-section {
  flex-grow: 1;
  display: flex;
}

.place-holder {
  height: var(--audio-editor-time-line-height);
  background: red;
  align-self: end;
  flex-shrink: 0;
}

.midi-view-time-line-wrapper {
  max-width: calc(100% - var(--audio-editor-midi-editor-work-area-keyboard-width));
  flex-grow: 1;
  position: relative;
}

.time-line-panel-wrapper {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.work-area-settings-wrapper {
  position: absolute;
  right: 0;
}
</style>
