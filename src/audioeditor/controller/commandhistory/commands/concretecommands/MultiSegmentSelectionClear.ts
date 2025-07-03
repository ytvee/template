import { Context } from "@/audioeditor/store/modules/submodules/trackeditor/editingTools";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { MultiSegmentSelectionSelection } from "@/audioeditor/audiomodel/audioeditor/trackeditor/editingtools/MultiSegmentSelection";

export class MultiSegmentSelectionClear extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private newSelection: MultiSegmentSelectionSelection | null;
  /* /redo */

  /* undo */
  private oldSelection: MultiSegmentSelectionSelection;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context) {
    super("MultiSegmentSelectionClear");
    this.audioEditor = audioEditor;
    this.context = context;

    this.oldSelection = this.audioEditor.trackEditor.multiSegmentSelection.selection;
    this.newSelection = null;
  }
  public undo(): AbstractCommandExecutionResult | Promise<AbstractCommandExecutionResult> {
    this.audioEditor.trackEditor.multiSegmentSelection.setSeleciton(this.oldSelection);
    this.context.commit("modifyBoxSelection", { selection: this.audioEditor.trackEditor.multiSegmentSelection.selection, selectionCandidates: this.audioEditor.trackEditor.multiSegmentSelection.selectionCandidates, boxSelectionEndPoint: this.audioEditor.trackEditor.multiSegmentSelection.boxSelectionEndPoint });
    return;
  }
  public redo(): AbstractCommandExecutionResult | Promise<AbstractCommandExecutionResult> {
    this.audioEditor.trackEditor.multiSegmentSelection.clearSelection();
    this.newSelection = this.audioEditor.trackEditor.multiSegmentSelection.selection;
    this._verboseDescription = `count:${this.oldSelection.length}-->${this.newSelection.length}`;
    this.context.commit("modifyBoxSelection", { selection: this.audioEditor.trackEditor.multiSegmentSelection.selection, selectionCandidates: this.audioEditor.trackEditor.multiSegmentSelection.selectionCandidates, boxSelectionEndPoint: this.audioEditor.trackEditor.multiSegmentSelection.boxSelectionEndPoint });
    const executionResult = {
      shouldBeIncludedToHistory: !this.audioEditor.trackEditor.multiSegmentSelection.isSelectionsEqual(this.newSelection, this.oldSelection),
    };
    return executionResult;
  }
}
