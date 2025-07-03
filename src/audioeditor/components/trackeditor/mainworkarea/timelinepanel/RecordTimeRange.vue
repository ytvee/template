<template>
  <div
    ref="recordTimeRange"
    class="record-time-range"
    :class="{ active: !offlineRecording.isRangeSpecifiedByCompositionDuration }"
    :style="{
      transform: 'translateX(' + startClientPositionX + 'px)',
      width: timeRangeWidth + 'px',
    }"
  >
    <div ref="leftBound" class="editable-bounds-handle handle-left tooltip" :class="{ visible: isLeftHandleVisible }">
      <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.66667 0.308594L1 0.308595C0.447715 0.308595 2.76467e-08 0.756311 6.17506e-08 1.3086L-4.48747e-07 8.48548C-3.88507e-07 9.46102 1.25397 9.85923 1.81679 9.06242L6.88614 1.88553C7.35401 1.22314 6.88031 0.308594 6.06935 0.308594L2.66667 0.308594Z" fill="currentColor" />
      </svg>
    </div>
    <div ref="rightBound" class="editable-bounds-handle handle-right tooltip" :class="{ visible: isRightHandleVisible }">
      <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.33333 0.308594L7 0.308595C7.55228 0.308595 8 0.756311 8 1.3086L8 8.48548C8 9.46102 6.74603 9.85923 6.18321 9.06242L1.11386 1.88553C0.645987 1.22314 1.11969 0.308594 1.93065 0.308594L5.33333 0.308594Z" fill="currentColor" />
      </svg>
    </div>
  </div>
</template>

<script>
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";
import { useTemplateRef, ref } from "vue";
import { useClickAndDrag } from "@/audioeditor/composable/useClickAndDrag";
import { useMapState, useMapActions } from "@/audioeditor/composable/utils/useStoreMaps";
import { snapToGrid } from "@/audioeditor/store/modules/submodules/trackeditor/navigation/navigationFunctions";
import { useConstantSelectors } from "@audioeditor/composable/useConstantSelectors";

const WIDTH_ON_WHICH_HANDLES_VISIBLE = 10; //px

export default {
  name: "RecordTimeRange",
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const isDraggingLeftBound = ref(false); //for hover style while moving
    const isDraggingRightBound = ref(false);
    let isDraggingRange = false;

    let startLeftBoundPosition = 0;
    let startRightBoundPosition = 0;

    const storeStateMap = useMapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      offlineRecording: (state) => state.offlineRecording,
    });
    const storeActionMap = useMapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["setIsRangeByCompositionDuration", "setAudioRecordRangeStart", "setAudioRecordRangeEnd"]);
    const constantSelectors = useConstantSelectors();

    function leftHandleStartDragCallback(event, pointerX, pointerY) {
      isDraggingLeftBound.value = true;
      startLeftBoundPosition = storeStateMap.offlineRecording.value.audioRecordRange.start;
      document.body.style.cursor = "ew-resize";
    }
    function leftHandleDragCallback(event, pointerX, pointerY, movementX, movementY, pointerdownEvent, movementXFromStart, movementYFromStart) {
      let startPosition = startLeftBoundPosition + Transformation.windowToWorldDistance({ x: movementXFromStart, y: 0 }, props.navigationModel, { x: 0, y: 0 }).x;
      startPosition = snapToGrid(startPosition, props.navigationModel);
      if (startPosition < AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder) {
        startPosition = AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder;
      }
      storeActionMap.setAudioRecordRangeStart(startPosition < storeStateMap.offlineRecording.value.audioRecordRange.end ? startPosition : storeStateMap.offlineRecording.value.audioRecordRange.end);
    }
    function rightHandleStartDragCallback(event, pointerX, pointerY) {
      isDraggingRightBound.value = true;
      startRightBoundPosition = storeStateMap.offlineRecording.value.audioRecordRange.end;
      document.body.style.cursor = "ew-resize";
    }
    function rightHandleDragCallback(event, pointerX, pointerY, movementX, movementY, pointerdownEvent, movementXFromStart, movementYFromStart) {
      let endPosition = startRightBoundPosition + Transformation.windowToWorldDistance({ x: movementXFromStart, y: 0 }, props.navigationModel, { x: 0, y: 0 }).x;
      endPosition = snapToGrid(endPosition, props.navigationModel);

      storeActionMap.setAudioRecordRangeEnd(endPosition > storeStateMap.offlineRecording.value.audioRecordRange.start ? endPosition : storeStateMap.offlineRecording.value.audioRecordRange.start);
    }
    function endDragCallback() {
      document.body.style.cursor = "";
      isDraggingLeftBound.value = false;
      isDraggingRightBound.value = false;
    }

    useClickAndDrag(useTemplateRef("leftBound"), { startDragCallback: leftHandleStartDragCallback, dragCallback: leftHandleDragCallback, endDragCallback }, { separateClickAndDrag: true });
    useClickAndDrag(useTemplateRef("rightBound"), { startDragCallback: rightHandleStartDragCallback, dragCallback: rightHandleDragCallback, endDragCallback }, { separateClickAndDrag: true });

    function isOnTooltip(event) {
      return event.target.closest(`.${constantSelectors.RECORD_TIME_RANGE_TOOLTIP}`);
    }
    function rangeStartDragCallback(event) {
      if (isOnTooltip(event)) {
        return;
      }
      isDraggingRange = true;
      startLeftBoundPosition = storeStateMap.offlineRecording.value.audioRecordRange.start;
      startRightBoundPosition = storeStateMap.offlineRecording.value.audioRecordRange.end;
    }
    function rangeDragCallback(event, pointerX, pointerY, movementX, movementY, pointerdownEvent, movementXFromStart, movementYFromStart) {
      if (!isDraggingRange) {
        return;
      }
      const rangeDuration = storeStateMap.offlineRecording.value.audioRecordRange.end - storeStateMap.offlineRecording.value.audioRecordRange.start;
      let startPosition = startLeftBoundPosition + Transformation.windowToWorldDistance({ x: movementXFromStart, y: 0 }, props.navigationModel, { x: 0, y: 0 }).x;
      startPosition = snapToGrid(startPosition, props.navigationModel);
      if (startPosition < AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder) {
        startPosition = AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder;
      }
      storeActionMap.setAudioRecordRangeStart(startPosition);
      const endPosition = startPosition + rangeDuration;
      storeActionMap.setAudioRecordRangeEnd(endPosition);
    }
    function rangeEndDragCallback() {
      isDraggingRange = false;
    }
    function rangeClickCallback(event) {
      if (isOnTooltip(event)) {
        return;
      }
      storeActionMap.setIsRangeByCompositionDuration(!storeStateMap.offlineRecording.value.isRangeSpecifiedByCompositionDuration);
    }

    useClickAndDrag(useTemplateRef("recordTimeRange"), { startDragCallback: rangeStartDragCallback, dragCallback: rangeDragCallback, endDragCallback: rangeEndDragCallback, clickCallback: rangeClickCallback }, { separateClickAndDrag: true });

    return {
      isDraggingLeftBound,
      isDraggingRightBound,
      offlineRecording: storeStateMap.offlineRecording,
    };
  },
  computed: {
    startClientPositionX() {
      return Transformation.worldToViewport({ x: this.offlineRecording.audioRecordRange.start, y: 0 }, this.$props.navigationModel).x;
    },
    timeRangeWidth() {
      const width = Transformation.worldToViewportDistance({ x: this.offlineRecording.audioRecordRange.end - this.offlineRecording.audioRecordRange.start, y: 0 }, this.$props.navigationModel).x;
      return width >= 0 ? width : 0;
    },
    isLeftHandleVisible() {
      return this.isDraggingLeftBound || this.timeRangeWidth < WIDTH_ON_WHICH_HANDLES_VISIBLE;
    },
    isRightHandleVisible() {
      return this.isDraggingRightBound || this.timeRangeWidth < WIDTH_ON_WHICH_HANDLES_VISIBLE;
    },
  },
};
</script>

<style scoped>
.record-time-range {
  height: 16px;
  border-radius: 2px;
  pointer-events: auto;
  cursor: move;

  background-color: var(--audio-editor-color-translucent-white-3);
  transition: background-color var(--default-transition);
}

.active {
  background-color: var(--audio-editor-color-translucent-white-1);
}

.editable-bounds-handle {
  position: absolute;
  z-index: 10;
  top: 0;
  height: 100%;
  cursor: ew-resize;
  background: rgba(128, 0, 0, 0);
  transition: background-color var(--default-transition);
  border-radius: var(--audio-editor-default-border-radius);

  color: var(--audio-editor-color-translucent-white-1);
  transition: color var(--default-transition);
}

.editable-bounds-handle:hover,
.editable-bounds-handle.visible {
  color: var(--audio-editor-color-white);
}

.handle-left {
  left: 0;
}

.handle-right {
  right: -3px;
  padding-right: 3px;
}
</style>
