<template>
  <div ref="midiView" class="audio-view">
    <canvas ref="midiViewCanvas" height="133" class="audio-view-canvas"></canvas>
    <div class="record-time-range-holder">
      <RecordTimeRangeMidiView :navigation-model="navigationModel" />
    </div>
    <div
      class="audio-tracks-holder"
      :style="{
        transform: 'translateY(' + containerY + 'px)',
      }"
    >
      <div v-for="track in visualTracksModel.tracks" :key="track.id" class="audio-track-wrapper">
        <AudioTrack :navigation-model="navigationModel" :track-id="track.id" :track="track" />
      </div>
    </div>
    <MidiViewCursor :navigation-model="navigationModel" />
  </div>
</template>

<script>
import { WorkAreaCanvasPainter, convertWorldOffsetToClientOffset } from "@/audioeditor/audiomodel/audioeditor/common/canvaspainters/canvasPainter";
import MidiViewCursor from "./midiview/MidiViewCursor.vue";
import RecordTimeRangeMidiView from "./midiview/RecordTimeRangeMidiView.vue";
import { KeyBoardKeyName } from "@audioeditor/audiomodel/audioeditor/midieditor/midiUtils";
import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";

const workAreaCanvasPainterOptions = {
  BASE_RISK_WIDTH: 1, //px
  BASE_RISK_COLOR: "rgba(103, 103, 103, 0.5)",

  INTERMEDIATE_RISK_WIDTH: 1, //px
  INTERMEDIATE_RISK_COLOR: "rgba(103, 103, 103, 0.2)",
};
export default {
  name: "MidiView",
  components: {
    MidiViewCursor,
    RecordTimeRangeMidiView,
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
      AUDIO_EDITOR_CONFIGURATION,
    };
  },
  computed: {
    containerY() {
      const offsetNoteUnits = -this.$props.navigationModel.viewportOrigin.y;
      return convertWorldOffsetToClientOffset(offsetNoteUnits, this.$props.navigationModel.noteScale);
    },
  },
  watch: {
    navigationModel: {
      handler() {
        const midiKeyTracksOptions = {
          zeroOctave: 0,
          zeroNoteName: KeyBoardKeyName.C,
        };
        const timeGridOptions = {
          baseRiskTimeStep: this.$props.navigationModel.absoluteTimeGridOptions.baseRiskTimeStep,
          intermediateRiskCount: this.$props.navigationModel.absoluteTimeGridOptions.intermediateRiskCount,
        };
        this.workAreaCanvasPainter.drawMidiViewCanvas(this.$props.navigationModel.viewportOrigin.x, this.$props.navigationModel.viewportScaleX, this.$props.navigationModel.viewportOrigin.y, this.$props.navigationModel.noteScale, midiKeyTracksOptions, timeGridOptions);
        this.workAreaCanvasPainter.drawDebugInfo(this.formatDebugInfoForViewPort(this.$props.navigationModel));
      },
      deep: true,
    },
    resizeOberverWidth: {
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
    this.workAreaCanvasPainter = new WorkAreaCanvasPainter(this.$refs.midiView, this.$refs.midiViewCanvas, workAreaCanvasPainterOptions);
    const midiKeyTracksOptions = {
      zeroOctave: 0,
      zeroNoteName: KeyBoardKeyName.C,
    };
    const timeGridOptions = {
      baseRiskTimeStep: this.$props.navigationModel.absoluteTimeGridOptions.baseRiskTimeStep,
      intermediateRiskCount: this.$props.navigationModel.absoluteTimeGridOptions.intermediateRiskCount,
    };
    this.workAreaCanvasPainter.drawMidiViewCanvas(this.$props.navigationModel.viewportOrigin.x, this.$props.navigationModel.viewportScaleX, this.$props.navigationModel.viewportOrigin.y, this.$props.navigationModel.noteScale, midiKeyTracksOptions, timeGridOptions);
    this.workAreaCanvasPainter.drawDebugInfo(this.formatDebugInfoForViewPort(this.$props.navigationModel));
  },
  methods: {
    convertWorldOffsetToClientOffset,
    resizeObserverHandler(axis, updatedSize) {
      this.workAreaCanvasPainter.updateCanvasSize(axis, updatedSize);
      const midiKeyTracksOptions = {
        zeroOctave: 0,
        zeroNoteName: KeyBoardKeyName.C,
      };
      const timeGridOptions = {
        baseRiskTimeStep: this.$props.navigationModel.absoluteTimeGridOptions.baseRiskTimeStep,
        intermediateRiskCount: this.$props.navigationModel.absoluteTimeGridOptions.intermediateRiskCount,
      };
      this.workAreaCanvasPainter.drawMidiViewCanvas(this.$props.navigationModel.viewportOrigin.x, this.$props.navigationModel.viewportScaleX, this.$props.navigationModel.viewportOrigin.y, this.$props.navigationModel.noteScale, midiKeyTracksOptions, timeGridOptions);
      this.workAreaCanvasPainter.drawDebugInfo(this.formatDebugInfoForViewPort(this.$props.navigationModel));
    },
    formatDebugInfoForViewPort(newNavigationModel) {
      return [`cursor X=${newNavigationModel.cursorCoordinates.x} seconds`, `cursor Y=${newNavigationModel.cursorCoordinates.y} noteUnits`, `viewport X=${newNavigationModel.viewportOrigin.x} seconds`, `viewport Y=${newNavigationModel.viewportOrigin.y} noteUnits`];
    },
  },
};
</script>

<style scoped>
.audio-view {
  width: 100%;
  height: 100%;

  display: flex;
  overflow: hidden;
  position: relative;
}
.record-time-range-holder {
  position: absolute;
  top: 0;
  width: 100%;
  height: calc(100% - var(--audio-editor-time-line-height));
}
.audio-tracks-holder {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
.audio-track-wrapper {
}
.audio-track-wrapper:not(:last-child) {
  margin-bottom: v-bind("AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackVerticalGap+'px'");
}
</style>
