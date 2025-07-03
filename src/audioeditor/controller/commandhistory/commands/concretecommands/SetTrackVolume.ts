/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
/* /receivers */

export class SetTrackVolume extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private trackId: UniqueId;
  private newVolume: number;
  /* /redo */

  /* undo */
  private oldVolume?: number;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackId: UniqueId, volume: number, oldVolume?: number) {
    super("SetTrackVolume");
    this.audioEditor = audioEditor;
    this.context = context;

    this.trackId = trackId;
    this.oldVolume = oldVolume;
    this.newVolume = volume;

    this._verboseDescription = `${this.oldVolume}-->${this.newVolume}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    if (this.oldVolume === undefined) {
      throw new Error("undo is not executable when oldVolume is not set");
    }
    this.audioEditor.trackEditor.trackVolumeChangedHandler(this.trackId, this.oldVolume);
    this.context.commit("setTrackVolume", { trackId: this.trackId, trackVolume: this.oldVolume });
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.trackVolumeChangedHandler(this.trackId, this.newVolume);
    this.context.commit("setTrackVolume", { trackId: this.trackId, trackVolume: this.newVolume });
    return;
  }
}
