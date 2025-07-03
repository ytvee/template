/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
/* /receivers */

export class SetMetronomeSound extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private newSoundName: string;
  /* /redo */

  /* undo */
  private oldSoundName: string;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, soundName: string) {
    super("SetMetronomeSound");
    this.audioEditor = audioEditor;
    this.context = context;

    this.oldSoundName = this.audioEditor.trackEditor.metronome.getCurrentSound().name;
    this.newSoundName = soundName;

    this._verboseDescription = `${this.oldSoundName}-->${this.newSoundName}`;
  }
  public override async undo(): Promise<AbstractCommandExecutionResult> {
    await this.audioEditor.trackEditor.metronome.setSoundByName(this.oldSoundName);
    this.context.commit("setMetronomeSound", { soundName: this.oldSoundName });
    return;
  }
  public override async redo(): Promise<AbstractCommandExecutionResult> {
    await this.audioEditor.trackEditor.metronome.setSoundByName(this.newSoundName);
    this.context.commit("setMetronomeSound", { soundName: this.newSoundName });
    return;
  }
}
