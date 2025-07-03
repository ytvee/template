import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";

export class CopyMultiSegmentSelection extends AbstractCommand {
  private audioEditor: AudioEditor;
  constructor(audioEditor: AudioEditor) {
    super("CopyMultiSegmentSelection");
    this.audioEditor = audioEditor;
    this._verboseDescription = `count:${this.audioEditor.trackEditor.multiSegmentSelection.selection.length}`;
  }
  public async undo(): Promise<AbstractCommandExecutionResult> {
    return;
  }
  public async redo(): Promise<AbstractCommandExecutionResult> {
    this.audioEditor.trackEditor.copyMultiSegmentSelectionToClipboard();
    return { shouldBeIncludedToHistory: false, shouldNotBeIncludedToHistoryReason: "concrete_command_configuration" };
  }
}
