import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { TrackEditorState } from "../trackEditor";
import { OfflineAudioRecorderState } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/OfflineAudioRecorder";
import { getVisualTrackByTrackId } from "../trackEditorFunctions";
import { UniqueId } from "@/audioeditor/audiomodel/types";

/**
 * Methods placed in this object act as a presenter between AudioEditor (our audio model) and vuex store submodule. In fact, they are handlers for events that the model (AudioEditor) can emit.
 * Do not put here internal functions or mutations or actions of store which AudioEditor model should not call directly.
 */
export const presenterMutations = {
  updateSoloMuteState(state: TrackEditorState) {
    const audioEditor = AudioEditor.getInstance();
    state.visualTracksModel.tracks.forEach((visualTrack) => {
      const track = audioEditor.trackEditor.getTrackByTrackId(visualTrack.id);
      const trackMuteState = track.trackMixingTools.trackMuteState;
      if (!trackMuteState) {
        throw new Error();
      }
      visualTrack.visualTrackMixingTools.trackMuteState = {
        ...trackMuteState,
      };
    });
  },

  /* audioRecorder */
  setRecordedFile(state: TrackEditorState, recordedFile: Blob) {
    state.recording.recordedFile = recordedFile;
  },
  /* /audioRecorder */

  /* offlineAudioRecorder */
  offlineAudioRecorderStateChangedHandler(state: TrackEditorState, offlineAudioRecorderState: OfflineAudioRecorderState) {
    state.offlineRecording.offlineAudioRecorderState = offlineAudioRecorderState;
  },
  /* /offlineAudioRecorder */

  updateTrackVolumeMeter(state: TrackEditorState, { trackId, channel, volume, currentPeakVolume }: { trackId: UniqueId; channel: number; volume: number; currentPeakVolume: number }) {
    const track = getVisualTrackByTrackId(state, trackId);
    switch (channel) {
      case 0: {
        track.visualTrackMixingTools.volumeMeter.leftChannel.volume = volume;
        track.visualTrackMixingTools.volumeMeter.leftChannel.peakVolume = currentPeakVolume;
        break;
      }
      case 1: {
        track.visualTrackMixingTools.volumeMeter.rightChannel.volume = volume;
        track.visualTrackMixingTools.volumeMeter.rightChannel.peakVolume = currentPeakVolume;
        break;
      }
    }
  },

  /* master mixer */
  updateMasterMixerAnalyserNodeVolumeMeter(state: TrackEditorState, { channel, volume, currentPeakVolume, allTimePeak }: { channel: number; volume: number; currentPeakVolume: number; allTimePeak: number }) {
    switch (channel) {
      case 0: {
        state.masterMixer.analyserNodeVolumeMeter.leftChannel.volume = volume;
        state.masterMixer.analyserNodeVolumeMeter.leftChannel.peakVolume = currentPeakVolume;
        state.masterMixer.analyserNodeVolumeMeter.leftChannel.allTimePeak = allTimePeak;
        break;
      }
      case 1: {
        state.masterMixer.analyserNodeVolumeMeter.rightChannel.volume = volume;
        state.masterMixer.analyserNodeVolumeMeter.rightChannel.peakVolume = currentPeakVolume;
        state.masterMixer.analyserNodeVolumeMeter.rightChannel.allTimePeak = allTimePeak;
        break;
      }
    }
  },
  updateMasterMixerAudioWorkletVolumeMeter(state: TrackEditorState, payload: Array<{ allTimePeak: number; currentPeak: number; rmsPower: number }>) {
    state.masterMixer.audioWorkletVolumeMeter.channels = payload.map((channel) => ({
      allTimePeak: channel.allTimePeak,
      currentPeak: channel.currentPeak,
      rmsPower: channel.rmsPower,
    }));
  },
  /* /master mixer */
};
export const presenterActions = {};
