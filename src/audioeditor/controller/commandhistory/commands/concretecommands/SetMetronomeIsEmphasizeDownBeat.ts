/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
/* /receivers */

export class SetMetronomeIsEmphasizeDownBeat extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private newIsEmphasizeDownBeat: boolean;
  /* /redo */

  /* undo */
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, isEmphasizeDownBeat: boolean) {
    super("SetMetronomeIsEmphasizeDownBeat");
    this.audioEditor = audioEditor;
    this.context = context;

    this.newIsEmphasizeDownBeat = isEmphasizeDownBeat;
    this._verboseDescription = `${!this.newIsEmphasizeDownBeat}-->${this.newIsEmphasizeDownBeat}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.metronome.emphasizeDownbeat = !this.newIsEmphasizeDownBeat;
    this.context.commit("setEmphasizeDownbeat", !this.newIsEmphasizeDownBeat);
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.metronome.emphasizeDownbeat = this.newIsEmphasizeDownBeat;
    this.context.commit("setEmphasizeDownbeat", this.newIsEmphasizeDownBeat);
    return;
  }
}
