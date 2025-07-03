/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
/* /receivers */

export class ToggleMetronome extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private newIsEnabled: boolean;
  /* /redo */

  /* undo */
  private oldIsEnabled: boolean;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context) {
    super("ToggleMetronome");
    this.audioEditor = audioEditor;
    this.context = context;

    this.oldIsEnabled = this.audioEditor.trackEditor.metronome.isStarted;
    this.newIsEnabled = !this.oldIsEnabled;

    this._verboseDescription = `${this.oldIsEnabled}-->${this.newIsEnabled}`;
  }
  /**
   * auxiliary method
   * @param isEnabled
   */
  private toggleMetronome(isEnabled: boolean) {
    if (isEnabled) {
      this.audioEditor.trackEditor.metronome.start();
    } else {
      this.audioEditor.trackEditor.metronome.stop();
    }
    this.context.commit("setMetronome", { isEnabled });
  }
  public override undo(): AbstractCommandExecutionResult {
    this.toggleMetronome(this.oldIsEnabled);
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.toggleMetronome(this.newIsEnabled);
    return;
  }
}
