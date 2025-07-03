import { ObjectTransformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import { SegmentSave } from "../trackeditorbase/SaveLoadManager";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import { TransformationMatrix } from "@/audioeditor/visualmodel/types";

export type MultiSegmentSelectionSave = {
  segmentSaves: Array<{ trackId: UniqueId; segmentTransformations: TransformationMatrix; segmentSave: SegmentSave }>;
  selectionTransformation: ObjectTransformation;
};
export class Clipboard {
  private multisegmentSelectionSave: MultiSegmentSelectionSave | null = null;
  constructor() {}
  /**
   *
   * @param multiSegmentSelection array of segment saves
   */
  public writeMultiSegmentSelection(multiSegmentSelection: MultiSegmentSelectionSave): void {
    this.multisegmentSelectionSave = multiSegmentSelection;
  }
  public readMultiSegmentSelection() {
    return this.multisegmentSelectionSave;
  }
  public clear() {
    this.multisegmentSelectionSave = null;
  }
}
