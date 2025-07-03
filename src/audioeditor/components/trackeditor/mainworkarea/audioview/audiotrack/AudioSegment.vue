<template>
  <div
    :style="{
      transform: 'translate(' + getSegmentTranslate + ')',
      width: audioSegmentWidth + 'px',
    }"
    :class="{ [constantSelectors.AUDIO_SEGMENT]: true, 'color-input-focused': isColorInputFocused }"
  >
    <div class="audio-segment-header">
      <div class="name-input-holder" :class="{ deactivated: !isNameInputActive }" @dblclick="nameInputHolderDblclickHandler">
        <div ref="nameInput" type="text" role="textbox" contenteditable @input="nameInputHandler" @focus="nameInputFocusHandler" @blur="nameInputBlurHandler">{{ visualSegment.name }}</div>
        <!-- <input type="text" ref="nameInput" @input="nameInputHandler" @focus="nameInputFocusHandler" @blur="nameInputBlurHandler" :value="visualSegment.name" @scroll="scrollHandler"> -->
      </div>
      <div class="header-placeholder"></div>
    </div>
    <div class="audio-segment-main" :class="{ 'selection-candidate': isSelectionCandidate, selected: isSelected }">
      <div ref="canvasWrapper" class="canvas-wrapper">
        <div
          ref="canvasPositioner"
          class="canvas-positioner"
          :style="{
            transform: 'translateX(' + audioSegmentLeftBoundX + 'px)',
            width: canvasWidth + 'px',
          }"
        ></div>
      </div>
      <div ref="handleLeft" class="editable-bounds-handle handle-left" :class="{ visible: isLeftHandleVisible }"></div>
      <div class="segment-tools">
        <div class="audio-editor-svg-button" @click="removeSegmentHandler" v-html="DEFAULT_ICONS.CLOSE"></div>
      </div>
      <div ref="handleRight" class="editable-bounds-handle handle-right" :class="{ visible: isRightHandleVisible }"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, useStore } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";
import { DEFAULT_ICONS } from "@audioeditor/data/icons";
import { Transformation } from "@audioeditor/visualmodel/transformations/Transformation";
import { useConstantSelectors } from "@/audioeditor/composable/useConstantSelectors";
import { useMapState } from "@/audioeditor/composable/utils/useStoreMaps";
import { useSegmentMovement } from "./audiosegment/useSegmentMovement";
import { useEditableBoundMovement } from "./audiosegment/useEditableBoundMovement";

const WIDTH_ON_WHICH_HANDLES_VISIBLE = 10;

export default {
  name: "AudioSegment",
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
    track: {
      type: Object,
      required: true,
    },
    visualSegment: {
      type: Object,
      required: true,
    },
  },
  emits: ["audio-segment-move"],
  setup(props) {
    const constantSelectors = useConstantSelectors();

    const { navigationModel } = useMapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, {
      navigationModel: (state) => state,
    });

    useSegmentMovement(props, navigationModel, "canvasWrapper");
    const { isDraggingLeftBound, isDraggingRightBound } = useEditableBoundMovement(props, navigationModel, "handleLeft", "handleRight");

    return {
      constantSelectors,
      isDraggingLeftBound,
      isDraggingRightBound,
    };
  },
  data() {
    return {
      DEFAULT_ICONS,
      AUDIO_EDITOR_CONFIGURATION,

      isColorInputFocused: false,

      isNameInputActive: false,
      oldName: this.$props.visualSegment.name,
    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS, {
      visualMultiSegmentSelection: (state) => state.visualMultiSegmentSelection,
    }),

    audioSegmentX() {
      return Transformation.worldToViewport({ x: this.$props.visualSegment.segmentStartTime + this.$props.visualSegment.segmentEditingTools.editableBounds.leftBoundPosition, y: 0 }, this.$props.navigationModel).x;
    },
    getSegmentTranslate() {
      const viewportPoint = Transformation.worldToViewport({ x: this.$props.visualSegment.segmentStartTime + this.$props.visualSegment.segmentEditingTools.editableBounds.leftBoundPosition, y: this.$props.track.y }, this.$props.navigationModel);
      return viewportPoint.x + "px, " + viewportPoint.y + "px";
    },

    audioSegmentLeftBoundX() {
      return -Transformation.worldToViewportDistance({ x: this.$props.visualSegment.segmentEditingTools.editableBounds.leftBoundPosition, y: 0 }, this.$props.navigationModel).x;
    },
    audioSegmentWidth() {
      return Transformation.worldToViewportDistance({ x: this.$props.visualSegment.segmentEditingTools.editableBounds.rightBoundPosition - this.$props.visualSegment.segmentEditingTools.editableBounds.leftBoundPosition, y: 0 }, this.$props.navigationModel).x;
    },
    canvasWidth() {
      return Transformation.worldToViewportDistance({ x: this.$props.visualSegment.segmentDuration, y: 0 }, this.$props.navigationModel).x;
    },
    getBackgroundColor() {
      const isMuted = this.$props.track.visualTrackMixingTools.trackMuteState.isMuted;
      const isMutedBySolo = this.$props.track.visualTrackMixingTools.trackMuteState.isMutedBySolo;

      if (isMuted || isMutedBySolo) {
        return AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.mutedBackgroundColor + AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackOpacity;
      }
      return this.$props.track.trackColor.primary + AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackOpacity;
    },
    getSelectionCandidateBackgroundColor() {
      return this.$props.track.trackColor.primary + AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.selectionCandidateOpacity;
    },
    isLeftHandleVisible() {
      return this.isDraggingLeftBound || this.audioSegmentWidth < WIDTH_ON_WHICH_HANDLES_VISIBLE;
    },
    isRightHandleVisible() {
      return this.isDraggingRightBound || this.audioSegmentWidth < WIDTH_ON_WHICH_HANDLES_VISIBLE;
    },
    isSelectionCandidate() {
      return this.visualMultiSegmentSelection.selectionCandidates.find((selectionItem) => selectionItem.segmentId === this.$props.visualSegment.id);
    },
    isSelected() {
      return this.visualMultiSegmentSelection.selection.find((selectionItem) => selectionItem.segmentId === this.$props.visualSegment.id);
    },
  },
  mounted() {
    this.$refs.canvasPositioner.appendChild(this.$props.visualSegment.wavesurferContainerRef);
    this.$eventBus.on("track-mixing-tools-color-input-focus-changed", this.colorInputFocusChangedHandler);
  },
  unmounted() {
    this.$eventBus.off("track-mixing-tools-color-input-focus-changed", this.colorInputFocusChangedHandler);
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["removeSegments", "setSegmentName"]),

    /* edit attributes */
    removeSegmentHandler() {
      this.removeSegments({
        commandArgs: {
          trackId: this.$props.track.id,
          segmentIds: [this.$props.visualSegment.id],
        },
      });
    },
    nameInputHolderDblclickHandler() {
      this.$refs.nameInput.focus();
    },
    nameInputFocusHandler(event) {
      this.isNameInputActive = true;
      this.oldName = this.$props.visualSegment.name;
    },
    nameInputBlurHandler() {
      this.isNameInputActive = false;
      this.setSegmentName({ commandArgs: { trackId: this.$props.track.id, segmentId: this.$props.visualSegment.id, name: this.$refs.nameInput.innerText, oldName: this.oldName }, controllerOptions: { isOnChange: true } });
    },
    nameInputHandler(event) {
      this.setSegmentName({ commandArgs: { trackId: this.$props.track.id, segmentId: this.$props.visualSegment.id, name: event.target.innerText }, controllerOptions: { isOnChange: false } });
    },
    /* /edit attributes */

    /* auxiliary */
    colorInputFocusChangedHandler(isFocused) {
      this.isColorInputFocused = isFocused;
    },
    /* /auxiliary */
  },
};
</script>

<style scoped>
.audio-segment {
  --header-height: 19px;
  height: v-bind("AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackHeight+'px'");
  position: absolute;
  display: flex;
  flex-direction: column;

  transition: background-color var(--default-transition);
}

.color-input-focused {
  transition: background-color 0s;
}

.audio-segment-header {
  font-family: var(--audio-editor-font-label-small-family);
  font-size: var(--audio-editor-font-label-small-size);
  font-weight: var(--audio-editor-font-label-small-weight);
  letter-spacing: var(--audio-editor-font-label-small-letter);
  color: var(--audio-editor-color-white);

  height: var(--header-height);
  display: flex;
  align-items: center;
}

.name-input-holder div[role="textbox"] {
  min-width: 20px;
  border: 2px solid var(--audio-editor-color-translucent-white-1);
  border-radius: var(--small-border-radius);

  transition: border-color var(--default-transition);
}

.name-input-holder div[role="textbox"]:focus-visible {
  outline: none;
}

.name-input-holder.deactivated div[role="textbox"] {
  pointer-events: none;
  border-color: transparent;
}

.header-placeholder {
  margin-left: 1px;
  height: 2px;
  flex-grow: 1;
  background: v-bind("track.trackColor.primary");
  border-radius: var(--small-border-radius);
  transition: inherit;
}

.audio-segment-main {
  background-color: v-bind("getBackgroundColor");
  outline: 2px solid v-bind("track.trackColor.primary + '00'");
  outline-offset: -2px;
  transition: background-color var(--default-transition), outline-color var(--default-transition);
  position: relative;
  border-radius: 4px;
}

.selection-candidate {
  background: v-bind("getSelectionCandidateBackgroundColor");
}

.selected {
  /* border: 2px solid blue; */
  outline-color: v-bind("track.trackColor.primary");
}

.canvas-wrapper {
  width: 100%;
  overflow: hidden;
}

.canvas-positioner {
  height: 100%;
}

.controls-holder {
  position: absolute;
  z-index: 10;
  inset: 0;
  display: flex;
  justify-content: space-between;
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

.segment-tools {
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
}
</style>
