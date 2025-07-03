import _ from "lodash";
import type { ActionContext } from "vuex";
import { State } from "@/store/store";

import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";

import { getVisualSegmentByTrackIdSegmentId, getVisualTrackByTrackId, getVisualTracksArraySortedByY, parseCommandHistoryToVisualCommandHistory, addListeners } from "./trackEditorFunctions";
import { OfflineAudioRecorderState } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/OfflineAudioRecorder";

import { controllerMutations, controllerActions } from "./trackeditor/controller";
import { presenterMutations, presenterActions } from "./trackeditor/presenter";
import { UniqueId } from "@audioeditor/audiomodel/types";
import { computePowerByLevelSquare, getSoundPowerBySoundLevel } from "@/audioeditor/audiomodel/audioeditor/common/common";
import { AbstractCommand } from "@/audioeditor/controller/commandhistory/commands/AbstractCommand";
import { SegmentOptions } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/track/SegmentFactory";
import { VisualTrackFactory } from "../../../visualmodel/VisualTrackFactory";
import { TrackColor } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/Track";
import navigationModule, { NavigationState } from "./trackeditor/navigation";
import editingToolsModule, { EditingToolsState } from "./trackeditor/editingTools";

export type VisualSegment = {
  id: UniqueId;
  name: string;
  segmentStartTime: number;
  segmentDuration: number;

  color?: string;
  wavesurferContainerRef: HTMLElement | null;

  segmentEditingTools: {
    editableBounds: {
      leftBoundPosition: number;
      rightBoundPosition: number;
    };
  };
};
export type VisualTrackMixingTools = {
  trackVolume: number; //float [0...1]
  trackVolumePower: number; //float [-Infinity...+Infinity]
  trackStereoPanorama: number; //float [-1...1]
  trackMuteState: {
    isMuted: boolean; //is this track muted by "mute" button
    isSolo: boolean; //is chosen as solo track by "solo" button
    isMutedBySolo: boolean; //is this track muted because some other track is soloed
    isMutedEventually: boolean; //is this track muted eventually (by a button, due to another solo track or for some other reason)
  };
  volumeMeter: {
    leftChannel: {
      volume: number; //0..1
      peakVolume: number; //0..1
    };
    rightChannel: {
      volume: number;
      peakVolume: number;
    };
  };
};
export type VisualTrack = {
  id: UniqueId;
  y: number; //trackUnits
  musicianName: string;
  soundSource: string;
  trackColor: TrackColor;
  visualSegments: Map<UniqueId, VisualSegment>;
  visualTrackMixingTools: VisualTrackMixingTools;
};
type VisualTracksModel = {
  /**
   * WARNING: VuexPersistence does not work with Map (even in modules that are not stored via this plugin). It breaks work of AudioEditor module. Be careful! https://github.com/robinvdvleuten/vuex-persistedstate/issues/210
   */
  tracks: Map<UniqueId, VisualTrack>;
};
type Recording = {
  isAudioRecordEnabled: boolean;
  isRecording: boolean;
  recordedFile?: Blob;
};
type OfflineRecording = {
  isRangeSpecifiedByCompositionDuration: boolean;
  audioRecordRange: {
    start: number;
    end: number;
  };
  offlineAudioRecorderState: OfflineAudioRecorderState;
  recordedBlob?: Blob;
};

type AudioWorkletVolumeMeterChannel = {
  allTimePeak: number;
  currentPeak: number;
  rmsPower: number;
};
type MasterMixer = {
  volume: number;
  volumePower: number;

  analyserNodeVolumeMeter: {
    leftChannel: {
      volume: number;
      peakVolume: number;
      allTimePeak: number;
    };
    rightChannel: {
      volume: number;
      peakVolume: number;
      allTimePeak: number;
    };
    timeWindowSizeSamples: number;
    timeWindowSizeSeconds: number;
  };
  audioWorkletVolumeMeter: {
    channels: Array<AudioWorkletVolumeMeterChannel>;
    timeWindowSizeSamples: number;
    timeWindowSizeSeconds: number;
  };
};
type Metronome = {
  isEnabled: boolean;
  emphasizeDownbeat: boolean;
  soundName: string;
  subdivisionName: string;
  volume: number;
};
export type VisualCommandHistory = {
  lastExecutedCommandIndex: number;
  history: Array<{
    name: string;
    verboseDescription: string;
  }>;
};

interface TrackEditorStateOwn {
  visualTracksModel: VisualTracksModel;
  recording: Recording;
  offlineRecording: OfflineRecording;
  selectedTrackId: UniqueId | null;
  masterMixer: MasterMixer;
  metronome: Metronome;
  commandHistory: VisualCommandHistory;
}
export interface TrackEditorState extends TrackEditorStateOwn {
  navigation: NavigationState;
  editingTools: EditingToolsState;
}
export type Context = ActionContext<TrackEditorState, State>;

const initialVisualTracksModel: VisualTracksModel = {
  tracks: new Map<UniqueId, VisualTrack>(),
};
const initialRecording: Recording = {
  isAudioRecordEnabled: false,
  isRecording: false,
};

const initialOfflineRecording: OfflineRecording = {
  isRangeSpecifiedByCompositionDuration: true,
  audioRecordRange: {
    start: 0,
    end: 0,
  },
  offlineAudioRecorderState: OfflineAudioRecorderState.IDLE,
};

const initialMixer: MasterMixer = {
  volume: 0,
  volumePower: 0,
  analyserNodeVolumeMeter: {
    leftChannel: {
      volume: 0,
      peakVolume: 0,
      allTimePeak: 0,
    },
    rightChannel: {
      volume: 0,
      peakVolume: 0,
      allTimePeak: 0,
    },
    timeWindowSizeSamples: 0,
    timeWindowSizeSeconds: 0,
  },
  audioWorkletVolumeMeter: {
    channels: [],
    timeWindowSizeSamples: 0,
    timeWindowSizeSeconds: 0,
  },
};
const initialMetronome: Metronome = {
  isEnabled: false,
  emphasizeDownbeat: false,
  soundName: "",
  subdivisionName: "",
  volume: 0,
};
const initialCommandHistory: VisualCommandHistory = {
  lastExecutedCommandIndex: -1,
  history: [],
};
function getInitialState(): TrackEditorState {
  const state: TrackEditorStateOwn = {
    visualTracksModel: _.cloneDeep(initialVisualTracksModel),
    recording: _.cloneDeep(initialRecording),
    offlineRecording: _.cloneDeep(initialOfflineRecording),
    selectedTrackId: null,
    masterMixer: _.cloneDeep(initialMixer),
    metronome: _.cloneDeep(initialMetronome),
    commandHistory: _.cloneDeep(initialCommandHistory),
  };
  return state as TrackEditorState;
}
const initialTrackEditorModules = {
  navigation: navigationModule,
  editingTools: editingToolsModule,
};

const trackEditorSubModule = {
  namespaced: true as boolean,
  state: (): TrackEditorState => getInitialState(),
  modules: _.cloneDeep(initialTrackEditorModules),
  getters: {
    visualTracksSortedByY(state: TrackEditorState) {
      return getVisualTracksArraySortedByY(state.visualTracksModel.tracks);
    },
    visualSegments(state: TrackEditorState) {
      const result = Array.from(state.visualTracksModel.tracks.values())
        .flatMap((track) => Array.from(track.visualSegments.values()).map((segment) => ({ track, segment })))
        .sort((a, b) => (a.segment.id > b.segment.id ? 1 : -1));
      return result;
    },
  },
  mutations: {
    ...controllerMutations,
    ...presenterMutations,

    /**
     * Below are mutations which user or model should not call directly
     */
    /* initialization */
    initializeTrackEditor(state: TrackEditorState) {
      const audioEditor = AudioEditor.getInstance();
      state.offlineRecording.audioRecordRange.start = audioEditor.offlineAudioRecorder.audioRecordRange.start;
      state.offlineRecording.audioRecordRange.end = audioEditor.offlineAudioRecorder.audioRecordRange.end;

      state.masterMixer.volume = audioEditor.trackEditor.masterMixer.volume;
      state.masterMixer.volumePower = computePowerByLevelSquare(audioEditor.trackEditor.masterMixer.volume);
      state.masterMixer.analyserNodeVolumeMeter.timeWindowSizeSamples = audioEditor.trackEditor.masterMixer.analyserNodeVolumeMeter.timeWindowSizeSamples;
      state.masterMixer.analyserNodeVolumeMeter.timeWindowSizeSeconds = audioEditor.trackEditor.masterMixer.analyserNodeVolumeMeter.timeWindowSizeSeconds;

      state.masterMixer.audioWorkletVolumeMeter.timeWindowSizeSamples = audioEditor.trackEditor.masterMixer.audioWorkletVolumeMeter.timeWindowSizeSamples;
      state.masterMixer.audioWorkletVolumeMeter.timeWindowSizeSeconds = audioEditor.trackEditor.masterMixer.audioWorkletVolumeMeter.timeWindowSizeSeconds;

      state.metronome.isEnabled = audioEditor.trackEditor.metronome.isStarted;
      state.metronome.emphasizeDownbeat = audioEditor.trackEditor.metronome.emphasizeDownbeat;
      state.metronome.soundName = audioEditor.trackEditor.metronome.getCurrentSound().name;
      state.metronome.subdivisionName = audioEditor.trackEditor.metronome.subdivision.name;
      state.metronome.volume = audioEditor.trackEditor.metronome.volume;

      state.commandHistory.history = audioEditor.commandHistory.history.map((command) => ({ name: command.name, verboseDescription: command.verboseDescription }));
    },
    resetState(state: TrackEditorState) {
      Object.assign(state, getInitialState());
    },
    /* /initialization */

    /* track manipulation */
    setSelectedVisualTrack(state: TrackEditorState, { trackId }: { trackId: UniqueId }) {
      state.selectedTrackId = trackId;
    },
    addVisualTrack(state: TrackEditorState, visualTrack: VisualTrack) {
      state.visualTracksModel.tracks.set(visualTrack.id, visualTrack);
    },
    addSegmentToVisualTrack(state: TrackEditorState, { trackId, visualSegment }: { trackId: UniqueId; visualSegment: VisualSegment }) {
      const track = getVisualTrackByTrackId(state, trackId);
      track.visualSegments.set(visualSegment.id, visualSegment);
    },
    removeVisualTrack(state: TrackEditorState, { trackId }: { trackId: UniqueId }) {
      const tracks = state.visualTracksModel.tracks;
      tracks.delete(trackId);
    },
    removeVisualSegment(state: TrackEditorState, { trackId, segmentId }: { trackId: UniqueId; segmentId: UniqueId }) {
      const track = getVisualTrackByTrackId(state, trackId);
      track.visualSegments.delete(segmentId);
    },
    moveVisualSegment(state: TrackEditorState, { trackId, destinationTrackId, segmentId }: { trackId: UniqueId; destinationTrackId: UniqueId; segmentId: UniqueId }) {
      // const track = getVisualTrackByTrackId(state, trackId);
      const visualSegment = getVisualSegmentByTrackIdSegmentId(state, trackId, segmentId);
      const track = getVisualTrackByTrackId(state, trackId);
      track.visualSegments.delete(segmentId);
      const destinationTrack = getVisualTrackByTrackId(state, destinationTrackId);
      destinationTrack.visualSegments.set(segmentId, visualSegment);
    },
    setTrackColor(state: TrackEditorState, { trackId, primaryColor }: { trackId: UniqueId; primaryColor: string }) {
      const track = getVisualTrackByTrackId(state, trackId);
      track.trackColor.primary = primaryColor;
    },
    updateTrackY(state: TrackEditorState, { trackId, y }: { trackId: UniqueId; y: number }) {
      const visualTrack = getVisualTrackByTrackId(state, trackId);
      visualTrack.y = y;
    },
    /* /track manipulation */

    /* track mixing tools */
    setTrackSoundSourceName(state: TrackEditorState, { trackId, soundSource }: { trackId: UniqueId; soundSource: string }) {
      const visualTrack = getVisualTrackByTrackId(state, trackId);
      visualTrack.soundSource = soundSource;
    },
    setTrackMusicianName(state: TrackEditorState, { trackId, musicianName }: { trackId: UniqueId; musicianName: string }) {
      const visualTrack = getVisualTrackByTrackId(state, trackId);
      visualTrack.musicianName = musicianName;
    },
    setTrackVolume(state: TrackEditorState, { trackId, trackVolume }: { trackId: UniqueId; trackVolume: number }) {
      const track = getVisualTrackByTrackId(state, trackId);
      track.visualTrackMixingTools.trackVolume = trackVolume;
      track.visualTrackMixingTools.trackVolumePower = getSoundPowerBySoundLevel(trackVolume);
    },
    setTrackPanorama(state: TrackEditorState, { trackId, trackStereoPanorama }: { trackId: UniqueId; trackStereoPanorama: number }) {
      const track = getVisualTrackByTrackId(state, trackId);
      track.visualTrackMixingTools.trackStereoPanorama = trackStereoPanorama;
    },
    /**
     * Mute or unmute the track with id === trackId
     * @param param1
     */
    setTrackMute(state: TrackEditorState, { trackId, isMuted }: { trackId: UniqueId; isMuted: boolean }) {
      const visualTrack = getVisualTrackByTrackId(state, trackId);
      visualTrack.visualTrackMixingTools.trackMuteState.isMuted = isMuted;
    },
    /* /track mixing tools */

    /* segment editing tools */
    moveSegmentX(state: TrackEditorState, { trackId, segmentId, segmentStartWithBounds }: { trackId: UniqueId; segmentId: UniqueId; segmentStartWithBounds: number }) {
      const visualSegment = getVisualSegmentByTrackIdSegmentId(state, trackId, segmentId);
      visualSegment.segmentStartTime = segmentStartWithBounds - visualSegment.segmentEditingTools.editableBounds.leftBoundPosition;
    },
    setSegmentName(state: TrackEditorState, { trackId, segmentId, name }: { trackId: UniqueId; segmentId: UniqueId; name: string }) {
      const visualSegment = getVisualSegmentByTrackIdSegmentId(state, trackId, segmentId);
      visualSegment.name = name;
    },
    moveEditableBound(
      state: TrackEditorState,
      {
        trackId,
        segmentId,
        boundSide,
        boundPosition,
      }: {
        trackId: UniqueId;
        segmentId: UniqueId;
        boundSide: "left" | "right";
        boundPosition: number;
      }
    ) {
      const visualSegment = getVisualSegmentByTrackIdSegmentId(state, trackId, segmentId);
      if (boundSide === "left") {
        visualSegment.segmentEditingTools.editableBounds.leftBoundPosition = boundPosition;
      } else if (boundSide === "right") {
        visualSegment.segmentEditingTools.editableBounds.rightBoundPosition = boundPosition;
      } else {
        throw new Error();
      }
    },
    /* /segment editing tools */

    /* audioRecorder */
    setIsAudioRecordEnabled(state: TrackEditorState, isAudioRecordEnabled: boolean) {
      state.recording.isAudioRecordEnabled = isAudioRecordEnabled;
    },
    setRecordingIsRecording(state: TrackEditorState, isRecording: boolean) {
      state.recording.isRecording = isRecording;
    },
    /* /audioRecorder */

    /* offlineAudioRecorder */
    setAudioRecordRange(state: TrackEditorState, { start, end }: { start: number; end: number }) {
      state.offlineRecording.audioRecordRange.start = start;
      state.offlineRecording.audioRecordRange.end = end;
    },
    setIsRangeByCompositionDuration(state: TrackEditorState, isRangeByCompositionDuration: boolean) {
      state.offlineRecording.isRangeSpecifiedByCompositionDuration = isRangeByCompositionDuration;
    },
    setOfflineRecordedBlob(state: TrackEditorState, recordedBlob: Blob) {
      state.offlineRecording.recordedBlob = recordedBlob;
    },
    /* /offlineAudioRecorder */

    /* master mixer */
    setMasterMixerVolume(state: TrackEditorState, volume: number) {
      state.masterMixer.volume = volume;
      state.masterMixer.volumePower = getSoundPowerBySoundLevel(state.masterMixer.volume);
    },
    masterMixerAnalyserNodeVolumeMeterSetTimeWindowSizeSamples(state: TrackEditorState, { timeWindowSizeSamples, timeWindowSizeSeconds }: { timeWindowSizeSamples: number; timeWindowSizeSeconds: number }) {
      state.masterMixer.analyserNodeVolumeMeter.timeWindowSizeSamples = timeWindowSizeSamples;
      state.masterMixer.analyserNodeVolumeMeter.timeWindowSizeSeconds = timeWindowSizeSeconds;
    },
    masterMixerAudioWorkletVolumeMeterSetParameters(state: TrackEditorState, { timeWindowSizeSamples, timeWindowSizeSeconds }: { timeWindowSizeSamples: number; timeWindowSizeSeconds: number }) {
      state.masterMixer.audioWorkletVolumeMeter.timeWindowSizeSamples = timeWindowSizeSamples;
      state.masterMixer.audioWorkletVolumeMeter.timeWindowSizeSeconds = timeWindowSizeSeconds;
    },
    /* /master mixer */

    /* metronome */
    setMetronome(state: TrackEditorState, metronome: Metronome) {
      state.metronome.isEnabled = metronome.isEnabled;
    },
    setMetronomeVolume(state: TrackEditorState, volume: number) {
      state.metronome.volume = volume;
    },
    setEmphasizeDownbeat(state: TrackEditorState, emphasizeDownbeat: boolean) {
      state.metronome.emphasizeDownbeat = emphasizeDownbeat;
    },
    setMetronomeSound(state: TrackEditorState, { soundName }: { soundName: string }) {
      state.metronome.soundName = soundName;
    },
    setMetronomeSubdivision(state: TrackEditorState, { subdivisionName }: { subdivisionName: string }) {
      state.metronome.subdivisionName = subdivisionName;
    },
    /* /metronome */

    /* command history */
    setVisualCommandHistory(state: TrackEditorState, { lastExecutedCommandIndex, history }: { lastExecutedCommandIndex: number; history: Array<{ name: string; verboseDescription: string }> }) {
      state.commandHistory.lastExecutedCommandIndex = lastExecutedCommandIndex;
      state.commandHistory.history = history;
    },
    /* /command history */
  },
  actions: {
    ...controllerActions,
    ...presenterActions,
    /**
     * Below are actions which user or model should not call directly
     */
    /* initialization and destruction */
    async initializeTrackEditor(context: Context) {
      const audioEditor = AudioEditor.getInstance();
      addListeners(context, audioEditor);
      context.commit("offlineAudioRecorderStateChangedHandler", audioEditor.offlineAudioRecorder.offlineRecorderState);
      context.commit("initializeTrackEditor");
      context.dispatch("navigation/initializeNavigation");
    },
    resetModule(context: Context) {
      context.commit("resetState");
      context.dispatch("navigation/resetModule");
    },
    /* /initialization and destruction */

    /**
     * Add command to history. Should be called by controllers
     * @param context
     * @param command
     */
    addCommandToCommandHistory(context: Context, command: AbstractCommand) {
      const audioEditor = AudioEditor.getInstance();
      audioEditor.commandHistory.addCommand(command);
      context.commit("setVisualCommandHistory", parseCommandHistoryToVisualCommandHistory(audioEditor.commandHistory));
    },
    async addSegmentToExistingTrack(context: Context, { segment, trackId }: { segment: SegmentOptions; trackId: UniqueId }) {
      const audioEditor = AudioEditor.getInstance();
      const segmentToPush = await audioEditor.trackEditor.addSegmentToExistingTrack(segment, trackId);

      const visualSegmentToPush: VisualSegment = VisualTrackFactory.parseVisualSegmentFromSegment(segmentToPush);

      context.commit("addSegmentToVisualTrack", {
        trackId: trackId,
        visualSegment: visualSegmentToPush,
      });
      const currentTrack = getVisualTrackByTrackId(context.state, trackId);
      if (!currentTrack) {
        throw new Error("Current track is undefined");
      }
      audioEditor.trackEditor.updateTrackColor(trackId, currentTrack.trackColor.primary);
      return segmentToPush;
    },
    removeSegment(context: Context, { trackId, segmentId }: { trackId: UniqueId; segmentId: UniqueId }) {
      const audioEditor = AudioEditor.getInstance();
      audioEditor.trackEditor.removeSegment(trackId, segmentId);
      context.commit("removeVisualSegment", { trackId, segmentId });
    },
  },
};
export default trackEditorSubModule;
