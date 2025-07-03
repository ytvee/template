import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { parseCommandHistoryToVisualCommandHistory } from "../trackEditorFunctions";

import { Context } from "../trackEditor";
import { SegmentOptions } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/track/SegmentFactory";
import { UniqueId } from "@audioeditor/audiomodel/types";
import { TrackOptions } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/TrackFactory";
import { Controller, ControllerOptions } from "../../../../controller/Controller";

import { LoadPlugin } from "@/plugins/load/LoadPlugin";
import { downloadFile } from "@/audioeditor/audiomodel/audioeditor/common/miscellaneous";
import { AUDIO_EDITOR_BASE_MODULE } from "@/audioeditor/data/store/storeModules";
import { SAVE_FILE_PROJECT_NAME } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/SaveLoadManager";
import { MoveSegmentStartMemento } from "@/audioeditor/audiomodel/audioeditor/TrackEditorWithEditingTools";
import { Point } from "@/audioeditor/visualmodel/types";

/**
 * Methods placed in this object act as a controller between user and AudioEditor (our audio model). The user should be able to call them directly. The scheme is: user -> controller action or mutation -> AudioEditor (or subobjects) send event -> presenter actions or mutataions update reactive state
 * Do not put here internal functions or mutations or actions of store which user should not call directly.
 */
export const controllerMutations = {};

export const controllerActions = {
  /* track manipulation */
  setSelectedTrack(context: Context, trackId: UniqueId | null) {
    const audioEditor = AudioEditor.getInstance();
    if (trackId === audioEditor.trackEditor.selectedTrackId) {
      return;
    }
    Controller.syncHandleCommand(context, { commandName: "SelectTrack", unCompletedCommandArgs: [trackId] });
  },
  async addTracks(context: Context, { commandArgs: { tracks, directionToPush }, controllerOptions }: { commandArgs: { tracks: Array<TrackOptions>; directionToPush?: "top" | "bottom" }; controllerOptions?: ControllerOptions }) {
    await Controller.handleCommand(context, { commandName: "AddTracks", unCompletedCommandArgs: [tracks, directionToPush], controllerOptions });
  },
  async addSegmentsToExistingTrack(
    context: Context,
    {
      commandArgs: { trackId, segments, placeToTrackEnd },
      controllerOptions,
    }: {
      commandArgs: {
        trackId: UniqueId;
        segments: Array<SegmentOptions>;
        placeToTrackEnd: boolean;
      };
      controllerOptions?: ControllerOptions;
    }
  ) {
    await Controller.handleCommand(context, { commandName: "AddSegments", unCompletedCommandArgs: [trackId, segments, placeToTrackEnd], controllerOptions });
  },

  removeTracks(context: Context, { commandArgs: { trackIds }, controllerOptions }: { commandArgs: { trackIds: Array<UniqueId> }; controllerOptions?: ControllerOptions }) {
    Controller.syncHandleCommand(context, { commandName: "RemoveTracks", unCompletedCommandArgs: [trackIds], controllerOptions });
  },
  async removeSegments(context: Context, { commandArgs: { trackId, segmentIds }, controllerOptions }: { commandArgs: { trackId: UniqueId; segmentIds: Array<UniqueId> }; controllerOptions?: ControllerOptions }) {
    await Controller.handleCommand(context, { commandName: "RemoveSegments", unCompletedCommandArgs: [trackId, segmentIds], controllerOptions });
  },
  setTrackColor(context: Context, { commandArgs: { trackId, primaryColor, oldPrimaryColor }, controllerOptions }: { commandArgs: { trackId: UniqueId; primaryColor: string; oldPrimaryColor?: string }; controllerOptions?: ControllerOptions }) {
    Controller.syncHandleCommand(context, { commandName: "SetTrackColor", unCompletedCommandArgs: [trackId, primaryColor, oldPrimaryColor], controllerOptions });
  },
  /* /track manipulation */

  /* track editing */
  async moveSegment(context: Context, { commandArgs: { segmentId, moveSegmentStartMemento, movement }, controllerOptions }: { commandArgs: { segmentId: UniqueId; moveSegmentStartMemento: MoveSegmentStartMemento; movement: Point }; controllerOptions?: ControllerOptions }) {
    await Controller.handleCommand(context, { commandName: "MoveSegment", unCompletedCommandArgs: [segmentId, moveSegmentStartMemento, movement], controllerOptions });
  },
  setSegmentName(context: Context, { commandArgs: { trackId, segmentId, name, oldName }, controllerOptions }: { commandArgs: { trackId: UniqueId; segmentId: UniqueId; name: string; oldName?: string }; controllerOptions?: ControllerOptions }) {
    if (name === oldName) {
      //TODO: move to component
      return;
    }
    Controller.syncHandleCommand(context, { commandName: "SetSegmentName", unCompletedCommandArgs: [trackId, segmentId, name, oldName], controllerOptions });
  },
  /* /track editing */

  /* segment editing tools */
  moveEditableBound(
    context: Context,
    {
      commandArgs: { trackId, segmentId, boundSide, boundPosition, oldBoundPosition },
      controllerOptions,
    }: {
      commandArgs: {
        trackId: UniqueId;
        segmentId: UniqueId;
        boundSide: "left" | "right";
        boundPosition: number;
        oldBoundPosition?: number;
      };
      controllerOptions?: ControllerOptions;
    }
  ) {
    Controller.syncHandleCommand(context, { commandName: "MoveEditableSegmentBound", unCompletedCommandArgs: [trackId, segmentId, boundSide, boundPosition, oldBoundPosition], controllerOptions });
  },
  /* /segment editing tools */

  /* track mixing tools */
  setTrackSoundSourceName(context: Context, { commandArgs: { trackId, soundSource, oldSoundSource }, controllerOptions }: { commandArgs: { trackId: UniqueId; soundSource: string; oldSoundSource?: string }; controllerOptions?: ControllerOptions }) {
    if (soundSource === oldSoundSource) {
      //TODO: move to component
      return;
    }
    Controller.syncHandleCommand(context, { commandName: "SetTrackSoundSource", unCompletedCommandArgs: [trackId, soundSource, oldSoundSource], controllerOptions });
  },
  setTrackMusicianName(context: Context, { commandArgs: { trackId, musicianName, oldMusicianName }, controllerOptions }: { commandArgs: { trackId: UniqueId; musicianName: string; oldMusicianName?: string }; controllerOptions?: ControllerOptions }) {
    if (musicianName === oldMusicianName) {
      //TODO: move to component
      return;
    }
    Controller.syncHandleCommand(context, { commandName: "SetTrackMusicianName", unCompletedCommandArgs: [trackId, musicianName, oldMusicianName], controllerOptions });
  },
  setTrackVolume(context: Context, { commandArgs: { trackId, volume, oldVolume }, controllerOptions }: { commandArgs: { trackId: UniqueId; volume: number; oldVolume?: number }; controllerOptions?: ControllerOptions }) {
    Controller.syncHandleCommand(context, { commandName: "SetTrackVolume", unCompletedCommandArgs: [trackId, volume, oldVolume], controllerOptions });
  },
  setTrackPanorama(context: Context, { commandArgs: { trackId, trackStereoPanorama, oldTrackStereoPanorama }, controllerOptions }: { commandArgs: { trackId: UniqueId; trackStereoPanorama: number; oldTrackStereoPanorama?: number }; controllerOptions?: ControllerOptions }) {
    Controller.syncHandleCommand(context, { commandName: "SetTrackPanorama", unCompletedCommandArgs: [trackId, trackStereoPanorama, oldTrackStereoPanorama], controllerOptions });
  },
  muteTrack(context: Context, { trackId }: { trackId: UniqueId }) {
    const audioEditor = AudioEditor.getInstance();
    const oldIsMuted = audioEditor.trackEditor.getTrackByTrackId(trackId).trackMixingTools.trackMuteState.isMuted;
    Controller.syncHandleCommand(context, { commandName: "SetTrackMute", unCompletedCommandArgs: [trackId, !oldIsMuted] });
  },
  soloTrack(context: Context, { trackId }: { trackId: UniqueId }) {
    Controller.syncHandleCommand(context, { commandName: "SetTrackSolo", unCompletedCommandArgs: [trackId] });
  },
  /* /track mixing tools */

  /* record with AudioContext */
  async switchAudioRecord(context: Context) {
    const audioEditor = AudioEditor.getInstance();
    await audioEditor.switchAudioRecord();
    context.commit("setIsAudioRecordEnabled", audioEditor.isAudioRecorderEnabled);
  },
  resetRecordWithAudioContext() {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.audioRecorder.resetRecord();
  },
  startRecordWithAudioContext(context: Context) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.audioRecorder.startRecord();
    context.commit("setRecordingIsRecording", audioEditor.isRecording);
  },
  pauseRecordWithAudioContext(context: Context) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.audioRecorder.pauseRecord();
    context.commit("setRecordingIsRecording", audioEditor.isRecording);
  },
  /* /record with AudioContext */

  /* record with OfflineAudioContext */
  setAudioRecordRangeStart(context: Context, start: number) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.trackEditor.setRange({ start });
    context.commit("setAudioRecordRange", { start: audioEditor.offlineAudioRecorder.audioRecordRange.start, end: audioEditor.offlineAudioRecorder.audioRecordRange.end });
  },
  setAudioRecordRangeEnd(context: Context, end: number) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.trackEditor.setRange({ end });
    context.commit("setAudioRecordRange", { start: audioEditor.offlineAudioRecorder.audioRecordRange.start, end: audioEditor.offlineAudioRecorder.audioRecordRange.end });
  },
  setIsRangeByCompositionDuration(context: Context, isRangeByCompositionDuration: boolean) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.offlineAudioRecorder.setIsRangeSpecifiedByCompositionDuration(isRangeByCompositionDuration);
    context.commit("setIsRangeByCompositionDuration", audioEditor.offlineAudioRecorder.isRangeSpecifiedByCompositionDuration);
  },
  async startMixdownRecordWithOfflineAudioContext(context: Context) {
    await LoadPlugin.load(async () => {
      const audioEditor = AudioEditor.getInstance();
      const mixdownBlob = await audioEditor.offlineAudioRecorder.recordMixdown();
      context.commit("setOfflineRecordedBlob", mixdownBlob);
    });
  },
  async startTracksRecordWithOfflineAudioContext(context: Context) {
    await LoadPlugin.load(async () => {
      const audioEditor = AudioEditor.getInstance();
      const tracksBlob = await audioEditor.offlineAudioRecorder.recordTracks();
      context.commit("setOfflineRecordedBlob", tracksBlob);
    });
  },
  /* /record with OfflineAudioContext */

  /* save load project */

  async saveProjectToFile() {
    const audioEditor = AudioEditor.getInstance();
    const projectBlob = await audioEditor.trackEditor.saveProjectToFile();
    downloadFile(projectBlob, SAVE_FILE_PROJECT_NAME);
  },
  async loadProjectFromFile(context: Context, blob: Blob) {
    await context.dispatch(AUDIO_EDITOR_BASE_MODULE + "/" + "newProject");
    const audioEditor = AudioEditor.getInstance();
    await audioEditor.trackEditor.loadProjectFromFile(blob);
  },
  /* /save load project */

  /* master mixer */
  setMasterMixerVolume(context: Context, { commandArgs: { volume, oldVolume }, controllerOptions }: { commandArgs: { volume: number; oldVolume?: number }; controllerOptions?: ControllerOptions }) {
    Controller.syncHandleCommand(context, { commandName: "SetMasterMixerVolume", unCompletedCommandArgs: [volume, oldVolume], controllerOptions });
  },
  masterMixerAnalyserNodeVolumeMeterResetPeaks() {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.trackEditor.masterMixer.analyserNodeVolumeMeter.resetPeakValues();
  },
  masterMixerAnalyserNodeVolumeMeterSetTimeWindowSizeSamples(context: Context, sampleSize: string) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.trackEditor.masterMixer.analyserNodeVolumeMeter.setAnalysersSampleSize(sampleSize);
    context.commit("masterMixerAnalyserNodeVolumeMeterSetTimeWindowSizeSamples", { timeWindowSizeSamples: audioEditor.trackEditor.masterMixer.analyserNodeVolumeMeter.timeWindowSizeSamples, timeWindowSizeSeconds: audioEditor.trackEditor.masterMixer.analyserNodeVolumeMeter.timeWindowSizeSeconds });
  },
  masterMixerAudioWorkletVolumeMeterResetPeaks() {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.trackEditor.masterMixer.audioWorkletVolumeMeter.resetPeaks();
  },
  masterMixerAudioWorkletVolumeMeterSetParameters(context: Context, { timeWindowSizeSamples, timeWindowSizeSeconds }: { timeWindowSizeSamples?: number; timeWindowSizeSeconds?: number }) {
    const audioEditor = AudioEditor.getInstance();
    if (timeWindowSizeSamples !== undefined) {
      audioEditor.trackEditor.masterMixer.audioWorkletVolumeMeter.timeWindowSizeSamples = timeWindowSizeSamples;
      context.commit("masterMixerAudioWorkletVolumeMeterSetParameters", { timeWindowSizeSamples, timeWindowSizeSeconds: audioEditor.trackEditor.masterMixer.audioWorkletVolumeMeter.timeWindowSizeSeconds });
      return;
    }
    if (timeWindowSizeSeconds !== undefined) {
      audioEditor.trackEditor.masterMixer.audioWorkletVolumeMeter.timeWindowSizeSeconds = timeWindowSizeSeconds;
      context.commit("masterMixerAudioWorkletVolumeMeterSetParameters", { timeWindowSizeSamples: audioEditor.trackEditor.masterMixer.audioWorkletVolumeMeter.timeWindowSizeSamples, timeWindowSizeSeconds: audioEditor.trackEditor.masterMixer.audioWorkletVolumeMeter.timeWindowSizeSeconds });
      return;
    }
  },
  /* /master mixer */

  /* metronome */
  toggleMetronome(context: Context) {
    Controller.syncHandleCommand(context, { commandName: "ToggleMetronome", unCompletedCommandArgs: [] });
  },
  async setMetronomeSound(context: Context, { soundName }: { soundName: string }) {
    await Controller.handleCommand(context, { commandName: "SetMetronomeSound", unCompletedCommandArgs: [soundName] });
  },
  setMetronomeSubdivision(context: Context, { subdivisionName }: { subdivisionName: string }) {
    Controller.syncHandleCommand(context, { commandName: "SetMetronomeSubdivision", unCompletedCommandArgs: [subdivisionName] });
  },
  setEmphasizeDownbeat(context: Context) {
    const audioEditor = AudioEditor.getInstance();
    const oldIsEmphasizeDownBeat = audioEditor.trackEditor.metronome.emphasizeDownbeat;
    Controller.syncHandleCommand(context, { commandName: "SetMetronomeIsEmphasizeDownBeat", unCompletedCommandArgs: [!oldIsEmphasizeDownBeat] });
  },
  setMetronomeVolume(context: Context, { commandArgs: { volume, oldVolume }, controllerOptions }: { commandArgs: { volume: number; oldVolume?: number }; controllerOptions?: ControllerOptions }) {
    Controller.syncHandleCommand(context, { commandName: "SetMetronomeVolume", unCompletedCommandArgs: [volume, oldVolume], controllerOptions });
  },
  /* /metronome */

  /* command history */
  async undo(context: Context, steps?: number) {
    const audioEditor = AudioEditor.getInstance();
    await audioEditor.commandHistory.undo(steps);
    context.commit("setVisualCommandHistory", parseCommandHistoryToVisualCommandHistory(audioEditor.commandHistory));
  },
  async redo(context: Context, steps?: number) {
    const audioEditor = AudioEditor.getInstance();
    await audioEditor.commandHistory.redo(steps);
    context.commit("setVisualCommandHistory", parseCommandHistoryToVisualCommandHistory(audioEditor.commandHistory));
  },
  async undoAll(context: Context) {
    const audioEditor = AudioEditor.getInstance();
    await audioEditor.commandHistory.undoAll();
    context.commit("setVisualCommandHistory", parseCommandHistoryToVisualCommandHistory(audioEditor.commandHistory));
  },
  async redoAll(context: Context) {
    const audioEditor = AudioEditor.getInstance();
    await audioEditor.commandHistory.redoAll();
    context.commit("setVisualCommandHistory", parseCommandHistoryToVisualCommandHistory(audioEditor.commandHistory));
  },
  setCommandHistoryLength(context: Context, commandHistoryLength: number) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.commandHistory.historyLength = commandHistoryLength;
    context.commit("setVisualCommandHistory", parseCommandHistoryToVisualCommandHistory(audioEditor.commandHistory));
  },
  clearCommandHistory(context: Context) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.commandHistory.clear();
    context.commit("setVisualCommandHistory", parseCommandHistoryToVisualCommandHistory(audioEditor.commandHistory));
  },
  /* /command history */
};
