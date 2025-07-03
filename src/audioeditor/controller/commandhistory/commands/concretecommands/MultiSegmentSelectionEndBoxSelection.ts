import { Context } from "@/audioeditor/store/modules/submodules/trackeditor/editingTools";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { Point } from "@/audioeditor/visualmodel/types";
import { MultiSegmentSelectionSelection } from "@/audioeditor/audiomodel/audioeditor/trackeditor/editingtools/MultiSegmentSelection";

export class MultiSegmentSelectionEndBoxSelection extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* first redo */
  private isFirstRedo = true;
  private boxSelectionEndPoint: Point;
  /* /first redo */

  /* redo */
  private newSelection: MultiSegmentSelectionSelection | null;
  /* /redo */

  /* undo */
  private oldSelection: MultiSegmentSelectionSelection;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, boxSelectionEndPoint: Point) {
    super("MultiSegmentSelectionEndBoxSelection");
    this.audioEditor = audioEditor;
    this.context = context;

    this.boxSelectionEndPoint = boxSelectionEndPoint;
    this.oldSelection = this.audioEditor.trackEditor.multiSegmentSelection.selection;

    this.newSelection = null;
  }
  public undo(): AbstractCommandExecutionResult | Promise<AbstractCommandExecutionResult> {
    this.audioEditor.trackEditor.multiSegmentSelection.setSeleciton(this.oldSelection);
    this.context.commit("modifyBoxSelection", { selection: this.audioEditor.trackEditor.multiSegmentSelection.selection, selectionCandidates: this.audioEditor.trackEditor.multiSegmentSelection.selectionCandidates, boxSelectionEndPoint: this.audioEditor.trackEditor.multiSegmentSelection.boxSelectionEndPoint });
    return;
  }
  public redo(): AbstractCommandExecutionResult | Promise<AbstractCommandExecutionResult> {
    let executionResult: AbstractCommandExecutionResult = undefined;
    if (this.isFirstRedo) {
      this.isFirstRedo = false;
      this.audioEditor.trackEditor.multiSegmentSelection.endBoxSelection(this.boxSelectionEndPoint);
      this.newSelection = this.audioEditor.trackEditor.multiSegmentSelection.selection;

      this.context.commit("modifyBoxSelection", { selection: this.audioEditor.trackEditor.multiSegmentSelection.selection, selectionCandidates: this.audioEditor.trackEditor.multiSegmentSelection.selectionCandidates, boxSelectionEndPoint: this.audioEditor.trackEditor.multiSegmentSelection.boxSelectionEndPoint });
      this.context.commit("endBoxSelection"); //TODO: move to modifyBoxSelection mutation

      this._verboseDescription = `count:${this.oldSelection.length}-->${this.newSelection.length}`;
      if (this.audioEditor.trackEditor.multiSegmentSelection.isSelectionsEqual(this.newSelection, this.oldSelection)) {
        executionResult = {
          shouldBeIncludedToHistory: false,
          shouldNotBeIncludedToHistoryReason: "no_changes",
        };
      }
    } else {
      if (!this.newSelection) {
        throw new Error();
      }
      this.audioEditor.trackEditor.multiSegmentSelection.setSeleciton(this.newSelection);
      this.context.commit("modifyBoxSelection", { selection: this.audioEditor.trackEditor.multiSegmentSelection.selection, selectionCandidates: this.audioEditor.trackEditor.multiSegmentSelection.selectionCandidates, boxSelectionEndPoint: this.audioEditor.trackEditor.multiSegmentSelection.boxSelectionEndPoint });
    }
    return executionResult;
  }
}
