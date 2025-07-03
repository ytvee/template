import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";
import { Controller } from "@/audioeditor/controller/Controller";
import { AnyContext } from "@/audioeditor/store/modules/audioEditorModule";

export class RemoveMultiSegmentSelection extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: AnyContext;
  private removeSegmentCommmands: Array<AbstractCommand>;
  constructor(audioEditor: AudioEditor, context: AnyContext) {
    super("RemoveMultiSegmentSelection");
    this.audioEditor = audioEditor;
    this.context = context;
    this.removeSegmentCommmands = [];
    const selection = audioEditor.trackEditor.multiSegmentSelection.selection;

    this._verboseDescription = `count:${selection.length}`;
  }
  public async undo(): Promise<AbstractCommandExecutionResult> {
    while (this.removeSegmentCommmands.length) {
      const command = this.removeSegmentCommmands.pop();
      if (!command) {
        throw new Error();
      }
      await command.undo();
    }
    return;
  }
  public async redo(): Promise<AbstractCommandExecutionResult> {
    for (const item of this.audioEditor.trackEditor.multiSegmentSelection.selection) {
      const unCompletedCommandArgs = [this.audioEditor.trackEditor.getTrackIdBySegmentId(item.segmentId), [item.segmentId]];
      const result = await Controller.handleCommand(this.context, { commandName: "RemoveSegments", unCompletedCommandArgs, controllerOptions: { isCalledByCommand: true } });
      if (!result) {
        throw new Error();
      }
      this.removeSegmentCommmands.push(result.command);
    }
    return;
  }
}
