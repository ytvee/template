import * as Tone from "customized-tone";
import { RecursivePartial, UniqueId } from "@/audioeditor/audiomodel/types";
import { generateUniqueId } from "../../../common/common";
import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { Segment, SegmentEditingTools, SegmentEditingToolsOptions } from "./Segment";

type UserSpecifiedPartialTrackOptions = {
  id: UniqueId;
  name: string;
  /**
   * seconds. Start Position of this segment in ablosute time.
   */
  startPosition: number;
  placeToTrackEnd: boolean; //is segment positioned after last segment in track. Takes precedence over startPosition.
  segmentEditingTools: SegmentEditingToolsOptions;
};
type UserSpecifiedRequiredTrackOptions = {
  url: string;
};
export type SegmentOptions = RecursivePartial<UserSpecifiedPartialTrackOptions> & UserSpecifiedRequiredTrackOptions;
export type CompletedSegmentOptions = Omit<UserSpecifiedPartialTrackOptions, "placeToTrackEnd"> &
  UserSpecifiedRequiredTrackOptions & {
    toneAudioContext: Tone.BaseContext;
    outputNode: AudioNode;
  };

export const DEFAULT_SEGMENT_EDITING_TOOLS: SegmentEditingToolsOptions = {
  editableBounds: {
    leftBoundPosition: undefined,
    rightBoundPosition: undefined,
  },
};

export class SegmentFactory {
  private static completeSegmentEditingTools(partialSegmentEditingToolsOptions?: RecursivePartial<SegmentEditingTools>): SegmentEditingToolsOptions {
    let segmentEditingToolsOptions: SegmentEditingToolsOptions;
    if (partialSegmentEditingToolsOptions === undefined) {
      segmentEditingToolsOptions = structuredClone(DEFAULT_SEGMENT_EDITING_TOOLS);
    } else {
      const partialEditableBounds = partialSegmentEditingToolsOptions.editableBounds;
      if (partialEditableBounds === undefined) {
        segmentEditingToolsOptions = {
          editableBounds: structuredClone(DEFAULT_SEGMENT_EDITING_TOOLS.editableBounds),
        };
      } else {
        segmentEditingToolsOptions = {
          editableBounds: {
            leftBoundPosition: partialEditableBounds.leftBoundPosition,
            rightBoundPosition: partialEditableBounds.rightBoundPosition,
          },
        };
      }
    }
    // structuredClone(partialSegmentEditingTools) : structuredClone(DEFAULT_SEGMENT_EDITING_TOOLS),

    return segmentEditingToolsOptions;
  }
  private static completeSegmentOptions(toneAudioContext: Tone.BaseContext, outputNode: AudioNode, segmentOptions: SegmentOptions, endPositionOfTrack: number): CompletedSegmentOptions {
    const segmentId = segmentOptions.id ?? generateUniqueId();
    const completedSegmentOptions: CompletedSegmentOptions = {
      ...segmentOptions,
      id: segmentId,
      name: segmentOptions.name ?? AUDIO_EDITOR_CONFIGURATION.tracksEditor.strings.segmentName,
      startPosition: segmentOptions.placeToTrackEnd ?? false ? endPositionOfTrack : segmentOptions.startPosition ?? 0,
      segmentEditingTools: this.completeSegmentEditingTools(segmentOptions.segmentEditingTools),

      toneAudioContext: toneAudioContext,
      outputNode: outputNode,
    };
    return completedSegmentOptions;
  }
  public static async createSegment(toneAudioContext: Tone.BaseContext, outputNode: AudioNode, segmentOptions: SegmentOptions, endPositionOfTrack: number): Promise<Segment> {
    const completedSegmentOptions: CompletedSegmentOptions = this.completeSegmentOptions(toneAudioContext, outputNode, segmentOptions, endPositionOfTrack);
    const segment: Segment = await Segment.createSegment(completedSegmentOptions);
    return segment;
  }
}
