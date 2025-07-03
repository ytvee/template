<template>
  <div ref="trackMixingToolsContainer" class="track-mixing-tools-container">
    <canvas ref="trackMixingToolsContainerCanvas" class="track-mixing-tools-container-canvas"></canvas>
    <div
      class="track-mixing-tools-holder"
      :style="{
        transform: 'translateY(' + containerY + 'px)',
      }"
    >
      <!-- <div class="dummy-wrapper" >
        <DragAndDrop position="top" @drag-and-drop-files-chosen="dragAndDropFilesChosenHandler"/>
      </div> -->
      <div v-for="track in visualTracksSortedByY" :key="track.id" :class="['track-mixing-tools-wrapper', { 'selected-track-line': track.id === selectedTrackId }]">
        <TrackMixingTools :track="track" />
      </div>
      <div class="dummy-wrapper">
        <DragAndDrop position="bottom" @drag-and-drop-files-chosen="dragAndDropFilesChosenHandler" />
      </div>
    </div>
  </div>
</template>

<script>
import { useResizeableCanvas } from "@audioeditor/composable/useResizeableCanvas";

import { TrackEditorAudioViewCanvasPainter } from "@/audioeditor/visualmodel/canvaspainters/trackeditor/TrackEditorWorkAreaCanvasPainter";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import TrackMixingTools from "./trackmixingtoolscontainer/TrackMixingTools.vue";
import DragAndDrop from "@audioeditor/components/common/DragAndDrop.vue";
import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";
import { mapActions, mapState, mapGetters } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { hexToRgbA } from "@/audioeditor/audiomodel/audioeditor/common/common";
import { shallowRef, useTemplateRef } from "vue";
import { DialogTemplateNames } from "@/data/modal/constants";

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
  name: "TrackMixingToolsContainer",
  components: {
    TrackMixingTools,
    DragAndDrop,
  },
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
    visualTracksModel: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const canvasPainter = shallowRef(null); //TODO: remake with shallow ref in other vue components

    function redrawTrackMixingToolsContainer(navigationModel) {
      const drawTrackMixingToolsContainerPayload = {
        viewportState: {
          viewportOrigin: navigationModel.viewportOrigin,
          viewportScaleX: navigationModel.viewportScaleX,
          viewportScaleY: navigationModel.viewportScaleY,
        },
      };
      canvasPainter.value.drawTrackMixingToolsContainer(drawTrackMixingToolsContainerPayload.viewportState, undefined);
    }
    function canvasWrapperResizeHandler(width, height) {
      canvasPainter.value.updateCanvasSize(width, height);
      redrawTrackMixingToolsContainer(props.navigationModel);
    }

    function initializeResizableCanvas() {
      useResizeableCanvas(useTemplateRef("trackMixingToolsContainer"), canvasWrapperResizeHandler);
    }

    initializeResizableCanvas();

    return {
      canvasPainter,
      redrawTrackMixingToolsContainer,
    };
  },
  data() {
    return {
      AUDIO_EDITOR_CONFIGURATION,
    };
  },
  computed: {
    ...mapGetters(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["visualTracksSortedByY"]),
    containerY() {
      return Transformation.worldToViewport({ x: 0, y: this.visualTracksSortedByY[0]?.y ?? 0 }, this.$props.navigationModel).y;
    },
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      selectedTrackId: (state) => state.selectedTrackId,
      selectedColorRGBA: (state) => {
        const track = state.visualTracksModel.tracks.get(state.selectedTrackId);
        return hexToRgbA(track?.trackColor.primary);
      },
    }),
  },
  watch: {
    navigationModel: {
      handler(oldNavigationModel, newNavigationModel) {
        this.redrawTrackMixingToolsContainer(newNavigationModel);
      },
      deep: true,
    },
  },
  mounted() {
    this.canvasPainter = new TrackEditorAudioViewCanvasPainter(this.$refs.trackMixingToolsContainerCanvas, trackEditorWorkAreaCanvasPainterOptions);
    this.redrawTrackMixingToolsContainer(this.navigationModel);
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["getSelectedTrack", "addTracks"]),
    async dragAndDropFilesChosenHandler({ files }) {
      this.$modal.openModalWithName(DialogTemplateNames.IMPORTING_SEGMENT, files, { isNonClosableByClickOnPeriphery: true });
    },
  },
};
</script>

<style scoped>
.track-mixing-tools-container {
  position: relative;
  overflow: hidden;
  min-width: var(--audio-editor-main-left-column-width);
  flex-grow: 1;
}
.track-mixing-tools-container-canvas {
  position: absolute;
  /* height: 100%; */
  /* background:  red; */
}

.track-mixing-tools-wrapper,
.dummy-wrapper {
  padding-right: var(--large-padding);
}
.track-mixing-tools-wrapper:not(:last-child) {
  margin-bottom: v-bind("AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackVerticalGap+'px'");
  border-radius: 22px 0px 0px 22px;
}
.dummy-wrapper {
  margin-bottom: v-bind("AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackVerticalGap+'px'");
}
.selected-track-line {
  background-color: v-bind("selectedColorRGBA");
}
</style>
