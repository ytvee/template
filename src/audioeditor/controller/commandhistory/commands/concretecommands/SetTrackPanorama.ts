/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
/* /receivers */

export class SetTrackPanorama extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private trackId: UniqueId;
  private newPanorama: number;
  /* /redo */

  /* undo */
  private oldPanorama?: number;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackId: UniqueId, panorama: number, oldPanorama?: number) {
    super("SetTrackPanorama");
    this.audioEditor = audioEditor;
    this.context = context;

    this.trackId = trackId;
    this.oldPanorama = oldPanorama;
    this.newPanorama = panorama;

    this._verboseDescription = `${this.oldPanorama?.toFixed(2)}-->${this.newPanorama?.toFixed(2)}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    if (this.oldPanorama === undefined) {
      throw new Error("undo is not executable when oldPanorama is not set");
    }
    this.audioEditor.trackEditor.trackStereoPanoramaChangedHandler(this.trackId, this.oldPanorama);
    this.context.commit("setTrackPanorama", { trackId: this.trackId, trackStereoPanorama: this.oldPanorama });
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.trackStereoPanoramaChangedHandler(this.trackId, this.newPanorama);
    this.context.commit("setTrackPanorama", { trackId: this.trackId, trackStereoPanorama: this.newPanorama });
    return;
  }
}
