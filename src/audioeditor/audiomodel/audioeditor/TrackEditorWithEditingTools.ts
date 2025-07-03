import * as Tone from "customized-tone";
import { MultiSegmentSelection } from "./trackeditor/editingtools/MultiSegmentSelection";
import { Scissors } from "./trackeditor/editingtools/Scissors";
import { BaseTrackEditor } from "./trackeditor/BaseTrackEditor";
import { UniqueId } from "../types";
import { ObjectTransformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import { Point, TransformationMatrix } from "@/audioeditor/visualmodel/types";
import { Clipboard } from "./trackeditor/editingtools/Clipboard";

export type MoveSelectionStartMemento = {
  selectionTransformation: ObjectTransformation;
  itemTransformations: Map<UniqueId, TransformationMatrix>;
};
export type MoveSegmentStartMemento = {
  segmentTransformation: ObjectTransformation;
};

class TrackEditorWithEditingTools extends BaseTrackEditor {
  /* editing tools */
  public multiSegmentSelection: MultiSegmentSelection;
  public scissors: Scissors;
  public clipboard: Clipboard;
  /* /editing tools */

  public static async createInstance(toneAudioContext: Tone.BaseContext, outputNode: AudioNode) {
    const instance = new TrackEditorWithEditingTools(toneAudioContext, outputNode);
    await instance.initialize();
    return instance;
  }

  constructor(toneAudioContext: Tone.BaseContext, outputNode: AudioNode) {
    super(toneAudioContext, outputNode);

    this.multiSegmentSelection = new MultiSegmentSelection(this.getTrackEditorApiForEditingTools());

    this.scissors = new Scissors(this.getTrackEditorApiForEditingTools(), this.multiSegmentSelection);
    this.clipboard = new Clipboard();
  }
  protected async initialize() {
    await super.initialize();

    //place here initialize code
  }

  /* Multiselection tools (move copy paste delete etc) */
  private getSegmentTransformation(segmentId: UniqueId): ObjectTransformation {
    const segment = this.getSegmentBySegmentId(segmentId);
    return new ObjectTransformation(segment.startWithBounds, this.getTrackBySegmentId(segmentId).y);
  }
  public getMoveSegmentStartMemento(segmentId: UniqueId): MoveSegmentStartMemento {
    const segmentTransformation = this.getSegmentTransformation(segmentId);
    return {
      segmentTransformation,
    };
  }
  public getMoveSelectionStartMemento(): MoveSelectionStartMemento {
    const transformations = this.multiSegmentSelection.getTransformations();
    return {
      selectionTransformation: transformations.selectionTransformation,
      itemTransformations: transformations.itemTransformations,
    };
  }

  public copyMultiSegmentSelectionToClipboard() {
    const save = this.multiSegmentSelection.getSave();
    this.clipboard.writeMultiSegmentSelection(save);
  }
  public getOptionsForPastMultiSegmentSelection() {
    const save = this.clipboard.readMultiSegmentSelection();
    if (save === null) {
      throw new Error("Clipboard does not contain multisegment selection save!");
    }
    const audioCursorOrigin: Point = { x: this.getCurrentTime(), y: 0 };
    return this.multiSegmentSelection.getOptions(audioCursorOrigin, save);
  }
  /* /Multiselection tools */
}
export { TrackEditorWithEditingTools as TrackEditor };
