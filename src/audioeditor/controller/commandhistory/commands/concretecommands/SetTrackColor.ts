/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
/* /receivers */

export class SetTrackColor extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private trackId: UniqueId;
  private newTrackPrimaryColor: string;
  /* /redo */

  /* undo */
  private oldTrackPrimaryColor?: string;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackId: UniqueId, trackColor: string, oldTrackColor?: string) {
    super("SetTrackColor");
    this.audioEditor = audioEditor;
    this.context = context;

    this.trackId = trackId;
    this.oldTrackPrimaryColor = oldTrackColor;
    this.newTrackPrimaryColor = trackColor;

    this._verboseDescription = `trackId:${trackId} ${this.oldTrackPrimaryColor}-->${this.newTrackPrimaryColor}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    if (this.oldTrackPrimaryColor === undefined) {
      throw new Error();
    }
    this.audioEditor.trackEditor.updateTrackColor(this.trackId, this.oldTrackPrimaryColor);
    this.context.commit("setTrackColor", { trackId: this.trackId, primaryColor: this.oldTrackPrimaryColor });
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.updateTrackColor(this.trackId, this.newTrackPrimaryColor);
    this.context.commit("setTrackColor", { trackId: this.trackId, primaryColor: this.newTrackPrimaryColor });
    return;
  }
}
