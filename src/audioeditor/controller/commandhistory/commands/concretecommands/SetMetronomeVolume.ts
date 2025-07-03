/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
/* /receivers */

export class SetMetronomeVolume extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private newMetronomeVolume: number;
  /* /redo */

  /* undo */
  private oldMetronomeVolume?: number;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, volume: number, oldVolume?: number) {
    super("SetMetronomeVolume");
    this.audioEditor = audioEditor;
    this.context = context;

    this.newMetronomeVolume = volume;
    this.oldMetronomeVolume = oldVolume;

    this._verboseDescription = `${this.oldMetronomeVolume}-->${this.newMetronomeVolume}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    if (this.oldMetronomeVolume === undefined) {
      throw new Error();
    }
    this.audioEditor.trackEditor.metronome.volume = this.oldMetronomeVolume;
    this.context.commit("setMetronomeVolume", this.oldMetronomeVolume);
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.metronome.volume = this.newMetronomeVolume;
    this.context.commit("setMetronomeVolume", this.newMetronomeVolume);
    return;
  }
}
