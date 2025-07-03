import { TrackEditorState, VisualTrack, VisualSegment, VisualCommandHistory, Context } from "./trackEditor";
import { CommandHistory } from "@/audioeditor/controller/commandhistory/CommandHistory";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";

/* mutations */
export function getVisualTrackByTrackId(state: TrackEditorState, visualTrackId: UniqueId): VisualTrack {
  const visualTrack = state.visualTracksModel.tracks.get(visualTrackId);
  if (!visualTrack) {
    throw new Error(visualTrackId);
  }
  return visualTrack;
}
export function getVisualSegmentByTrackIdSegmentId(state: TrackEditorState, visualTrackId: UniqueId, visualSegmentId: UniqueId): VisualSegment {
  const visualTrack = getVisualTrackByTrackId(state, visualTrackId);
  const visualSegment = visualTrack.visualSegments.get(visualSegmentId);
  if (!visualSegment) {
    throw new Error();
  }
  return visualSegment;
}
/* /mutations */

/* actions */
export function parseCommandHistoryToVisualCommandHistory(commandHistory: CommandHistory): VisualCommandHistory {
  return { lastExecutedCommandIndex: commandHistory.lastExecutedCommandIndex, history: commandHistory.history.map((command) => ({ name: command.name, verboseDescription: command.verboseDescription })) };
}
export function addListeners(context: Context, audioEditor: AudioEditor) {
  const trackEditor = audioEditor.trackEditor;
  audioEditor.on("recorded-file-ready", ({ recordedFile }) => {
    context.commit("setRecordedFile", recordedFile);
  });
  audioEditor.offlineAudioRecorder.on("offline-audio-recorder-state-changed", ({ offlineAudioRecorderState }) => {
    context.commit("offlineAudioRecorderStateChangedHandler", offlineAudioRecorderState);
  });

  trackEditor.eventEmitter.on("tracks-solo-mute-state-updated", () => {
    context.commit("updateSoloMuteState");
  });
  trackEditor.masterMixer.analyserNodeVolumeMeter.eventEmitter.on("volume-updated", (payload) => {
    context.commit("updateMasterMixerAnalyserNodeVolumeMeter", payload);
  });
  trackEditor.masterMixer.audioWorkletVolumeMeter.eventEmitter.on("render-data", (payload) => {
    context.commit("updateMasterMixerAudioWorkletVolumeMeter", payload);
  });
  trackEditor.eventEmitter.on("track-y-changed", (payload) => {
    context.commit("updateTrackY", payload);
  });
}
export function removeListeners(context: Context) {}

/* /actions */

/* helpers */
export function getVisualTracksArraySortedByY(visualTracks: Map<UniqueId, VisualTrack>) {
  return Array.from(visualTracks.values()).sort((a, b) => a.y - b.y);
}
/* /helpers */
