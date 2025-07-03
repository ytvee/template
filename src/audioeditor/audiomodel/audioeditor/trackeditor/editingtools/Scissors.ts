import { UniqueId } from "@/audioeditor/audiomodel/types";
import { MultiSegmentSelection } from "./MultiSegmentSelection";
import { Segment } from "../trackeditorbase/track/Segment";
import { SegmentOptions } from "../trackeditorbase/track/SegmentFactory";
import { sliceAudioBuffer } from "../../common/editingToolsUtils";
import { TrackEditorApiForEditingTools } from "../BaseTrackEditor";
import { encodeAudioBufferToWaveFile } from "../../common/audiorecorderutils/encode-audio";
import { SaveLoadManager } from "../trackeditorbase/SaveLoadManager";

type SliceSelectionResultItem = {
  trackId: UniqueId;
  segmentId: UniqueId;
  // pieces: [{startPosition: number, blob: Blob}, {startPosition: number, blob: Blob}]
  pieces: [SegmentOptions, SegmentOptions];
};

export type SliceSelectionResult = {
  slicePositionWorld: number;
  sourceAndPieces: Array<SliceSelectionResultItem>;
};
export class Scissors {
  private trackEditorApi: TrackEditorApiForEditingTools;

  private _isEnabled: boolean;

  private multiSegmentSelection: MultiSegmentSelection;

  get isEnabled() {
    return this._isEnabled;
  }
  set isEnabled(isEnabled: boolean) {
    this._isEnabled = isEnabled;
  }
  constructor(trackEditorApiForEditingTools: TrackEditorApiForEditingTools, multiSegmentSelection: MultiSegmentSelection) {
    this.trackEditorApi = trackEditorApiForEditingTools;

    this._isEnabled = false;
    this.multiSegmentSelection = multiSegmentSelection;
  }
  private isSegmentShouldBeSliced(segmentToSlice: Segment, slicePositionWorld: number): boolean {
    return slicePositionWorld > segmentToSlice.startWithBounds && slicePositionWorld < segmentToSlice.startWithBounds + segmentToSlice.durationWidthBounds; //TODO:
  }
  private sliceSegmentBuffer(segmentToSlice: Segment, slicePositionSegment: number): [AudioBuffer, AudioBuffer] {
    const buffer = segmentToSlice.audio?.buffer;
    if (!buffer) {
      throw new Error();
    }
    const firstPiece = sliceAudioBuffer(this.trackEditorApi.getContext().audioContext, buffer, 0, slicePositionSegment);
    const secondPiece = sliceAudioBuffer(this.trackEditorApi.getContext().audioContext, buffer, slicePositionSegment);

    return [firstPiece, secondPiece];
  }
  private sliceSegment(segmentToSlice: Segment, slicePositionWorld: number): [Blob, Blob] {
    const slicePositionSegment = slicePositionWorld - segmentToSlice.startPosition;
    const [firstPieceBuffer, secondPieceBuffer] = this.sliceSegmentBuffer(segmentToSlice, slicePositionSegment);

    const DEFAULT_BITS_PER_SAMPLE = 16; //TODO: remake
    const options = { bitsPerSample: DEFAULT_BITS_PER_SAMPLE };
    const firstPieceWaveBlob = encodeAudioBufferToWaveFile(firstPieceBuffer, options);
    const secondPieceWaveBlob = encodeAudioBufferToWaveFile(secondPieceBuffer, options);
    return [firstPieceWaveBlob, secondPieceWaveBlob];
  }
  private getPieceSegmentOptions(segmentToSlice: Segment, pieceNumber: 0 | 1, startPosition: number, slicePositionSegment: number, blob: Blob): SegmentOptions {
    const segmentSave = SaveLoadManager.getSegmentSaveBySegment(segmentToSlice);
    const pieceSegmentOptions = SaveLoadManager.getSegmentOptionsBySegmentSave(segmentSave);
    pieceSegmentOptions.id = undefined;
    pieceSegmentOptions.startPosition = startPosition;
    pieceSegmentOptions.url = URL.createObjectURL(blob);
    if (!(pieceSegmentOptions.segmentEditingTools && pieceSegmentOptions.segmentEditingTools.editableBounds)) {
      throw new Error();
    }
    if (pieceNumber === 0) {
      pieceSegmentOptions.segmentEditingTools.editableBounds.rightBoundPosition = undefined;
    } else {
      pieceSegmentOptions.segmentEditingTools.editableBounds.leftBoundPosition = undefined;
      pieceSegmentOptions.segmentEditingTools.editableBounds.rightBoundPosition = segmentToSlice.segmentEditingTools.editableBounds.rightBoundPosition - slicePositionSegment;
    }
    return pieceSegmentOptions;
  }
  public sliceSelection(slicePositionWorld?: number): SliceSelectionResult {
    if (!this.isEnabled) {
      throw new Error();
    }
    const selection = this.multiSegmentSelection.selection;
    if (slicePositionWorld === undefined) {
      slicePositionWorld = this.trackEditorApi.getInstance().getCurrentTime();
    }
    const sliceSelectionResult: SliceSelectionResult = {
      slicePositionWorld,
      sourceAndPieces: [],
    };

    for (let i = 0; i < selection.length; i++) {
      const segmentId = selection[i].segmentId;
      const segment = this.trackEditorApi.getInstance().getSegmentBySegmentId(segmentId);

      if (this.isSegmentShouldBeSliced(segment, slicePositionWorld)) {
        const slicePositionSegment = slicePositionWorld - segment.startPosition;
        const pieces = this.sliceSegment(segment, slicePositionWorld);
        const firstPiece: SegmentOptions = this.getPieceSegmentOptions(segment, 0, segment.startPosition, slicePositionSegment, pieces[0]);
        const secondPiece: SegmentOptions = this.getPieceSegmentOptions(segment, 1, slicePositionWorld, slicePositionSegment, pieces[1]);

        const sliceSelectionResultItem: SliceSelectionResultItem = {
          trackId: this.trackEditorApi.getInstance().getTrackIdBySegmentId(segmentId),
          segmentId,
          pieces: [firstPiece, secondPiece],
        };
        sliceSelectionResult.sourceAndPieces.push(sliceSelectionResultItem);
      }
    }
    return sliceSelectionResult;
  }
}
