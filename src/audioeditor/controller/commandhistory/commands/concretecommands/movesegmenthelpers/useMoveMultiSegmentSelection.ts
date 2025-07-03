import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { MoveSelectionStartMemento } from "@/audioeditor/audiomodel/audioeditor/TrackEditorWithEditingTools";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { Point } from "@/audioeditor/visualmodel/types";
import store from "@/store/store";

export function useMoveMultiSegmentSelection() {
  // const editingToolsStoreActions = useMapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS, ["moveMultiSegmentSelection"]);
  // const navigationModel = useMapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, {
  //   navigationModel: state => state
  // }).navigationModel;
  const editingToolsStoreActions = {
    moveMultiSegmentSelection: (...args: any) => {
      store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS + "/" + "moveMultiSegmentSelection", ...args);
    },
  }; //TODO: remake with useStore

  let moveSelectionStartMemento: MoveSelectionStartMemento;

  function startMove() {
    moveSelectionStartMemento = AudioEditor.getInstance().trackEditor.getMoveSelectionStartMemento();
  }
  function moveHelper(movement: Point, isOnChange: boolean) {
    editingToolsStoreActions.moveMultiSegmentSelection({
      commandArgs: {
        moveSelectionStartMemento,
        // movement: Transformation.windowToWorldDistance({ x: movementXFromStart, y: movementYFromStart }, navigationModel as unknown as ViewportState, { x: 0, y: 0 }),
        movement: movement,
      },
      controllerOptions: {
        isOnChange,
      },
    });
  }
  /**
   * @param movement - world space
   * */
  function move(movement: Point) {
    moveHelper(movement, false);
  }
  /**
   * @param movement - world space
   * */
  function endMove(movement: Point) {
    moveHelper(movement, true);
  }
  return {
    startMove,
    move,
    endMove,
  };
}
