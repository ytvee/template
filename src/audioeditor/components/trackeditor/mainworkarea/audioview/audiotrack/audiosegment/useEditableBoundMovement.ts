import { useClickAndDrag } from "@/audioeditor/composable/useClickAndDrag";
import { useMapActions } from "@/audioeditor/composable/utils/useStoreMaps";
import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { snapToGrid } from "@/audioeditor/store/modules/submodules/trackeditor/navigation/navigationFunctions";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import { ComputedRef, ref, useTemplateRef } from "vue";

export function useEditableBoundMovement(props: any, navigationModel: ComputedRef, handleLeftRef: string, handleRightRef: string) {
  const storeActons = useMapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["moveEditableBound"]);

  const isDraggingLeftBound = ref(false);
  const isDraggingRightBound = ref(false);
  let oldBoundPosition = 0;

  function editableLeftBoundBeforeChangeHandler() {
    oldBoundPosition = props.visualSegment.segmentEditingTools.editableBounds.leftBoundPosition;
    isDraggingLeftBound.value = true;
    document.body.style.cursor = "ew-resize";
  }
  function editableRightBoundBeforeChangeHandler() {
    oldBoundPosition = props.visualSegment.segmentEditingTools.editableBounds.rightBoundPosition;
    isDraggingRightBound.value = true;
    document.body.style.cursor = "ew-resize";
  }
  function moveEditableBoundChangeHanlder(side: "left" | "right", movementXFromStart: number) {
    if (isDraggingLeftBound.value || isDraggingRightBound.value) {
      if (calculateBoundPosition(side, movementXFromStart) !== oldBoundPosition) {
        moveEditableBoundHandler(movementXFromStart, true);
      }
      document.body.style.cursor = "";
    }
    isDraggingLeftBound.value = false;
    isDraggingRightBound.value = false;
  }
  function calculateBoundPosition(side: "left" | "right", movementXFromStart: number) {
    let boundPosition;
    if (side === "left") {
      boundPosition = oldBoundPosition + Transformation.windowToWorldDistance({ x: movementXFromStart, y: 0 }, props.navigationModel, { x: 0, y: 0 }).x;
      boundPosition = snapToGrid(props.visualSegment.segmentStartTime + boundPosition, navigationModel.value) - props.visualSegment.segmentStartTime;

      if (boundPosition < AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder - props.visualSegment.segmentStartTime) {
        boundPosition = AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder - props.visualSegment.segmentStartTime;
      }
    } else if (side === "right") {
      boundPosition = oldBoundPosition + Transformation.windowToWorldDistance({ x: movementXFromStart, y: 0 }, props.navigationModel, { x: 0, y: 0 }).x;
      boundPosition = snapToGrid(props.visualSegment.segmentStartTime + boundPosition, navigationModel.value) - props.visualSegment.segmentStartTime;
    } else {
      throw new Error();
    }
    return boundPosition;
  }
  function moveEditableBoundHandler(movementXFromStart: number, isOnChange: boolean) {
    //INFO: analogue of "input" event handler
    if (isDraggingLeftBound.value) {
      const boundPosition = calculateBoundPosition("left", movementXFromStart);

      storeActons.moveEditableBound({
        commandArgs: {
          trackId: props.track.id,
          segmentId: props.visualSegment.id,
          boundSide: "left",
          boundPosition: boundPosition,
          oldBoundPosition: oldBoundPosition,
        },
        controllerOptions: {
          isOnChange,
        },
      });
    }
    if (isDraggingRightBound.value) {
      const boundPosition = calculateBoundPosition("right", movementXFromStart);
      storeActons.moveEditableBound({
        commandArgs: {
          trackId: props.track.id,
          segmentId: props.visualSegment.id,
          boundSide: "right",
          boundPosition: boundPosition,
          oldBoundPosition: oldBoundPosition,
        },
        controllerOptions: {
          isOnChange,
        },
      });
    }
  }

  const handleStartCallbackHelper = (handle: "left" | "right", event: PointerEvent) => {
    switch (event.button) {
      case 0: {
        if (!(event.ctrlKey || event.altKey)) {
          handle === "left" ? editableLeftBoundBeforeChangeHandler() : editableRightBoundBeforeChangeHandler(); //INFO: simulate "before change" event emition
        }
      }
    }
  };
  const handleLeftStartCallback = (event: PointerEvent) => {
    handleStartCallbackHelper("left", event);
  };
  const handleRightStartCallback = (event: PointerEvent) => {
    handleStartCallbackHelper("right", event);
  };
  const handleDragCallback = (event: PointerEvent, pointerX: number, pointerY: number, movementX: number, movementY: number, pointerdownEvent: PointerEvent, movementXFromStart: number) => {
    moveEditableBoundHandler(movementXFromStart, false);
  };
  const handleLeftEndCallBack = (event: PointerEvent, pointerX: number, pointerY: number, pointerdownEvent: PointerEvent, movementXFromStart: number) => {
    moveEditableBoundChangeHanlder("left", movementXFromStart); //INFO: simulate "change" event emition
  };
  const handleRightEndCallBack = (event: PointerEvent, pointerX: number, pointerY: number, pointerdownEvent: PointerEvent, movementXFromStart: number) => {
    moveEditableBoundChangeHanlder("right", movementXFromStart); //INFO: simulate "change" event emition
  };
  useClickAndDrag(useTemplateRef(handleLeftRef), { dragCallback: handleDragCallback, startDragCallback: handleLeftStartCallback, endDragCallback: handleLeftEndCallBack }, { separateClickAndDrag: true });
  useClickAndDrag(useTemplateRef(handleRightRef), { dragCallback: handleDragCallback, startDragCallback: handleRightStartCallback, endDragCallback: handleRightEndCallBack }, { separateClickAndDrag: true });
  return {
    isDraggingLeftBound,
    isDraggingRightBound,
  };
}
