import * as Tone from "customized-tone";
import { AnalyserNodeVolumeMeter } from "../../common/volumemeters/AnalyserNodeVolumeMeter";
import { AudioWorkletVolumeMeter } from "../../common/volumemeters/AudioWorkletVolumeMeter";
import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";

import { AUDIO_NODE_VALUE_CHANGE_TIME } from "@audioeditor/data/constants";

export class MasterMixer {
  private toneAudioContext: Tone.BaseContext;
  private inputNode: GainNode;

  private _volume: number;

  public get volume() {
    // return this.inputNode.gain.value;
    return this._volume;
  }
  public setVolume(volume: number, isSharp?: boolean) {
    this._volume = volume;
    if (isSharp) {
      this.inputNode.gain.value = volume;
    } else {
      this.inputNode.gain.linearRampToValueAtTime(volume, this.toneAudioContext.rawContext.currentTime + AUDIO_NODE_VALUE_CHANGE_TIME);
    }
  }
  public analyserNodeVolumeMeter: AnalyserNodeVolumeMeter;
  public audioWorkletVolumeMeter: AudioWorkletVolumeMeter;

  constructor(toneAudioContext: Tone.BaseContext, inputNode: GainNode) {
    this.toneAudioContext = toneAudioContext;
    this.inputNode = inputNode;
    this._volume = inputNode.gain.value;

    this.analyserNodeVolumeMeter = new AnalyserNodeVolumeMeter(this.toneAudioContext, inputNode, { peakTimeToLive: AUDIO_EDITOR_CONFIGURATION.tracksEditor.masterMixer.analyserNodeVolumeMeter.functionality.peakTimeToLive, channelCount: AUDIO_EDITOR_CONFIGURATION.tracksEditor.masterMixer.analyserNodeVolumeMeter.functionality.channelCount });
    this.analyserNodeVolumeMeter.run();

    this.audioWorkletVolumeMeter = new AudioWorkletVolumeMeter(this.toneAudioContext, inputNode);
    this.audioWorkletVolumeMeter.run();
  }
}
