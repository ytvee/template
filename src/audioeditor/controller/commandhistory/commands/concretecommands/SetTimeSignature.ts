/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackeditor/navigation";
import { TimeSignature } from "@/audioeditor/audiomodel/types";
import store from "@/store/store";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
/* /receivers */

export class SetTimeSignature extends AbstractCommand {
  private audioEditor: AudioEditor;

  /* redo */
  private newTimeSignature: TimeSignature;
  /* /redo */

  /* undo */
  private oldTimeSignature: TimeSignature;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, timeSignature: Partial<TimeSignature>) {
    //TODO: remove context
    super("SetTimeSignature");
    this.audioEditor = audioEditor;

    this.oldTimeSignature = structuredClone(audioEditor.trackEditor.timeSignature);
    this.newTimeSignature = {
      upper: timeSignature.upper ?? audioEditor.trackEditor.timeSignature.upper,
      lower: timeSignature.lower ?? audioEditor.trackEditor.timeSignature.lower,
    };

    this._verboseDescription = `${this.oldTimeSignature.upper}/${this.oldTimeSignature.lower}-->${this.newTimeSignature.upper}/${this.newTimeSignature.lower}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.timeSignature = this.oldTimeSignature;
    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION + "/" + "setTimeSignature", this.oldTimeSignature);
    store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION + "/" + "setTimeScale", { viewportScaleX: store.state.audioEditor.trackEditor.navigation.viewportScaleX }); //TODO: may be create getter for beat grid options depends on timeScale
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.timeSignature = this.newTimeSignature;
    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION + "/" + "setTimeSignature", this.newTimeSignature);
    store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION + "/" + "setTimeScale", { viewportScaleX: store.state.audioEditor.trackEditor.navigation.viewportScaleX });
    return;
  }
}
