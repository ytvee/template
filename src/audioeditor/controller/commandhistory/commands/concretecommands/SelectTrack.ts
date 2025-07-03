/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import store from "@/store/store";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
/* /receivers */

export class SelectTrack extends AbstractCommand {
  private audioEditor: AudioEditor;
  // private context: Context;

  /* redo */
  private newSelectedTrackId: UniqueId | null;
  /* /redo */

  /* undo */
  private oldSelectedTrackId: UniqueId | null;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, selectedTrackId: UniqueId | null) {
    super("SelectTrack");
    this.audioEditor = audioEditor;
    // this.context = context;

    this.oldSelectedTrackId = this.audioEditor.trackEditor.selectedTrackId;
    this.newSelectedTrackId = selectedTrackId;

    this._verboseDescription = `${this.oldSelectedTrackId}-->${this.newSelectedTrackId}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.selectedTrackId = this.oldSelectedTrackId;

    // this.context.commit('setSelectedVisualTrack', { trackId: this.oldSelectedTrackId });
    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "setSelectedVisualTrack", { trackId: this.oldSelectedTrackId });
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.selectedTrackId = this.newSelectedTrackId;

    // this.context.commit('setSelectedVisualTrack', { trackId: this.newSelectedTrackId });
    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "setSelectedVisualTrack", { trackId: this.newSelectedTrackId });

    return;
  }
}
