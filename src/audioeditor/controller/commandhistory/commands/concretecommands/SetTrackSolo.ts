/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
/* /receivers */

export class SetTrackSolo extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private trackId: UniqueId;
  private newIsTrackSolo: boolean;
  /* /redo */

  /* undo */
  private oldIsTrackSolo: boolean;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackId: UniqueId) {
    super("SetTrackSolo");
    this.audioEditor = audioEditor;
    this.context = context;

    this.trackId = trackId;
    this.oldIsTrackSolo = this.audioEditor.trackEditor.getTrackByTrackId(trackId).trackMixingTools.trackMuteState.isSolo;
    this.newIsTrackSolo = !this.oldIsTrackSolo;

    this._verboseDescription = `trackId:${this.trackId} ${this.oldIsTrackSolo}-->${this.newIsTrackSolo}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.switchSoloTrack(this.trackId, this.oldIsTrackSolo);
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.switchSoloTrack(this.trackId, this.newIsTrackSolo);
    return;
  }
}
