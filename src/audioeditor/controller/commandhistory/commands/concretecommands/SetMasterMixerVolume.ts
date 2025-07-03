/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import store from "@/store/store";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
/* /receivers */

type Options = {
  isSharp: boolean;
};

export class SetMasterMixerVolume extends AbstractCommand {
  private audioEditor: AudioEditor;
  // private context: Context; //TODO: do not use context in commands

  /* redo */
  private newVolume: number;
  private options?: Partial<Options>;
  /* /redo */

  /* undo */
  private oldVolume?: number;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, volume: number, oldVolume?: number, options?: Partial<Options>) {
    super("SetMasterMixerVolume");
    this.audioEditor = audioEditor;
    // this.context = context;

    this.oldVolume = oldVolume;
    this.newVolume = volume;

    this.options = options;

    this._verboseDescription = `${this.oldVolume}-->${this.newVolume}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    if (this.oldVolume === undefined) {
      throw new Error("undo is not executable when oldVolume is not set");
    }
    this.audioEditor.trackEditor.masterMixer.setVolume(this.oldVolume, this.options?.isSharp);
    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "setMasterMixerVolume", this.oldVolume);
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    this.audioEditor.trackEditor.masterMixer.setVolume(this.newVolume, this.options?.isSharp);
    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "setMasterMixerVolume", this.newVolume);
    return;
  }
}
