import * as Tone from "customized-tone";
import { Track } from "./trackeditorbase/Track";
import { TrackFactory, TrackOptions } from "./trackeditorbase/TrackFactory";

import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";

import { Segment } from "./trackeditorbase/track/Segment";

import { OfflineAudioRecorder } from "./trackeditorbase/OfflineAudioRecorder";
import EventEmitter from "wavesurfer.js/dist/event-emitter";

import { AbstractVisualizer } from "../common/volumemeters/AbstractVisualizer";
import { Metronome } from "./trackeditorbase/Metronome";
import { TimeSignature, UniqueId } from "@audioeditor/audiomodel/types";
import { setTransportPositionQuantized } from "@audioeditor/audiomodel/ToneJsUtils";
import { TransportClass } from "customized-tone/build/esm/core/clock/Transport";
import { AnyAudioContext } from "customized-tone/build/esm/core/context/AudioContext";
import { MasterMixer } from "./trackeditorbase/MasterMixer";
import { SegmentOptions } from "./trackeditorbase/track/SegmentFactory";
import { SaveLoadManager } from "./trackeditorbase/SaveLoadManager";

export type TrackEditorApiForEditingTools = {
  getInstance: () => InstanceType<typeof BaseTrackEditor>;
  getContext: () => {
    audioContext: AnyAudioContext;
    toneAudioContext: Tone.BaseContext;
  };
};

export type TrackEditorEvents = {
  render: [{ transportTime: number }];

  "tracks-solo-mute-state-updated": []; //fires when solo from mute state was updated
  // "track-attribute-changed": [{trackId: UniqueId, attributeName: string, value: any}]; //TODO: map attribute types
  "track-y-changed": [{ trackId: UniqueId; y: number }];

  "recorded-file-ready": [{ recordedFile: Blob }];
};

export class BaseTrackEditor extends AbstractVisualizer {
  public eventEmitter: EventEmitter<TrackEditorEvents>;

  private toneAudioContext: Tone.BaseContext;
  private transport: TransportClass;
  private audioContext: AnyAudioContext;

  private egressNode: GainNode;
  private outputNode: AudioNode;

  private isPlaying = false;

  private _tempo: number;
  public get tempo() {
    return this._tempo;
  }
  public set tempo(tempo) {
    const wasPlaying = this.isPlaying;
    this.pause();
    const currentTransportPosition = this.transport.seconds;
    this._tempo = tempo;
    this.transport.bpm.value = tempo;
    setTransportPositionQuantized(currentTransportPosition, this.transport);
    if (wasPlaying) {
      this.play();
    }
    this.metronome.tempo = this._tempo;
  }
  private _timeSignature: TimeSignature;
  public get timeSignature() {
    return structuredClone(this._timeSignature);
  }
  public set timeSignature(timeSignature: TimeSignature) {
    this._timeSignature = structuredClone(timeSignature);
    this.transport.timeSignature = [timeSignature.upper, timeSignature.lower];
    this.metronome.timeSignature = this._timeSignature;
  }
  get isPlaybackCycled() {
    return this.toneAudioContext.transport.loop;
  }
  set isPlaybackCycled(isCycled: boolean) {
    this.toneAudioContext.transport.loop = isCycled;
  }

  private _selectedTrackId: UniqueId | null = null;
  public get selectedTrackId(): UniqueId | null {
    return this._selectedTrackId;
  }
  public set selectedTrackId(selectedTrackId: UniqueId | null) {
    this._selectedTrackId = selectedTrackId;
  }

  public tracks: Map<UniqueId, Track> = new Map();

  private offlineAudioRecorder: OfflineAudioRecorder | null = null;

  private _metronome: Metronome | null = null;
  public get metronome() {
    if (!this._metronome) {
      throw new Error();
    }
    return this._metronome;
  }
  public masterMixer: MasterMixer;

  /* initialization and destruction */
  protected static async createInstance(toneAudioContext: Tone.BaseContext, outputNode: AudioNode) {
    const instance = new BaseTrackEditor(toneAudioContext, outputNode);
    await instance.initialize();
    return instance;
  }
  constructor(toneAudioContext: Tone.BaseContext, outputNode: AudioNode) {
    super();
    this.eventEmitter = new EventEmitter();

    this.toneAudioContext = toneAudioContext;
    this.transport = this.toneAudioContext.transport;
    this.audioContext = this.toneAudioContext.rawContext;

    this.outputNode = outputNode;
    this.egressNode = this.audioContext.createGain();
    this.egressNode.connect(this.outputNode);

    this._tempo = AUDIO_EDITOR_CONFIGURATION.tracksEditor.functionality.tempo;
    this._timeSignature = structuredClone(AUDIO_EDITOR_CONFIGURATION.tracksEditor.functionality.timeSignature);

    this.transport.on("loopStart", () => this.loopStartHandler());
    // this.transport.on("loopEnd", () => this.loopEndHandler());

    this.masterMixer = new MasterMixer(this.toneAudioContext, this.egressNode);

    super.run();
  }
  protected getTrackEditorApiForEditingTools(): TrackEditorApiForEditingTools {
    return {
      getInstance: () => this,
      getContext: () => ({
        audioContext: this.audioContext,
        toneAudioContext: this.toneAudioContext,
      }),
    };
  }
  private loopStartHandler() {
    if (!this.offlineAudioRecorder) {
      throw new Error();
    }
    const currentTime = this.offlineAudioRecorder.audioRecordRange.start;

    this.transport.pause();
    setTransportPositionQuantized(currentTime);
    this.tracks.forEach((track) => track.segments.forEach((segment) => segment.updateSheduling(true)));
    this.metronome.restartEarlier();
    if (this.isPlaying) {
      this.transport.start();
    }
  }
  // private loopEndHandler() {
  //   this.metronome.restartIfStarted();
  // }
  protected async initialize() {
    this._metronome = await Metronome.createInstance(this.toneAudioContext, { tempo: this.tempo, timeSignature: this.timeSignature, subdivision: AUDIO_EDITOR_CONFIGURATION.tracksEditor.metronome.subdivision });
    this.tempo = this._tempo;
    this.timeSignature = this._timeSignature;
  }
  private resetTone() {
    this.audioCursorUpdatedHandler(0);
    this.transport.cancel();
    this.transport.loop = false;
  }
  public destroy() {
    this.pause();
    this.tracks.forEach((track) => {
      this.removeTrack(track.id);
    });
    this.resetTone();

    super.destroy();
  }
  public setOfflineAudioRecorder(offlineAudioRecorder: OfflineAudioRecorder) {
    this.offlineAudioRecorder = offlineAudioRecorder;
  }
  /* /initialization and destruction */

  /* track manipulation */
  private isSomeTrackSolo(): boolean {
    const firstTrack = this.tracks.values().next().value;
    return Boolean(firstTrack && (firstTrack.trackMixingTools.trackMuteState.isSolo || firstTrack.trackMixingTools.trackMuteState.isMutedBySolo));
  }
  public getMinTrackY(): number | undefined {
    if (!this.tracks.size) {
      return;
    }
    let minY = Number.POSITIVE_INFINITY;
    this.tracks.forEach((track) => {
      minY = Math.min(minY, track.y);
    });
    return minY;
  }
  public getMaxTrackY(): number | undefined {
    if (!this.tracks.size) {
      return;
    }
    let maxY = Number.NEGATIVE_INFINITY;
    this.tracks.forEach((track) => {
      maxY = Math.max(maxY, track.y);
    });
    return maxY;
  }

  public async addTrack(trackOptions: TrackOptions): Promise<Track> {
    const trackToPush = await TrackFactory.createTrack(this, this.toneAudioContext, this.egressNode, trackOptions, this.isSomeTrackSolo());

    trackToPush.on("track-disable-solo", ({ trackId }) => {
      this.switchSoloTrack(trackId, false);
    });

    if (trackToPush.y >= 0) {
      this.shiftTracksWithYGEIfOverlap(trackToPush.y, +1);
    } else {
      this.shiftTracksWithYLEIfOverlap(trackToPush.y, -1);
    }
    this.tracks.set(trackToPush.id, trackToPush);

    if (trackOptions.trackMixingToolsOptions?.trackMuteState?.isSolo) {
      this.switchSoloTrack(trackToPush.id, true);
    }
    trackToPush.changeMuteAllTrackSegmentsAccordingToTrackMuteState();
    return trackToPush;
  }
  private changeTrackY(track: Track, y: number) {
    track.y = y;
    this.eventEmitter["emit"]("track-y-changed", { trackId: track.id, y });
  }

  private shiftTracksWithYGEIfOverlap(y: number, term = 1) {
    const tracksArray = Array.from(this.tracks.values());
    if (!tracksArray.find((track) => track.y === y)) {
      return;
    }
    tracksArray.forEach((track) => {
      if (track.y >= y) {
        // track.y += term;
        this.changeTrackY(track, (track.y += term));
      }
    });
  }
  private shiftTracksWithYGIfNotOverlap(y: number, term = 1) {
    const tracksArray = Array.from(this.tracks.values());
    if (tracksArray.find((track) => track.y === y)) {
      //INFO: return if overlap
      return;
    }
    tracksArray.forEach((track) => {
      if (track.y > y) {
        // track.y += term;
        this.changeTrackY(track, (track.y += term));
      }
    });
  }
  private shiftTracksWithYLEIfOverlap(y: number, term = -1) {
    const tracksArray = Array.from(this.tracks.values());
    if (!tracksArray.find((track) => track.y === y)) {
      return;
    }
    tracksArray.forEach((track) => {
      if (track.y <= y) {
        // track.y += term;
        this.changeTrackY(track, (track.y += term));
      }
    });
  }
  public removeTrack(trackId: UniqueId) {
    const trackToRemove = this.tracks.get(trackId);
    if (!trackToRemove) {
      throw new Error();
    }
    const trackToRemoveY = trackToRemove.y;
    trackToRemove.destroy();
    trackToRemove.unAll();
    this.tracks.delete(trackId);

    if (trackToRemoveY >= 0) {
      this.shiftTracksWithYGIfNotOverlap(trackToRemoveY, -1);
    } else {
      this.shiftTracksWithYLEIfOverlap(trackToRemoveY, +1);
    }
  }
  public async addSegmentToExistingTrack(segmentOptions: SegmentOptions, trackId: UniqueId) {
    const track = this.getTrackByTrackId(trackId);
    const segment = await track.addSegment(segmentOptions);
    return segment;
  }
  public removeSegment(trackId: UniqueId, segmentId: UniqueId) {
    const track = this.getTrackByTrackId(trackId);
    track.removeSegment(segmentId);
  }
  /* /track manipulation */

  /* audio time, play and sync methods */
  public play() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;

    this.tracks.forEach((track) => track.segments.forEach((segment) => segment.updateSheduling()));
    this.transport.start();
  }
  public pause() {
    if (!this.isPlaying) {
      return;
    }
    this.isPlaying = false;
    const currentTransportPosition = this.transport.seconds;
    this.transport.stop();
    setTransportPositionQuantized(currentTransportPosition, this.transport);
    this.tracks.forEach((track) => track.segments.forEach((segment) => segment.pause()));
  }
  protected override render(): void {
    const transportTime = this.transport.seconds;
    this.eventEmitter["emit"]("render", { transportTime });
  }
  /**
   * Warning! use this method only for info purposes. Use setTransportPositionQuantized for percision time manipulation
   * @returns seconds
   */
  public getCurrentTime(): number {
    return this.transport.seconds;
  }
  /* /audio time, play and sync methods */

  /* Outside events handlers. synchronization on relative motion handlers */
  public audioCursorUpdatedHandler(currentTime: number) {
    this.transport.pause();
    setTransportPositionQuantized(currentTime);
    this.tracks.forEach((track) => track.segments.forEach((segment) => segment.updateSheduling(true)));
    this.metronome.restartIfStarted();
    if (this.isPlaying) {
      this.transport.start();
    }
  }

  /**
   * @param segmentStartTime seconds
   * */
  public moveSegmentX(trackId: UniqueId, segmentId: UniqueId, segmentStartWithBounds: number) {
    const segment = this.getSegmentByTrackIdSegmentId(trackId, segmentId);
    segment.setStartWithBounds(segmentStartWithBounds);
  }
  public moveSegmentY(trackId: UniqueId, segmentId: UniqueId, destinationTrackId: UniqueId): void {
    const track = this.getTrackByTrackId(trackId);

    const segmentToMove = track.getSegmentBySegmentId(segmentId);
    track.segments.delete(segmentId);

    const destinationTrack = this.getTrackByTrackId(destinationTrackId);
    destinationTrack.addExistingSegment(segmentToMove);
  }
  public trackVolumeChangedHandler(trackId: UniqueId, trackVolume: number) {
    const track = this.getTrackByTrackId(trackId);
    track.setTrackVolume(trackVolume);
  }
  public trackStereoPanoramaChangedHandler(trackId: UniqueId, trackStereoPanorama: number) {
    const track = this.getTrackByTrackId(trackId);
    track.setTrackStereoPanorama(trackStereoPanorama);
  }
  public switchMuteTrack(trackId: UniqueId, isMute: boolean) {
    const track = this.getTrackByTrackId(trackId);
    track.switchMuteTrack(isMute);
  }
  private enableSoloTrack(track: Track) {
    track.enableSoloTrack();
    this.tracks.forEach((otherTrack) => {
      if (otherTrack.id !== track.id) {
        otherTrack.trackMixingTools.trackMuteState.isSolo = false;
        otherTrack.trackMixingTools.trackMuteState.isMutedBySolo = true;
        otherTrack.changeMuteAllTrackSegmentsAccordingToTrackMuteState();
      }
    });
  }
  private disableSoloTrack(track: Track) {
    track.disableSoloTrack();
    this.tracks.forEach((track) => {
      track.trackMixingTools.trackMuteState.isMutedBySolo = false;
      track.changeMuteAllTrackSegmentsAccordingToTrackMuteState();
    });
  }
  public switchSoloTrack(trackId: UniqueId, isSolo: boolean) {
    const track = this.getTrackByTrackId(trackId);
    if (isSolo) {
      this.enableSoloTrack(track);
    } else {
      this.disableSoloTrack(track);
    }
    this.eventEmitter["emit"]("tracks-solo-mute-state-updated");
  }
  public moveEditableBound(trackId: UniqueId, segmentId: UniqueId, boundSide: "left" | "right", boundPosition: number): number {
    const segment = this.getSegmentByTrackIdSegmentId(trackId, segmentId);
    const updatedBoundPosition = segment.moveEditableBound(boundSide, boundPosition);
    return updatedBoundPosition;
  }
  public setRange({ start, end }: { start?: number; end?: number }) {
    if (!this.offlineAudioRecorder) {
      //TODO: make independent
      console.warn(`offlineAudioRecorder is ${this.offlineAudioRecorder}`);
    }
    if (start !== undefined) {
      this.transport.loopStart = start;
      if (this.offlineAudioRecorder) {
        this.offlineAudioRecorder.audioRecordRange.start = start;
      }
    }
    if (end !== undefined) {
      this.transport.loopEnd = end;
      if (this.offlineAudioRecorder) {
        this.offlineAudioRecorder.audioRecordRange.end = end;
      }
    }
  }
  public async saveProjectToFile(): Promise<Blob> {
    const projectZipBlob = await SaveLoadManager.saveTrackEditorToZip(this);
    return projectZipBlob;
  }
  public async loadProjectFromFile(projectBlob: Blob) {
    await SaveLoadManager.loadTrackEditorZipSave(this, projectBlob);
  }
  /* /Outside events handlers. synchronization on relative motion handlers */

  public updateTrackColor(trackId: UniqueId, waveColor: string): void {
    const track = this.getTrackByTrackId(trackId);
    track.trackColor.primary = waveColor;
    track.segments.forEach((segment) => segment.updateWaveColor(waveColor));
  }

  /* instance helpers */
  public getTrackByTrackId(trackId: UniqueId): Track {
    const track = this.tracks.get(trackId);
    if (!track) {
      throw new Error();
    }
    return track;
  }
  public getSegmentByTrackIdSegmentId(trackId: UniqueId, segmentId: UniqueId): Segment {
    const track = this.getTrackByTrackId(trackId);
    const segment = track.getSegmentBySegmentId(segmentId);
    return segment;
  }
  public getSegmentBySegmentId(segmentId: UniqueId): Segment {
    let segment: Segment | undefined;
    for (const track of this.tracks.values()) {
      if (track.segments.has(segmentId)) {
        segment = track.getSegmentBySegmentId(segmentId);
        break;
      }
    }
    if (segment === undefined) {
      throw new Error();
    }
    return segment;
  }
  public getTrackIdBySegmentId(segmentId: UniqueId): UniqueId {
    let trackId;
    for (const track of this.tracks.values()) {
      if (track.segments.has(segmentId)) {
        trackId = track.id;
      }
    }
    if (trackId === undefined) {
      throw new Error();
    }
    return trackId;
  }
  public getTrackBySegmentId(segmentId: UniqueId): Track {
    for (const track of this.tracks.values()) {
      if (track.segments.has(segmentId)) {
        return track;
      }
    }
    throw new Error();
  }
  public getTrackByY(y: number): Track {
    for (const track of this.tracks.values()) {
      if (track.y === y) {
        return track;
      }
    }
    throw new Error();
  }
  public getTrackByYOrNearest(y: number): Track {
    let maxY = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let trackWithMaxY;
    let trackWithMinY;
    for (const track of this.tracks.values()) {
      if (track.y === y) {
        return track;
      }
      if (track.y > maxY) {
        maxY = track.y;
        trackWithMaxY = track;
      }
      if (track.y < minY) {
        minY = track.y;
        trackWithMinY = track;
      }
    }
    if (!trackWithMaxY || !trackWithMinY) {
      throw new Error();
    }
    if (y < minY) {
      return trackWithMinY;
    } else {
      return trackWithMaxY;
    }
  }
  public getSegmentsInTracks(trackIds: Array<UniqueId>): Array<Segment> {
    const tracks = Array.from(this.tracks.values()).filter((track) => trackIds.includes(track.id));
    const segments = tracks.flatMap((track) => Array.from(track.segments.values()));
    return segments;
  }
  /* /instance helpers */
}
