<template>
  <div class="audio-view" @scroll="scrollHandler">
    <div ref="audioViewCanvasHolder" class="audio-view-canvas-holder">
      <canvas ref="audioViewCanvas" class="audio-view-canvas"></canvas>
    </div>
    <div class="record-time-range-holder">
      <RecordTimeRangeAudioView :navigation-model="navigationModel" />
    </div>
    <div
      class="audio-tracks-holder"
      :style="{
        transform: 'translateY(' + containerY + 'px)',
      }"
    >
      <div v-for="track in visualTracksSortedByY" :key="track.id" :class="['audio-track-wrapper', { 'selected-track-line': track.id === selectedTrackId }]" @click="selectTrackHandle(track.id)">
        <AudioTrack :navigation-model="navigationModel" :track="track" @drag-and-drop-segment-files-chosen="dragAndDropSegmentHandler" />
      </div>
      <div class="audio-track-wrapper">
        <DummyTrack :navigation-model="navigationModel" position="bottom" @drag-and-drop-segment-files-chosen="dragAndDropSegmentHandler" />
      </div>
    </div>
    <div class="audio-segments-holder">
      <AudioSegment v-for="visualSegment in visualSegments" :key="visualSegment.segment.id" :navigation-model="navigationModel" :track="visualSegment.track" :visual-segment="visualSegment.segment" />
    </div>
    <AudioViewCursor :navigation-model="navigationModel" />
    <BoxSelection />
  </div>
</template>

<script>
import { TrackEditorAudioViewCanvasPainter } from "@/audioeditor/visualmodel/canvaspainters/trackeditor/TrackEditorWorkAreaCanvasPainter";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";

import AudioTrack from "./audioview/AudioTrack.vue";
import AudioSegment from "./audioview/audiotrack/AudioSegment.vue";
import AudioViewCursor from "./audioview/AudioViewCursor.vue";
import RecordTimeRangeAudioView from "./audioview/RecordTimeRangeAudioView.vue";
import DummyTrack from "./audioview/DummyTrack.vue";
import BoxSelection from "./audioview/BoxSelection";
import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";
import { hexToRgbA } from "@/audioeditor/audiomodel/audioeditor/common/common";
import { mapActions, mapState, mapGetters } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { useResizeableCanvas } from "@audioeditor/composable/useResizeableCanvas";
import { ref, useTemplateRef } from "vue";

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
  name: "AudioView",
  components: {
    AudioTrack,
    AudioSegment,
    AudioViewCursor,
    RecordTimeRangeAudioView,
    DummyTrack,
    BoxSelection,
  },
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const canvasPainter = ref(null);
    function redrawAudioView(navigationModel) {
      const drawAudioViewPayload = {
        viewportState: {
          viewportOrigin: navigationModel.viewportOrigin,
          viewportScaleX: navigationModel.viewportScaleX,
          viewportScaleY: navigationModel.viewportScaleY,
        },
        timeGridOptions: {
          timeUnitType: navigationModel.timeUnitType,
          absoluteTimeGridOptions: navigationModel.absoluteTimeGridOptions,
          beatsTimeGridOptions: navigationModel.beatsTimeGridOptions,
        },
      };
      canvasPainter.value.drawAudioView(drawAudioViewPayload.viewportState, drawAudioViewPayload.timeGridOptions);
    }
    function formatDebugInfoForViewPort(newNavigationModel) {
      return [`cursor X=${newNavigationModel.cursorCoordinates.x} seconds`, `cursor Y=${newNavigationModel.cursorCoordinates.y} trackUnits`, `viewport X=${newNavigationModel.viewportOrigin.x} seconds`, `viewport Y=${newNavigationModel.viewportOrigin.y} trackUnits`];
    }

    function canvasWrapperResizeHandler(newCanvasWidth, newCanvasHeight) {
      canvasPainter.value.updateCanvasSize(newCanvasWidth, newCanvasHeight); //INFO: for some unknown reason the canvas parent takes up 4 pixels more than its parent
      redrawAudioView(props.navigationModel);
      if (AUDIO_EDITOR_CONFIGURATION.debug.isEnabled) {
        canvasPainter.value.drawDebugInfo(formatDebugInfoForViewPort(props.navigationModel));
      }
    }

    function initializeResizableCanvas() {
      useResizeableCanvas(useTemplateRef("audioViewCanvasHolder"), canvasWrapperResizeHandler);
    }
    initializeResizableCanvas();

    return {
      canvasPainter,
      redrawAudioView,
      formatDebugInfoForViewPort,
    };
  },
  data() {
    return {
      // canvasPainter: null,
      AUDIO_EDITOR_CONFIGURATION,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.currentUser,
    }),
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      selectedTrackId: (state) => state.selectedTrackId,
      visualTracksModel: (state) => state.visualTracksModel,
    }),
    ...mapGetters(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["visualTracksSortedByY", "visualSegments"]),
    containerY() {
      const result = Transformation.worldToViewport({ x: 0, y: this.visualTracksSortedByY[0]?.y ?? 0 }, this.$props.navigationModel).y;
      return result;
    },
    selectedColorRGBA() {
      const selectedTrackWrapperColor = hexToRgbA(this.visualTracksModel.tracks.get(this.selectedTrackId)?.trackColor.primary);
      return selectedTrackWrapperColor;
    },
  },
  watch: {
    navigationModel: {
      handler(oldNavigationModel, newNavigationModel) {
        this.redrawAudioView(newNavigationModel);
        if (AUDIO_EDITOR_CONFIGURATION.debug.isEnabled) {
          this.canvasPainter.drawDebugInfo(this.formatDebugInfoForViewPort(newNavigationModel));
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.canvasPainter = new TrackEditorAudioViewCanvasPainter(this.$refs.audioViewCanvas, trackEditorWorkAreaCanvasPainterOptions);
    this.redrawAudioView(this.navigationModel);
    if (AUDIO_EDITOR_CONFIGURATION.debug.isEnabled) {
      this.canvasPainter.drawDebugInfo(this.formatDebugInfoForViewPort(this.navigationModel));
    }
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["setSelectedTrack", "addSegmentsToExistingTrack", "addTracks"]),
    async selectTrackHandle(trackId) {
      await this.setSelectedTrack(trackId);
    },
    /**
     * This method is intended for prevent the scroll caused by input inside AudioSegment. preventDefault is not working due to cancelable false value
     * @param event
     */
    scrollHandler(event) {
      event.target.scrollLeft = 0;
    },

    async dragAndDropSegmentHandler({ file, trackId, startPosition, dummyPosition }) {
      const segment = {
        name: file.name,
        startPosition,
        volume: 1,
        url: URL.createObjectURL(file),
      };
      if (dummyPosition !== undefined) {
        const trackOptionsArray = [
          {
            musicianName: this.user?.name || file.name,
            soundSource: "custom",
            segments: [segment],
          },
        ];
        await this.addTracks({ commandArgs: { tracks: trackOptionsArray, directionToPush: dummyPosition } });
      } else {
        await this.addSegmentsToExistingTrack({
          commandArgs: {
            segments: [segment],
            trackId: trackId,
          },
        });
      }
    },
  },
};
</script>

<style scoped>
.audio-view {
  width: 100%;
  flex-grow: 1;

  display: flex;
  overflow: hidden;
  position: relative;
}
.record-time-range-holder {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
}

.audio-tracks-holder {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.audio-segments-holder {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.audio-track-wrapper {
  height: v-bind("AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackHeight+'px'");
}
.selected-track-line {
  background-color: v-bind("selectedColorRGBA");
}
.audio-track-wrapper:not(:last-child) {
  margin-bottom: v-bind("AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackVerticalGap+'px'");
}

.audio-view-canvas-holder {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
