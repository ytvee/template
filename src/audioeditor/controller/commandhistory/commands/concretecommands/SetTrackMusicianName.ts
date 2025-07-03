/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
/* /receivers */

export class SetTrackMusicianName extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private trackId: UniqueId;
  private newTrackMusicianName: string;
  /* /redo */

  /* undo */
  private oldTrackMusicianName?: string;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackId: UniqueId, name: string, oldName?: string) {
    super("SetTrackMusicianName");
    this.audioEditor = audioEditor;
    this.context = context;

    this.trackId = trackId;

    this.oldTrackMusicianName = oldName;
    this.newTrackMusicianName = name;

    this._verboseDescription = `${this.oldTrackMusicianName}-->${this.newTrackMusicianName}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    const track = this.audioEditor.trackEditor.getTrackByTrackId(this.trackId);
    if (this.oldTrackMusicianName === undefined) {
      throw new Error();
    }
    track.musicianName = this.oldTrackMusicianName;
    this.context.commit("setTrackMusicianName", { trackId: this.trackId, musicianName: this.oldTrackMusicianName });
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    const track = this.audioEditor.trackEditor.getTrackByTrackId(this.trackId);
    track.musicianName = this.newTrackMusicianName;
    this.context.commit("setTrackMusicianName", { trackId: this.trackId, musicianName: this.newTrackMusicianName });
    return;
  }
}
