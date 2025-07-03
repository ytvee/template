/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { Controller } from "@/audioeditor/controller/Controller";
/* /receivers */
import { Segment } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/track/Segment";
import { SliceSelectionResult } from "@/audioeditor/audiomodel/audioeditor/trackeditor/editingtools/Scissors";

export class ScissorsSliceSelection extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private multiSegmentSelectionAddItemsCommand?: AbstractCommand;
  private replaceSegmentCommandsStack: Array<AbstractCommand> = [];
  private isFirstRedo = true;
  /* /redo */

  /* subsequent redo */
  private sliceSelectionResult?: SliceSelectionResult;
  /* /subsequent redo */

  /* undo */

  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context) {
    super("ScissorsSliceSelection");
    this.audioEditor = audioEditor;
    this.context = context;
  }
  public override async undo(): Promise<AbstractCommandExecutionResult> {
    await this.multiSegmentSelectionAddItemsCommand?.undo();

    const replaceSegmentCommandsStackLength = this.replaceSegmentCommandsStack.length;
    for (let i = 0; i < replaceSegmentCommandsStackLength; i++) {
      const currentCommand = this.replaceSegmentCommandsStack.pop();
      await currentCommand?.undo();
    }
    return;
  }

  private async auxiliaryRedo(sourceAndPieces: SliceSelectionResult["sourceAndPieces"]): Promise<AbstractCommandExecutionResult> {
    this._verboseDescription = `sliced segments count: ${sourceAndPieces.length}`;

    if (this.sliceSelectionResult === undefined) {
      throw new Error();
    }

    for (let i = 0; i < sourceAndPieces.length; i++) {
      const segmentSlice = sourceAndPieces[i];
      const removeSegmentsCommand = (await Controller.handleCommandByCommand(this.context, { commandName: "RemoveSegments", unCompletedCommandArgs: [segmentSlice.trackId, [segmentSlice.segmentId]] })).command; //TODO: many command for many selections
      this.replaceSegmentCommandsStack.push(removeSegmentsCommand);

      if (!this.isFirstRedo) {
        segmentSlice.pieces.forEach((piece, index) => (piece.id = this.sliceSelectionResult?.sourceAndPieces[i].pieces[index].id));
      }
      const addSegmentsCommandResult = await Controller.handleCommandByCommand(this.context, { commandName: "AddSegments", unCompletedCommandArgs: [segmentSlice.trackId, segmentSlice.pieces] });
      const addSegmentsCommand = addSegmentsCommandResult.command;
      this.replaceSegmentCommandsStack.push(addSegmentsCommand);

      const addedSegmentPieces = addSegmentsCommandResult.data.segments as Array<Segment>;
      if (this.isFirstRedo) {
        this.sliceSelectionResult.sourceAndPieces[i].pieces.forEach((piece, index) => (piece.id = addedSegmentPieces[index].id));
      }
    }

    const piecesIds = this.sliceSelectionResult.sourceAndPieces.flatMap((source) => source.pieces.map((piece) => piece.id));
    this.multiSegmentSelectionAddItemsCommand = (await Controller.handleCommandByCommand(this.context, { commandName: "MultiSegmentSelectionAddItems", unCompletedCommandArgs: [piecesIds, "add"] })).command;
    return;
  }
  private async firstRedo(): Promise<AbstractCommandExecutionResult> {
    const sliceSelectionResult = this.audioEditor.trackEditor.scissors.sliceSelection();
    if (!sliceSelectionResult.sourceAndPieces.length) {
      return {
        shouldBeIncludedToHistory: false,
        shouldNotBeIncludedToHistoryReason: "no_changes",
      };
    }
    this.sliceSelectionResult = sliceSelectionResult;

    const sourceAndPieces = sliceSelectionResult.sourceAndPieces;
    return await this.auxiliaryRedo(sourceAndPieces);
  }
  private async subsequentRedo(): Promise<AbstractCommandExecutionResult> {
    if (this.sliceSelectionResult === undefined) {
      throw new Error();
    }
    const sliceSelectionResult = this.audioEditor.trackEditor.scissors.sliceSelection(this.sliceSelectionResult.slicePositionWorld);
    const sourceAndPieces = sliceSelectionResult.sourceAndPieces;
    return await this.auxiliaryRedo(sourceAndPieces);
  }
  public override async redo(): Promise<AbstractCommandExecutionResult> {
    if (this.isFirstRedo) {
      const result = await this.firstRedo();
      this.isFirstRedo = false;
      return result;
    } else {
      return await this.subsequentRedo();
    }
  }
}
