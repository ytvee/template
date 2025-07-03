import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";
import { Controller } from "@/audioeditor/controller/Controller";
import { AnyContext } from "@/audioeditor/store/modules/audioEditorModule";

export class CutMultiSegmentSelection extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: AnyContext;
  private isFirstRedo: boolean;
  private removeMultiSegmentSelectionCommand: AbstractCommand | null;
  constructor(audioEditor: AudioEditor, context: AnyContext) {
    super("CutMultiSegmentSelection");
    this.audioEditor = audioEditor;
    this.context = context;
    this.isFirstRedo = true;
    this._verboseDescription = `count:${this.audioEditor.trackEditor.multiSegmentSelection.selection.length}`;
    this.removeMultiSegmentSelectionCommand = null;
  }
  public async undo(): Promise<AbstractCommandExecutionResult> {
    if (!this.removeMultiSegmentSelectionCommand) {
      throw new Error();
    }
    await this.removeMultiSegmentSelectionCommand.undo();
    return;
  }
  private async firstRedo() {
    await Controller.handleCommand(this.context, { commandName: "CopyMultiSegmentSelection", unCompletedCommandArgs: [], controllerOptions: { isCalledByCommand: true } });
    const result = await Controller.handleCommand(this.context, { commandName: "RemoveMultiSegmentSelection", unCompletedCommandArgs: [], controllerOptions: { isCalledByCommand: true } });
    if (!result) {
      throw new Error();
    }
    this.removeMultiSegmentSelectionCommand = result.command;
  }
  private async furtherRedo() {
    if (!this.removeMultiSegmentSelectionCommand) {
      throw new Error();
    }
    await this.removeMultiSegmentSelectionCommand.redo();
  }
  public async redo(): Promise<AbstractCommandExecutionResult> {
    if (this.isFirstRedo) {
      await this.firstRedo();
    } else {
      await this.furtherRedo();
    }

    return;
  }
}
