import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";
import { Controller } from "@/audioeditor/controller/Controller";
import { AnyContext } from "@/audioeditor/store/modules/audioEditorModule";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import { Segment } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/track/Segment";

export class PasteMultiSegmentSelection extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: AnyContext;
  private isFirstRedo: boolean;
  private addSegmentsCommands: Array<AbstractCommand>;
  private segmentIds: Array<UniqueId>;
  constructor(audioEditor: AudioEditor, context: AnyContext) {
    super("PasteMultiSegmentSelection");
    this.audioEditor = audioEditor;
    this.context = context;
    this._verboseDescription = `count:${this.audioEditor.trackEditor.multiSegmentSelection.selection.length}`;
    this.isFirstRedo = true;
    this.addSegmentsCommands = [];
    this.segmentIds = [];
  }
  public async undo(): Promise<AbstractCommandExecutionResult> {
    for (const command of this.addSegmentsCommands) {
      await command.undo();
    }
    return;
  }
  private async firstRedoAuxiliary() {
    const options = this.audioEditor.trackEditor.getOptionsForPastMultiSegmentSelection();
    for (const item of options) {
      const unCompletedCommandArgs = {
        trackId: item.trackId,
        segments: [item.segmentOptions],
        placeToTrackEnd: false,
      };
      const result = await Controller.handleCommand(this.context, { commandName: "AddSegments", unCompletedCommandArgs: Object.values(unCompletedCommandArgs), controllerOptions: { isCalledByCommand: true } });
      if (!result || !result.executionResult) {
        throw new Error();
      }
      this.segmentIds.push(...result.executionResult.data.segments.map((segment: Segment) => segment.id));

      this.addSegmentsCommands.push(result.command);
    }
  }
  private async furtherRedoAuxiliary() {
    for (const command of this.addSegmentsCommands) {
      await command.redo();
    }
  }
  private async setSelectionToPastedSegments() {
    const unCompletedCommandArgs = {
      segmentIds: this.segmentIds,
      electionMode: "replace",
    };
    await Controller.handleCommand(this.context, { commandName: "MultiSegmentSelectionAddItems", unCompletedCommandArgs: Object.values(unCompletedCommandArgs), controllerOptions: { isCalledByCommand: true } });
  }
  public async redo(): Promise<AbstractCommandExecutionResult> {
    if (this.isFirstRedo) {
      await this.firstRedoAuxiliary();
      this.isFirstRedo = false;
    } else {
      await this.furtherRedoAuxiliary();
    }
    await this.setSelectionToPastedSegments();

    return;
  }
}
