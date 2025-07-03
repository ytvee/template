/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
/* /receivers */

export class MoveEditableSegmentBound extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private trackId: UniqueId;
  private segmentId: UniqueId;
  private boundSide: "left" | "right";

  private newBoundPosition: number;
  /* /redo */

  /* undo */
  private oldBoundPosition?: number;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackId: UniqueId, segmentId: UniqueId, boundSide: "left" | "right", boundPosition: number, oldBoundPosition?: number) {
    super("MoveEditableSegmentBound");
    this.audioEditor = audioEditor;
    this.context = context;

    this.trackId = trackId;
    this.segmentId = segmentId;
    this.boundSide = boundSide;

    this.newBoundPosition = boundPosition;
    this.oldBoundPosition = oldBoundPosition;

    this._verboseDescription = `trackId:${this.trackId} segmentId:${this.segmentId} side:${this.boundSide} position:${this.oldBoundPosition}-->${this.newBoundPosition}`;
  }
  private auxiliary(boundPosition: number) {
    const updatedBoundPosition = this.audioEditor.trackEditor.moveEditableBound(this.trackId, this.segmentId, this.boundSide, boundPosition);
    this.context.commit("moveEditableBound", {
      trackId: this.trackId,
      segmentId: this.segmentId,
      boundSide: this.boundSide,
      boundPosition: updatedBoundPosition,
    });
  }
  public override undo(): AbstractCommandExecutionResult {
    if (this.oldBoundPosition === undefined) {
      throw new Error();
    }
    this.auxiliary(this.oldBoundPosition);
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.auxiliary(this.newBoundPosition);
    return;
  }
}
