import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { MultiSegmentSelectionMode } from "@/audioeditor/audiomodel/audioeditor/trackeditor/editingtools/MultiSegmentSelection";
import { MoveSegmentStartMemento } from "@/audioeditor/audiomodel/audioeditor/TrackEditorWithEditingTools";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import { useClickAndDrag } from "@/audioeditor/composable/useClickAndDrag";
import { useConstantSelectors } from "@/audioeditor/composable/useConstantSelectors";
import { useMapActions } from "@/audioeditor/composable/utils/useStoreMaps";
import { useMoveMultiSegmentSelection } from "@/audioeditor/controller/commandhistory/commands/concretecommands/movesegmenthelpers/useMoveMultiSegmentSelection";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { ViewportState } from "@/audioeditor/store/modules/submodules/trackeditor/navigation";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import { ComputedRef, useTemplateRef } from "vue";

export function useSegmentMovement(props: any, navigationModel: ComputedRef, elementRef: string) {
  const storeActons = useMapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["moveSegment"]);
  const editingToolsStoreActions = useMapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS, ["moveMultiSegmentSelection"]);
  const constantSelectors = useConstantSelectors();

  const storeActionsEditingTools = useMapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS, ["addSegmentsToSelection"]);

  const moveMultiSegmentSelectionFunctions = useMoveMultiSegmentSelection();

  let isDraggingSegment = false;
  let isDraggingSelection = false;

  let moveSegmentStartMemento: MoveSegmentStartMemento;

  /**
   * segment has such additional controls as bounds (borders), delete button, etc.
   * @param event
   * @returns
   */
  function isEventNotOnSubControlElement(event: PointerEvent) {
    return !(event.target as HTMLElement).closest("." + constantSelectors.AUDIO_SEGMENT_EDITABLE_BOUNDS_HANDLE);
  }

  function moveSegmentBeforeChangeHandler(event: PointerEvent) {
    if (isEventNotOnSubControlElement(event)) {
      if (AudioEditor.getInstance().trackEditor.multiSegmentSelection.isInSelection(props.visualSegment.id)) {
        isDraggingSelection = true;
        moveMultiSegmentSelectionFunctions.startMove();
      } else {
        isDraggingSegment = true;
        moveSegmentStartMemento = AudioEditor.getInstance().trackEditor.getMoveSegmentStartMemento(props.visualSegment.id);
      }
    }
  }
  function moveSegmentChangeHandler(event: PointerEvent, movementXFromStart: number, movementYFromStart: number) {
    moveSegmentHandler(movementXFromStart, movementYFromStart, true);
    if (isDraggingSelection) {
      isDraggingSelection = false;
    }
    if (isDraggingSegment) {
      isDraggingSegment = false;
    }
  }

  function moveSegmentHandler(movementXFromStart: number, movementYFromStart: number, isOnChange: boolean) {
    if (isDraggingSelection) {
      const worldSpaceMovement = Transformation.windowToWorldDistance({ x: movementXFromStart, y: movementYFromStart }, navigationModel.value as unknown as ViewportState, { x: 0, y: 0 });
      if (isOnChange) {
        moveMultiSegmentSelectionFunctions.endMove(worldSpaceMovement);
      } else {
        moveMultiSegmentSelectionFunctions.move(worldSpaceMovement);
      }
    }
    if (isDraggingSegment) {
      storeActons.moveSegment({
        commandArgs: {
          segmentId: props.visualSegment.id,
          moveSegmentStartMemento,
          movement: Transformation.windowToWorldDistance({ x: movementXFromStart, y: movementYFromStart }, navigationModel.value as unknown as ViewportState, { x: 0, y: 0 }),
        },
        controllerOptions: {
          isOnChange,
        },
      });
    }
  }
  /* selection */
  function addSegmentsToSelection(segmentIds: Array<UniqueId>, selectionMode: MultiSegmentSelectionMode) {
    const commandArgs = { segmentIds, selectionMode };
    storeActionsEditingTools.addSegmentsToSelection({ commandArgs });
  }
  /* /selection */

  const dragCallback = (event: PointerEvent, pointerX: number, pointerY: number, movementX: number, movementY: number, pointerdownEvent: PointerEvent, movementXFromStart: number, movementYFromStart: number) => {
    moveSegmentHandler(movementXFromStart, movementYFromStart, false);
  };
  const startDragCallback = (event: PointerEvent, pointerX: number, pointerY: number) => {
    switch (event.button) {
      case 0: {
        if (!(event.ctrlKey || event.altKey)) {
          moveSegmentBeforeChangeHandler(event); //INFO: simulate "before change" event emition
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
  const endDragCallback = (event: PointerEvent, pointerX: number, pointerY: number, pointerdownEvent: PointerEvent, movementXFromStart: number, movementYFromStart: number) => {
    moveSegmentChangeHandler(event, movementXFromStart, movementYFromStart); //INFO: simulate "change" event emition
  };
  const clickCallback = (event: PointerEvent, pointerX: number, pointerY: number) => {
    switch (event.button) {
      case 0: {
        if (!(event.ctrlKey || event.altKey)) {
          addSegmentsToSelection([props.visualSegment.id], "replace");
        } else {
          if (event.ctrlKey) {
            addSegmentsToSelection([props.visualSegment.id], "add");
          }
          if (event.altKey) {
            addSegmentsToSelection([props.visualSegment.id], "substract");
          }
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
  useClickAndDrag(useTemplateRef(elementRef), { dragCallback, startDragCallback, endDragCallback, clickCallback }, { separateClickAndDrag: true });
}
