import * as Tone from "customized-tone";
import EventEmitter from "wavesurfer.js/dist/event-emitter";
import JSZip from "jszip";
import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";
import { encodeAudioBufferToWaveFile } from "../../common/audiorecorderutils/encode-audio";
import { TrackEditor } from "../../TrackEditorWithEditingTools";
import { TransportClass } from "customized-tone/build/esm/core/clock/Transport";
import { AnyAudioContext } from "customized-tone/build/esm/core/context/AudioContext";
import { SaveLoadManager, TrackEditorSave } from "./SaveLoadManager";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import { getNameAndExtension } from "../../common/miscellaneous";

const NUMBER_OF_CHANNELS = 2;
const SAMPLE_RATE = 48000;
const DEFAULT_BITS_PER_SAMPLE = 16; //TODO: remake
const DEFAULT_ENCODE_TO_WAVE_OPTIONS = { bitsPerSample: DEFAULT_BITS_PER_SAMPLE };

export enum OfflineAudioRecorderState {
  IDLE = "IDLE",
  RENDERING_IN_PROGRESS = "RENDERING_IN_PROGRESS",
  RENDERING_COMPLETE = "RENDERING_COMPLETE",
  ERROR = "ERROR",
}
type OfflineAudioRecorderEvents = {
  "offline-audio-recorder-state-changed": [{ offlineAudioRecorderState: OfflineAudioRecorderState }];
};

export class OfflineAudioRecorder extends EventEmitter<OfflineAudioRecorderEvents> {
  private toneAudioContext: Tone.BaseContext;
  private transport: TransportClass;
  private audioContext: AnyAudioContext;

  private trackEditor: TrackEditor;
  private _offlineRecorderState: OfflineAudioRecorderState = OfflineAudioRecorderState.IDLE; //In order to control the state from the client code
  get offlineRecorderState() {
    return this._offlineRecorderState;
  }
  public audioRecordRange: { start: number; end: number } = {
    start: AUDIO_EDITOR_CONFIGURATION.offlineAudioRecorder.functionality.audioRecordRange.start,
    end: AUDIO_EDITOR_CONFIGURATION.offlineAudioRecorder.functionality.audioRecordRange.end,
  };
  public isRangeSpecifiedByCompositionDuration = true;

  constructor(toneAudioContext: Tone.BaseContext, trackEditor: TrackEditor) {
    super();
    this.toneAudioContext = toneAudioContext;
    this.transport = this.toneAudioContext.transport;
    this.audioContext = toneAudioContext.rawContext;

    this.trackEditor = trackEditor;

    this.transport.setLoopPoints(this.audioRecordRange.start, this.audioRecordRange.end);
  }
  public setIsRangeSpecifiedByCompositionDuration(isRangeSpecifiedByCompositionDuration: boolean) {
    this.isRangeSpecifiedByCompositionDuration = isRangeSpecifiedByCompositionDuration;
  }

  /* record helpers */
  private getStartTimeAndDurationByComposition() {
    const activeTracks = Array.from(this.trackEditor.tracks.values()).filter((track) => {
      return !(track.trackMixingTools.trackMuteState.isMuted || track.trackMixingTools.trackMuteState.isMutedBySolo) && track.segments.size;
    });
    if (!activeTracks.length) {
      console.error("No tracks for record!");
      return { startTime: 0, duration: 0 };
    }
    const activeTracksSegments = activeTracks.flatMap((track) => {
      return Array.from(track.segments.values());
    });
    const initialMinStartTime = activeTracksSegments[0].startPosition + activeTracksSegments[0].segmentEditingTools.editableBounds.leftBoundPosition;
    const initialMaxEndTime = activeTracksSegments[0].startPosition + activeTracksSegments[0].segmentEditingTools.editableBounds.rightBoundPosition;
    const { minStartTime, maxEndTime } = activeTracksSegments.reduce(
      ({ minStartTime, maxEndTime }, segment) => {
        const currentStartTime = segment.startPosition + segment.segmentEditingTools.editableBounds.leftBoundPosition;
        const currentEndTime = segment.startPosition + segment.segmentEditingTools.editableBounds.rightBoundPosition;
        return {
          minStartTime: Math.min(minStartTime, currentStartTime),
          maxEndTime: Math.max(maxEndTime, currentEndTime),
        };
      },
      { minStartTime: initialMinStartTime, maxEndTime: initialMaxEndTime }
    );
    return { startTime: minStartTime, duration: maxEndTime - minStartTime };
  }
  private getStartTimeAndDurationByRange() {
    let duration = this.audioRecordRange.end - this.audioRecordRange.start;
    if (duration < 0) {
      duration = 0;
    }
    return { startTime: this.audioRecordRange.start, duration: duration };
  }

  private getStartTimeAndDuration() {
    return this.isRangeSpecifiedByCompositionDuration ? this.getStartTimeAndDurationByComposition() : this.getStartTimeAndDurationByRange();
  }
  private async recordNotEmptyComposition(startTime: number, duration: number): Promise<Blob> {
    const save = SaveLoadManager.saveTrackEditorToJson(this.trackEditor);

    const renderedBuffer = await Tone.Offline(
      async (offlineContext: Tone.OfflineContext) => {
        const offlineTrackEditor = await TrackEditor.createInstance(offlineContext, offlineContext.rawContext.destination);
        await SaveLoadManager.loadTrackEditorSave(offlineTrackEditor, save);
        offlineTrackEditor.audioCursorUpdatedHandler(startTime);
        offlineTrackEditor.play();
      },
      duration,
      NUMBER_OF_CHANNELS,
      SAMPLE_RATE
    );

    const blob = encodeAudioBufferToWaveFile(renderedBuffer, DEFAULT_ENCODE_TO_WAVE_OPTIONS);
    return blob;
  }
  private recordEmptyComposition(): Blob {
    const blob = encodeAudioBufferToWaveFile(new AudioBuffer({ length: 1, sampleRate: SAMPLE_RATE }), DEFAULT_ENCODE_TO_WAVE_OPTIONS); //TODO: make the length 0. 46 bytes file confusing us.
    return blob;
  }
  /* /record helpers */

  /* state */
  private setOfflineAudioRecorderStateAndEmit(stateToSet: OfflineAudioRecorderState) {
    this._offlineRecorderState = stateToSet;
    this.emit("offline-audio-recorder-state-changed", {
      offlineAudioRecorderState: stateToSet,
    });
  }
  private async recordWithErrorHandling<T extends (...args: any) => any>(callback: T): Promise<Awaited<ReturnType<T>>> {
    let result;
    this.setOfflineAudioRecorderStateAndEmit(OfflineAudioRecorderState.RENDERING_IN_PROGRESS);
    try {
      result = await callback();
      this.setOfflineAudioRecorderStateAndEmit(OfflineAudioRecorderState.RENDERING_COMPLETE);
    } catch (error) {
      console.error(error);
      this.setOfflineAudioRecorderStateAndEmit(OfflineAudioRecorderState.ERROR);
    }
    return result;
  }
  /* /state */

  public async recordMixdown(): Promise<Blob> {
    const result = await this.recordWithErrorHandling(async () => {
      let result;
      const { startTime, duration } = this.getStartTimeAndDuration();
      if (duration) {
        result = await this.recordNotEmptyComposition(startTime, duration);
      } else {
        result = this.recordEmptyComposition(); //TODO: think about another approach
      }
      return result;
    });
    return result;
  }

  /* recordTracks heplers*/
  private async recordTrack(trackEditorSave: TrackEditorSave, startTime: number, duration: number, trackId: UniqueId) {
    const trackRecordToneAudioBuffer = await Tone.Offline(
      async (offlineContext: Tone.OfflineContext) => {
        const offlineTrackEditor = await TrackEditor.createInstance(offlineContext, offlineContext.rawContext.destination); //TODO: create instance once for all tracks
        await SaveLoadManager.loadTrackEditorSave(offlineTrackEditor, trackEditorSave);

        offlineTrackEditor.switchSoloTrack(trackId, true);

        offlineTrackEditor.audioCursorUpdatedHandler(startTime);
        offlineTrackEditor.play();
      },
      duration,
      NUMBER_OF_CHANNELS,
      SAMPLE_RATE
    );

    const blob = encodeAudioBufferToWaveFile(trackRecordToneAudioBuffer, DEFAULT_ENCODE_TO_WAVE_OPTIONS);
    return blob;
  }
  private async recordNotEmptyTracks(startTime: number, duration: number): Promise<Blob> {
    const jsZip = new JSZip();

    const save = SaveLoadManager.saveTrackEditorToJson(this.trackEditor);

    const files = [];
    for (const track of this.trackEditor.tracks.values()) {
      const trackRecordWaveBlob = await this.recordTrack(save, startTime, duration, track.id);
      files.push(trackRecordWaveBlob);
      const [name, extension] = getNameAndExtension(track.musicianName);
      jsZip.file(`${name}.wav`, trackRecordWaveBlob);
    }

    const zipResult = await jsZip.generateAsync({ type: "blob" });
    // downloadFile(zipResult, "individual_tracks.zip");

    // result = new Blob(); //TODO:
    return zipResult;
  }
  /* /recordTracks heplers*/

  /**
   * Records individual tracks
   * @returns
   */
  public async recordTracks(): Promise<Blob> {
    const result = await this.recordWithErrorHandling(async () => {
      let result;
      const { startTime, duration } = this.getStartTimeAndDuration();
      if (duration) {
        result = await this.recordNotEmptyTracks(startTime, duration);
      } else {
        result = this.recordEmptyComposition(); //TODO: think about another approach
      }
      return result;
    });
    return result;
  }
}
