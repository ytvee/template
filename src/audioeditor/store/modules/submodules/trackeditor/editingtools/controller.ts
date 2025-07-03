/**
 * Methods placed in this object act as a controller between user and AudioEditor (our audio model). The user should be able to call them directly. The scheme is: user -> controller action or mutation -> AudioEditor (or subobjects) send event -> presenter actions or mutataions update reactive state
 * Do not put here internal functions or mutations or actions of store which user should not call directly.
 */
import { Point } from "@/audioeditor/visualmodel/types";
import { Context } from "../editingTools";
import { Controller, ControllerOptions } from "../../../../../controller/Controller";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { MultiSegmentSelectionMode } from "@/audioeditor/audiomodel/audioeditor/trackeditor/editingtools/MultiSegmentSelection";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import { MoveSelectionStartMemento } from "@/audioeditor/audiomodel/audioeditor/TrackEditorWithEditingTools";
export const controllerMutations = {};

export const controllerActions = {
  /* selection */
  startBoxSelection(context: Context, { commandArgs: { boxSelectionStartPoint, selectionMode }, controllerOptions }: { commandArgs: { boxSelectionStartPoint: Point; selectionMode: MultiSegmentSelectionMode }; controllerOptions?: ControllerOptions }) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.trackEditor.multiSegmentSelection.startBoxSelection(boxSelectionStartPoint, selectionMode);
    context.commit("startBoxSelection", { boxSelectionStartPoint, selectionMode });
    context.commit("modifyBoxSelection", { selection: audioEditor.trackEditor.multiSegmentSelection.selection, selectionCandidates: audioEditor.trackEditor.multiSegmentSelection.selectionCandidates, boxSelectionEndPoint: audioEditor.trackEditor.multiSegmentSelection.boxSelectionEndPoint });
  },
  modifyBoxSelection(context: Context, { commandArgs: { boxSelectionEndPoint }, controllerOptions }: { commandArgs: { boxSelectionEndPoint: Point }; controllerOptions?: ControllerOptions }) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.trackEditor.multiSegmentSelection.modifyBoxSelection(boxSelectionEndPoint);
    context.commit("modifyBoxSelection", { selection: audioEditor.trackEditor.multiSegmentSelection.selection, selectionCandidates: audioEditor.trackEditor.multiSegmentSelection.selectionCandidates, boxSelectionEndPoint: audioEditor.trackEditor.multiSegmentSelection.boxSelectionEndPoint });
  },
  endBoxSelection(context: Context, { commandArgs: { boxSelectionEndPoint }, controllerOptions }: { commandArgs: { boxSelectionEndPoint: Point }; controllerOptions?: ControllerOptions }) {
    Controller.syncHandleCommand(context, { commandName: "MultiSegmentSelectionEndBoxSelection", unCompletedCommandArgs: [boxSelectionEndPoint] });
  },
  clearSelection(context: Context, { controllerOptions }: { controllerOptions?: ControllerOptions }) {
    Controller.syncHandleCommand(context, { commandName: "MultiSegmentSelectionClear", unCompletedCommandArgs: [] });
  },
  addSegmentsToSelection(context: Context, { commandArgs, controllerOptions }: { commandArgs: { segmentIds: Array<UniqueId>; selectionMode: MultiSegmentSelectionMode }; controllerOptions?: ControllerOptions }) {
    Controller.syncHandleCommand(context, { commandName: "MultiSegmentSelectionAddItems", unCompletedCommandArgs: [commandArgs.segmentIds, commandArgs.selectionMode] });
  },
  /* /selection */

  /* scissors */
  toggleScissors(context: Context) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.trackEditor.scissors.isEnabled = !audioEditor.trackEditor.scissors.isEnabled;
    context.commit("setScissors", { isEnabled: audioEditor.trackEditor.scissors.isEnabled });
  },
  async scissorsSlice(context: Context) {
    //TODO: may be async command
    await Controller.handleCommand(context, { commandName: "ScissorsSliceSelection", unCompletedCommandArgs: [] });
  },
  /* /scissors */

  /* multisegment selection */
  async moveMultiSegmentSelection(context: Context, { commandArgs, controllerOptions }: { commandArgs: { moveSelectionStartMemento: MoveSelectionStartMemento; movement: Point }; controllerOptions?: ControllerOptions }) {
    await Controller.handleCommand(context, { commandName: "MoveMultiSegmentSelection", unCompletedCommandArgs: Object.values(commandArgs), controllerOptions });
  },
  async removeMultiSegmentSelection(context: Context, { controllerOptions }: { controllerOptions?: ControllerOptions }) {
    await Controller.handleCommand(context, { commandName: "RemoveMultiSegmentSelection", unCompletedCommandArgs: [], controllerOptions });
  },
  async copyMultiSegmentSelection(context: Context, { controllerOptions }: { controllerOptions?: ControllerOptions }) {
    await Controller.handleCommand(context, { commandName: "CopyMultiSegmentSelection", unCompletedCommandArgs: [], controllerOptions });
  },
  async pasteMultiSegmentSelection(context: Context, { controllerOptions }: { controllerOptions?: ControllerOptions }) {
    await Controller.handleCommand(context, { commandName: "PasteMultiSegmentSelection", unCompletedCommandArgs: [], controllerOptions });
  },
  async cutMultiSegmentSelection(context: Context, { controllerOptions }: { controllerOptions?: ControllerOptions }) {
    await Controller.handleCommand(context, { commandName: "CutMultiSegmentSelection", unCompletedCommandArgs: [], controllerOptions });
  },
};
