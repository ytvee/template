import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { MoveSelectionStartMemento } from "@/audioeditor/audiomodel/audioeditor/TrackEditorWithEditingTools";
import { Point } from "@/audioeditor/visualmodel/types";
import { Controller } from "@/audioeditor/controller/Controller";
import { moveObject } from "./movesegmenthelpers/moveSegmentCommonFunctions";

export class MoveMultiSegmentSelection extends AbstractCommand {
  private audioEditor: AudioEditor;

  private moveSelectionStartMemento: MoveSelectionStartMemento;
  private movement: Point; //INFO: x:seconds y:trackUnits
  private moveSegmentCommands: Array<AbstractCommand>;

  constructor(audioEditor: AudioEditor, context: Context, moveSelectionStartMemento: MoveSelectionStartMemento, movement: Point) {
    super("MoveMultiSegmentSelection");
    this.audioEditor = audioEditor;

    this.moveSelectionStartMemento = moveSelectionStartMemento;
    this.movement = movement;

    this.moveSegmentCommands = [];

    const selection = audioEditor.trackEditor.multiSegmentSelection.selection;
    this._verboseDescription = `segmentsCount:${selection.length} dx:${this.movement.x} seconds dy:${this.movement.y} trackUnits`;
  }
  public override async undo(): Promise<AbstractCommandExecutionResult> {
    while (this.moveSegmentCommands.length) {
      const command = this.moveSegmentCommands.pop();
      if (!command) {
        throw new Error();
      }
      await command.undo();
    }
    return;
  }
  public override async redo(): Promise<AbstractCommandExecutionResult> {
    const selectionTransformationClone = this.moveSelectionStartMemento.selectionTransformation.clone();

    moveObject(selectionTransformationClone, this.movement);

    for (const selectionItem of this.moveSelectionStartMemento.itemTransformations.entries()) {
      const segmentId = selectionItem[0];
      const segmentTransformation = selectionItem[1];

      const oldSegmentWithBoundsOriginWorld = this.moveSelectionStartMemento.selectionTransformation.objectToWorld({ x: segmentTransformation[0][2], y: segmentTransformation[1][2] });
      const newSegmentWithBoundsOriginWorld = selectionTransformationClone.objectToWorld({ x: segmentTransformation[0][2], y: segmentTransformation[1][2] });

      const commandArgs = {
        trackId: this.audioEditor.trackEditor.getTrackIdBySegmentId(segmentId),
        segmentId: segmentId,
        segmentStartWithBounds: newSegmentWithBoundsOriginWorld.x,
        destinationTrackId: this.audioEditor.trackEditor.getTrackByYOrNearest(newSegmentWithBoundsOriginWorld.y).id,
        oldTrackId: this.audioEditor.trackEditor.getTrackByY(oldSegmentWithBoundsOriginWorld.y).id,
        oldSegmentStartWithBounds: oldSegmentWithBoundsOriginWorld.x,
      };
      const result = await Controller.handleCommand({} as Context, { commandName: "MoveSegmentHelper", unCompletedCommandArgs: Object.values(commandArgs), controllerOptions: { isCalledByCommand: true } });
      if (!result) {
        throw new Error();
      }
      this.moveSegmentCommands.push(result.command);
    }

    const oldOrigin = this.moveSelectionStartMemento.selectionTransformation.getOrigin();
    const newOrigin = selectionTransformationClone.getOrigin();
    if (newOrigin.x === oldOrigin.x && newOrigin.y === oldOrigin.y) {
      return { shouldBeIncludedToHistory: false, shouldNotBeIncludedToHistoryReason: "no_changes" };
    }
    return;
  }
}
