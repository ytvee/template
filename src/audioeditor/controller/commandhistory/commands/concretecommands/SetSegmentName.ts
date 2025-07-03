/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
/* /receivers */

export class SetSegmentName extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private trackId: UniqueId;
  private segmentId: UniqueId;
  private newSegmentName: string;
  /* /redo */

  /* undo */
  private oldSegmentName?: string;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackId: UniqueId, segmentId: UniqueId, name: string, oldName?: string) {
    super("SetSegmentName");
    this.audioEditor = audioEditor;
    this.context = context;

    this.trackId = trackId;
    this.segmentId = segmentId;

    this.oldSegmentName = oldName;
    this.newSegmentName = name;

    this._verboseDescription = `${this.oldSegmentName}-->${this.newSegmentName}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    const segment = this.audioEditor.trackEditor.getSegmentByTrackIdSegmentId(this.trackId, this.segmentId);
    if (this.oldSegmentName === undefined) {
      throw new Error();
    }
    segment.name = this.oldSegmentName;
    this.context.commit("setSegmentName", { trackId: this.trackId, segmentId: this.segmentId, name: this.oldSegmentName });
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    const segment = this.audioEditor.trackEditor.getSegmentByTrackIdSegmentId(this.trackId, this.segmentId);
    segment.name = this.newSegmentName;
    this.context.commit("setSegmentName", { trackId: this.trackId, segmentId: this.segmentId, name: this.newSegmentName });
    return;
  }
}
