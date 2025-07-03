/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import { MoveSegmentStartMemento } from "@/audioeditor/audiomodel/audioeditor/TrackEditorWithEditingTools";
import { Point } from "@/audioeditor/visualmodel/types";
import { Controller } from "@/audioeditor/controller/Controller";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { moveObject } from "./movesegmenthelpers/moveSegmentCommonFunctions";
import { AnyContext } from "@/audioeditor/store/modules/audioEditorModule";
/* /receivers */

export class MoveSegment extends AbstractCommand {
  //TODO: move common with MoveMultiSegmentSelection code to separate file
  private audioEditor: AudioEditor;

  /* redo */
  private segmentId: UniqueId;
  private moveSegmentStartMemento: MoveSegmentStartMemento;
  private movement: Point; //INFO: x:seconds y:trackUnits
  private moveSegmentHelperCommand: AbstractCommand | null;
  /* /redo */

  /* undo */

  /* /undo */

  constructor(audioEditor: AudioEditor, context: AnyContext, segmentId: UniqueId, moveSegmentStartMemento: MoveSegmentStartMemento, movement: Point) {
    super("MoveSegment");
    this.audioEditor = audioEditor;

    this.segmentId = segmentId;
    this.moveSegmentStartMemento = moveSegmentStartMemento;
    this.movement = movement;
    this.moveSegmentHelperCommand = null;

    this._verboseDescription = `segmentId:${this.segmentId} dx:${this.movement.x} dy:${this.movement.y}`;
  }

  public override async undo(): Promise<AbstractCommandExecutionResult> {
    if (!this.moveSegmentHelperCommand) {
      throw new Error();
    }
    await this.moveSegmentHelperCommand.undo();
    return;
  }
  public override async redo(): Promise<AbstractCommandExecutionResult> {
    const segmentTransformationClone = this.moveSegmentStartMemento.segmentTransformation.clone();

    moveObject(segmentTransformationClone, this.movement);
    const oldOrigin = this.moveSegmentStartMemento.segmentTransformation.getOrigin();
    const newOrigin = segmentTransformationClone.getOrigin();

    const oldSegmentWithBoundsOriginWorld = this.moveSegmentStartMemento.segmentTransformation.getOrigin();
    const newSegmentWithBoundsOriginWorld = segmentTransformationClone.getOrigin();

    const commandArgs = {
      trackId: this.audioEditor.trackEditor.getTrackIdBySegmentId(this.segmentId),
      segmentId: this.segmentId,
      segmentStartWithBounds: newSegmentWithBoundsOriginWorld.x,
      destinationTrackId: this.audioEditor.trackEditor.getTrackByYOrNearest(newSegmentWithBoundsOriginWorld.y).id,
      oldTrackId: this.audioEditor.trackEditor.getTrackByY(oldSegmentWithBoundsOriginWorld.y).id,
      oldSegmentStartWithBounds: oldSegmentWithBoundsOriginWorld.x,
    };
    const result = await Controller.handleCommand({} as Context, { commandName: "MoveSegmentHelper", unCompletedCommandArgs: Object.values(commandArgs), controllerOptions: { isCalledByCommand: true } });
    if (!result) {
      throw new Error();
    }
    this.moveSegmentHelperCommand = result.command;

    if (newOrigin.x === oldOrigin.x && newOrigin.y === oldOrigin.y) {
      //INFO: even though the start and end centers are the same and we don't save the command in history, we still move the object because otherwise it won't return to its original location. That's why this operator is at the end of the command.
      return { shouldBeIncludedToHistory: false, shouldNotBeIncludedToHistoryReason: "no_changes" };
    }
    return;
  }
}
