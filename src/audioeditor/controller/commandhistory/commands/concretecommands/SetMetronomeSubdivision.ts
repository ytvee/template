/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
/* /receivers */

export class SetMetronomeSubdivision extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private newSubdivisionName: string;
  /* /redo */

  /* undo */
  private oldSubdivisionName: string;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, subdivisionName: string) {
    super("SetMetronomeSubdivision");
    this.audioEditor = audioEditor;
    this.context = context;

    this.oldSubdivisionName = this.audioEditor.trackEditor.metronome.subdivision.name;
    this.newSubdivisionName = subdivisionName;

    this._verboseDescription = `${this.oldSubdivisionName}-->${this.newSubdivisionName}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.metronome.setSubdivisionByName(this.oldSubdivisionName);
    this.context.commit("setMetronomeSubdivision", { subdivisionName: this.oldSubdivisionName });
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.metronome.setSubdivisionByName(this.newSubdivisionName);
    this.context.commit("setMetronomeSubdivision", { subdivisionName: this.newSubdivisionName });
    return;
  }
}
