import { Context } from "@/audioeditor/store/modules/submodules/trackeditor/editingTools";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { MultiSegmentSelectionMode, MultiSegmentSelectionSelection, SelectionItem } from "@/audioeditor/audiomodel/audioeditor/trackeditor/editingtools/MultiSegmentSelection";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import store from "@/store/store";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";

export class MultiSegmentSelectionAddItems extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private itemsToAdd: Array<SelectionItem>;
  private selectionMode: MultiSegmentSelectionMode;
  private newSelection: MultiSegmentSelectionSelection | null;
  /* /redo */

  /* undo */
  private oldSelection: MultiSegmentSelectionSelection;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, segmentIds: Array<UniqueId>, selectionMode: MultiSegmentSelectionMode) {
    super("MultiSegmentSelectionAddItems");
    this.audioEditor = audioEditor;
    this.context = context;

    this.oldSelection = this.audioEditor.trackEditor.multiSegmentSelection.selection;
    this.itemsToAdd = segmentIds.map((segmentId) => ({ segmentId }));
    this.selectionMode = selectionMode;
    this.newSelection = null;
  }
  public undo(): AbstractCommandExecutionResult | Promise<AbstractCommandExecutionResult> {
    this.audioEditor.trackEditor.multiSegmentSelection.setSeleciton(this.oldSelection);
    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS + "/" + "modifyBoxSelection", { selection: this.audioEditor.trackEditor.multiSegmentSelection.selection, selectionCandidates: this.audioEditor.trackEditor.multiSegmentSelection.selectionCandidates, boxSelectionEndPoint: this.audioEditor.trackEditor.multiSegmentSelection.boxSelectionEndPoint });
    return;
  }
  public redo(): AbstractCommandExecutionResult | Promise<AbstractCommandExecutionResult> {
    switch (this.selectionMode) {
      case "replace": {
        this.audioEditor.trackEditor.multiSegmentSelection.replaceSelectionWithItems(this.itemsToAdd);
        break;
      }
      case "add": {
        this.audioEditor.trackEditor.multiSegmentSelection.addItemsToSelection(this.itemsToAdd);
        break;
      }
      case "substract": {
        this.audioEditor.trackEditor.multiSegmentSelection.substractItemsFromSelection(this.itemsToAdd);
        break;
      }
    }

    this.newSelection = this.audioEditor.trackEditor.multiSegmentSelection.selection;
    this._verboseDescription = `count:${this.oldSelection.length}-->${this.newSelection.length}`;

    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS + "/" + "modifyBoxSelection", { selection: this.audioEditor.trackEditor.multiSegmentSelection.selection, selectionCandidates: this.audioEditor.trackEditor.multiSegmentSelection.selectionCandidates, boxSelectionEndPoint: this.audioEditor.trackEditor.multiSegmentSelection.boxSelectionEndPoint });
    const executionResult = {
      shouldBeIncludedToHistory: !this.audioEditor.trackEditor.multiSegmentSelection.isSelectionsEqual(this.newSelection, this.oldSelection),
    };
    return executionResult;
  }
}
