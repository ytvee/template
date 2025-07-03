import * as Tone from "customized-tone";
import EventEmitter from "wavesurfer.js/dist/event-emitter";
import { Segment } from "./track/Segment";
import { AnalyserNodeVolumeMeter } from "../../common/volumemeters/AnalyserNodeVolumeMeter";
import { getSoundPowerBySoundLevel } from "../../common/common";
import { AnyAudioContext } from "customized-tone/build/esm/core/context/AudioContext";
import { ColorString, UniqueId } from "../../../types";
import { CompletedTrackOptions } from "./TrackFactory";
import { SegmentFactory, SegmentOptions } from "./track/SegmentFactory";

export type TrackEvents = {
  "track-disable-solo": [{ trackId: UniqueId }];
};

export type TrackColor = {
  index: number;
  primary: ColorString;
  text: ColorString;
};

type TrackMixingTools = {
  trackVolume: number; //float [0...1]
  trackStereoPanorama: number; //float [-1...1]
  trackMuteState: {
    isMuted: boolean; //is this track muted by "mute" button
    isSolo: boolean; //is chosen as solo track by "solo" button
    isMutedBySolo: boolean; //is this track muted because some other track is soloed
    isMutedEventually: boolean; //TODO: not used. Need to be removed. Is this track muted eventually (by a button, due to another solo track or for some other reason)
  };
};
const DEFAULT_TRACK_MIXING_TOOLS: TrackMixingTools = {
  trackVolume: 1,
  trackStereoPanorama: 0,
  trackMuteState: {
    isMuted: false,
    isSolo: false,
    isMutedBySolo: false,
    isMutedEventually: false,
  },
};

export class Track extends EventEmitter<TrackEvents> {
  private toneAudioContext: Tone.BaseContext;
  private audioContext: AnyAudioContext;
  /**
   * the node which acts as output node for track. The track connects to this node
   */
  private outputNode?: AudioNode;
  /**
   * gathers all nodes used by track to one for futher analyse
   */
  private trackGatheringNode: GainNode;

  public id: UniqueId;
  public y: number;
  public trackColor: TrackColor;
  public musicianName: string;
  public soundSource: string;

  public segments: Map<UniqueId, Segment> = new Map();
  public trackMixingTools: TrackMixingTools;
  public volumeMeter: AnalyserNodeVolumeMeter;

  constructor(completedTrackOptions: CompletedTrackOptions) {
    super();
    this.toneAudioContext = completedTrackOptions.toneAudioContext;
    this.audioContext = this.toneAudioContext.rawContext;
    this.outputNode = completedTrackOptions.outputNode;
    this.trackGatheringNode = this.audioContext.createGain();
    if (!this.outputNode) {
      throw new Error();
    }
    this.trackGatheringNode.connect(this.outputNode);

    this.id = completedTrackOptions.id;
    this.y = completedTrackOptions.y;
    this.trackColor = completedTrackOptions.trackColor;
    this.musicianName = completedTrackOptions.musicianName;
    this.soundSource = completedTrackOptions.soundSource;

    this.trackMixingTools = {
      trackVolume: completedTrackOptions.trackMixingToolsOptions.trackVolume ?? DEFAULT_TRACK_MIXING_TOOLS.trackVolume,
      trackStereoPanorama: completedTrackOptions.trackMixingToolsOptions?.trackStereoPanorama ?? DEFAULT_TRACK_MIXING_TOOLS.trackStereoPanorama,
      trackMuteState: {
        isMuted: completedTrackOptions.trackMixingToolsOptions?.trackMuteState?.isMuted ?? DEFAULT_TRACK_MIXING_TOOLS.trackMuteState.isMuted,
        isSolo: completedTrackOptions.trackMixingToolsOptions?.trackMuteState?.isSolo ?? DEFAULT_TRACK_MIXING_TOOLS.trackMuteState.isSolo,
        isMutedBySolo: completedTrackOptions.trackMixingToolsOptions?.trackMuteState?.isMutedBySolo ?? false,

        isMutedEventually: DEFAULT_TRACK_MIXING_TOOLS.trackMuteState.isMutedEventually,
      },
    };
    this.volumeMeter = new AnalyserNodeVolumeMeter(this.toneAudioContext, this.trackGatheringNode, { peakTimeToLive: 0.5, channelCount: 2 });
    this.volumeMeter.run();
  }
  public destroy() {
    if (this.trackMixingTools.trackMuteState.isSolo) {
      this.emit("track-disable-solo", { trackId: this.id });
    }
    this.segments.forEach((segment) => {
      segment.destroy();
    });
    this.volumeMeter.destroy();
  }
  public getSegmentBySegmentId(segmentId: UniqueId): Segment {
    const segment = this.segments.get(segmentId);
    if (!segment) {
      throw new Error();
    }
    return segment;
  }

  /* segments */
  private getEndPositionOfTrack() {
    if (!this.segments.size) {
      return 0;
    }
    const firstSegment = this.segments.values().next().value;
    if (!firstSegment) {
      throw new Error();
    }
    return Array.from(this.segments.values()).reduce((maxSegmentEnd, segment) => {
      return Math.max(maxSegmentEnd, segment.startPosition + segment.segmentEditingTools.editableBounds.rightBoundPosition);
    }, firstSegment.startPosition + firstSegment.segmentEditingTools.editableBounds.rightBoundPosition);
  }

  /**
   *
   * @param segmentOptions options of audio segment to be added to existing track
   * @param trackId
   * @param placeToTrackEnd whether the track should be placed to the end of track. i.e. after the last segment in this track
   * @returns
   */
  public async addSegment(segmentOptions: SegmentOptions): Promise<Segment> {
    const segmentToPush = await SegmentFactory.createSegment(this.toneAudioContext, this.trackGatheringNode, segmentOptions, this.getEndPositionOfTrack());
    this.segments.set(segmentToPush.id, segmentToPush);
    this.applyTrackMixingToolsToSegment(segmentToPush);
    this.changeMuteAllTrackSegmentsAccordingToTrackMuteState();
    return segmentToPush;
  }
  async addSegments(segmentsOptions: Array<SegmentOptions>): Promise<Array<Segment>> {
    //TODO: not used. May be remove
    const trackSegmentsToPush = [];
    for (let i = 0; i < segmentsOptions.length; i++) {
      const segment = await this.addSegment(segmentsOptions[i]);
      trackSegmentsToPush.push(segment);
    }
    return trackSegmentsToPush;
  }
  private applyTrackMixingToolsToSegment(segment: Segment) {
    //TODO: two similar methods applyTrackMixingToolsToSegment and applyTrackStateToSegment. redo
    if (!segment.audio) {
      throw new Error();
    }
    segment.audio.setVolume(this.trackMixingTools.trackVolume, true);
    segment.audio.setStereoPanorama(this.trackMixingTools.trackStereoPanorama, true);
  }
  /**
   * This function will apply settings such as pan, volume and others to the added segment
   */
  private applyTrackStateToSegment(segment: Segment) {
    segment.audio?.setVolume(this.trackMixingTools.trackVolume);
    segment.audio?.setStereoPanorama(this.trackMixingTools.trackStereoPanorama);

    this.changeMuteAllTrackSegmentsAccordingToTrackMuteState(); //TODO: remake for only one segment

    segment.setOutputNode(this.trackGatheringNode);
  }
  public addExistingSegment(segment: Segment) {
    this.segments.set(segment.id, segment);
    this.applyTrackStateToSegment(segment);
  }
  removeSegment(segmentId: UniqueId) {
    const segment = this.getSegmentBySegmentId(segmentId);
    segment.destroy();
    this.segments.delete(segmentId);
  }
  /* /segments */

  /* track mixing tools */
  public setTrackVolume(trackVolume: number, isSharp?: boolean) {
    this.trackMixingTools.trackVolume = trackVolume;
    if (this.trackMixingTools.trackMuteState.isMuted || this.trackMixingTools.trackMuteState.isMutedBySolo) {
      return;
    }
    this.segments.forEach((segment) => {
      const audio = segment.audio;
      if (!audio) {
        throw new Error();
      }
      audio.setVolume(trackVolume, isSharp);
    });
  }
  public getTrackVolumePower() {
    //TODO: remove
    return getSoundPowerBySoundLevel(this.trackMixingTools.trackVolume);
  }
  setTrackStereoPanorama(trackStereoPanorama: number, isSharp?: boolean) {
    this.trackMixingTools.trackStereoPanorama = trackStereoPanorama;
    this.segments.forEach((segment) => {
      const audio = segment.audio;
      if (!audio) {
        throw new Error();
      }
      audio.setStereoPanorama(trackStereoPanorama, isSharp);
    });
  }
  /**
   *
   * @param track
   * @param isAudible if all of the track segments should be unmuted
   */
  changeMuteAllTrackSegments(isUnmuted: boolean) {
    this.segments.forEach((segment) => {
      const audio = segment.audio;
      if (!audio) {
        throw new Error();
      }
      audio.muted = !isUnmuted;
    });
  }
  switchMuteTrack(isMuted: boolean) {
    this.trackMixingTools.trackMuteState.isMuted = isMuted;
    this.changeMuteAllTrackSegmentsAccordingToTrackMuteState();
  }
  enableSoloTrack() {
    this.trackMixingTools.trackMuteState.isSolo = true;
    this.trackMixingTools.trackMuteState.isMuted = false;
    this.trackMixingTools.trackMuteState.isMutedBySolo = false;
    this.changeMuteAllTrackSegmentsAccordingToTrackMuteState();
  }
  disableSoloTrack() {
    this.trackMixingTools.trackMuteState.isSolo = false;
  }
  /**
   * This function make changes to audibility of track segments when mute state of this track is changed.
   * @param track
   */
  changeMuteAllTrackSegmentsAccordingToTrackMuteState() {
    this.changeMuteAllTrackSegments(!this.trackMixingTools.trackMuteState.isMuted && !this.trackMixingTools.trackMuteState.isMutedBySolo);
  }
  /* /track mixing tools */
}
