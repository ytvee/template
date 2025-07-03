import { SelectionItem, MultiSegmentSelectionMode } from "@/audioeditor/audiomodel/audioeditor/trackeditor/editingtools/MultiSegmentSelection";
import { controllerActions, controllerMutations } from "./editingtools/controller";
import { presenterActions, presenterMutations } from "./editingtools/presenter";
import { Point } from "@/audioeditor/visualmodel/types";
import { State } from "@/store/store";
import { ActionContext } from "vuex";

export type Context = ActionContext<EditingToolsState, State>;

type VisualMultiSegmentSelection = {
  selection: Array<SelectionItem>;
  isBoxSelectionActive: boolean;
  boxSelectionStartPoint: Point;
  boxSelectionEndPoint: Point;
  selectionMode: MultiSegmentSelectionMode;
  selectionCandidates: Array<SelectionItem>;
};
type VisualScissors = {
  isEnabled: boolean;
};

export type EditingToolsState = {
  visualMultiSegmentSelection: VisualMultiSegmentSelection;
  visualScissors: VisualScissors;
};
const initialEditingToolsState: EditingToolsState = {
  visualMultiSegmentSelection: {
    selection: [],
    isBoxSelectionActive: false,
    boxSelectionStartPoint: { x: 0, y: 0 },
    boxSelectionEndPoint: { x: 0, y: 0 },
    selectionMode: "replace",
    selectionCandidates: [],
  },
  visualScissors: {
    isEnabled: false,
  },
};
const editingToolsModule = {
  namespaced: true as boolean,
  state: (): EditingToolsState => structuredClone(initialEditingToolsState),
  getters: {},
  mutations: {
    ...controllerMutations,
    ...presenterMutations,
    /* selection */
    startBoxSelection(state: EditingToolsState, { boxSelectionStartPoint, selectionMode }: { boxSelectionStartPoint: Point; selectionMode: MultiSegmentSelectionMode }) {
      state.visualMultiSegmentSelection.isBoxSelectionActive = true;
      state.visualMultiSegmentSelection.boxSelectionStartPoint = boxSelectionStartPoint;
      state.visualMultiSegmentSelection.selectionMode = selectionMode;
    },
    modifyBoxSelection(state: EditingToolsState, { selection, selectionCandidates, boxSelectionEndPoint }: { selection: Array<SelectionItem>; selectionCandidates: Array<SelectionItem>; boxSelectionEndPoint: Point }) {
      state.visualMultiSegmentSelection.selection = selection;
      state.visualMultiSegmentSelection.selectionCandidates = selectionCandidates;
      state.visualMultiSegmentSelection.boxSelectionEndPoint = boxSelectionEndPoint;
    },
    endBoxSelection(state: EditingToolsState) {
      state.visualMultiSegmentSelection.isBoxSelectionActive = false;
    },
    setMultiSegmentSelectionMode(state: EditingToolsState, selectionMode: MultiSegmentSelectionMode) {
      state.visualMultiSegmentSelection.selectionMode = selectionMode;
    },
    /* /selection */

    /* scissors */
    setScissors(state: EditingToolsState, { isEnabled }: { isEnabled: boolean }) {
      state.visualScissors.isEnabled = isEnabled;
    },
    /* /scissors */
  },
  actions: {
    ...controllerActions,
    ...presenterActions,
  },
};
export default editingToolsModule;
