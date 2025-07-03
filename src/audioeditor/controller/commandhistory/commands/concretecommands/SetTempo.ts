/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackeditor/navigation";
import store from "@/store/store";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
/* /receivers */

export class SetTempo extends AbstractCommand {
  private audioEditor: AudioEditor;

  /* redo */
  private newTempo: number;
  /* /redo */

  /* undo */
  private oldTempo: number;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, tempo: number) {
    super("SetTempo");
    this.audioEditor = audioEditor;

    this.oldTempo = this.audioEditor.trackEditor.tempo;
    this.newTempo = tempo;

    this._verboseDescription = `${this.oldTempo}-->${this.newTempo}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.tempo = this.oldTempo;
    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION + "/" + "setTempo", this.oldTempo);
    store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION + "/" + "setTimeScale", { viewportScaleX: store.state.audioEditor.trackEditor.navigation.viewportScaleX });
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.tempo = this.newTempo;
    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION + "/" + "setTempo", this.newTempo);
    store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION + "/" + "setTimeScale", { viewportScaleX: store.state.audioEditor.trackEditor.navigation.viewportScaleX });
    return;
  }
}
