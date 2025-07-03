/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
/* /receivers */

export class SetTrackSoundSource extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private trackId: UniqueId;
  private newSoundSourceName: string;
  /* /redo */

  /* undo */
  private oldSoundSourceName?: string;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackId: UniqueId, name: string, oldName?: string) {
    super("SetTrackSoundSource");
    this.audioEditor = audioEditor;
    this.context = context;

    this.trackId = trackId;

    this.oldSoundSourceName = oldName;
    this.newSoundSourceName = name;

    this._verboseDescription = `${this.oldSoundSourceName}-->${this.newSoundSourceName}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    const track = this.audioEditor.trackEditor.getTrackByTrackId(this.trackId);
    if (this.oldSoundSourceName === undefined) {
      throw new Error();
    }
    track.soundSource = this.oldSoundSourceName;
    this.context.commit("setTrackSoundSourceName", { trackId: this.trackId, soundSource: this.oldSoundSourceName });
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    const track = this.audioEditor.trackEditor.getTrackByTrackId(this.trackId);
    track.soundSource = this.newSoundSourceName;
    this.context.commit("setTrackSoundSourceName", { trackId: this.trackId, soundSource: this.newSoundSourceName });
    return;
  }
}
