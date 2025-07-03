import { UniqueId } from "@/audioeditor/audiomodel/types";
import { VisualSegment, VisualTrack, VisualTrackMixingTools } from "../store/modules/submodules/trackEditor";
import { Segment } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/track/Segment";
import { Track } from "../audiomodel/audioeditor/trackeditor/trackeditorbase/Track";

export class VisualTrackFactory {
  public static parseVisualSegmentFromSegment(segment: Segment): VisualSegment {
    return {
      id: segment.id,
      name: segment.name,
      segmentStartTime: segment.startPosition,
      segmentDuration: segment.duration ?? 0,
      wavesurferContainerRef: segment.wavesurferContainerRef,
      segmentEditingTools: {
        editableBounds: {
          leftBoundPosition: segment.segmentEditingTools.editableBounds.leftBoundPosition,
          rightBoundPosition: segment.segmentEditingTools.editableBounds.rightBoundPosition,
        },
      },
    };
  }
  /**
   * @param currentColorIndexes indexes which are currently used in visual tracks
   * @returns visual track object which created from initialized internal track of multiTrackUtils
   */
  public static parseVisualTrackFromTrack(visualTracks: Map<UniqueId, VisualTrack>, track: Track): VisualTrack {
    //TODO: remove extra arguments
    const visualTrackMixingTools: VisualTrackMixingTools = {
      ...structuredClone(track.trackMixingTools),
      trackVolumePower: track.getTrackVolumePower(),
      volumeMeter: {
        leftChannel: {
          volume: 0,
          peakVolume: 0,
        },
        rightChannel: {
          volume: 0,
          peakVolume: 0,
        },
      },
    };
    const visualTrackToPush: VisualTrack = {
      id: track.id,
      musicianName: track.musicianName,
      soundSource: track.soundSource,
      y: track.y,
      trackColor: structuredClone(track.trackColor),
      visualTrackMixingTools,
      visualSegments: new Map(
        Array.from(track.segments.values()).map((segment) => {
          const visualSegment: VisualSegment = this.parseVisualSegmentFromSegment(segment);
          return [visualSegment.id, visualSegment];
        })
      ),
    };
    return visualTrackToPush;
  }
}
