/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
/* /receivers */

export class SetTrackMute extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private trackId: UniqueId;
  private newIsMuted: boolean;
  /* /redo */

  /* undo */
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackId: UniqueId, isMuted: boolean) {
    super("SetTrackMute");
    this.audioEditor = audioEditor;
    this.context = context;

    this.trackId = trackId;
    this.newIsMuted = isMuted;

    this._verboseDescription = `trackId:${this.trackId} ${!this.newIsMuted}-->${this.newIsMuted}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.switchMuteTrack(this.trackId, !this.newIsMuted);
    this.context.commit("setTrackMute", { trackId: this.trackId, isMuted: !this.newIsMuted });
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.switchMuteTrack(this.trackId, this.newIsMuted);
    this.context.commit("setTrackMute", { trackId: this.trackId, isMuted: this.newIsMuted });
    return;
  }
}
