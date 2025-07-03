import * as Tone from "customized-tone";
import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { AbstractWorkletVisualizer } from "./AbstractWorkletVisualizer";
import EventEmitter from "wavesurfer.js/dist/event-emitter";
import VolumeMeterProcessor from "@/audioeditor/audiomodel/audioeditor/common/worklet/VolumeMeterProcessor.worklet";
import { atomicLoadFloat32 } from "../worklet/AtomicsHelper";

type AudioWorkletVolumeMeterEvents = {
  "render-data": [Array<{ allTimePeak: number; currentPeak: number; rmsPower: number }>];
};

export type ChannelSharedDataSab = {
  currentPeakSab: SharedArrayBuffer;
  allTimePeakSab: SharedArrayBuffer;
  rmsPowerSab: SharedArrayBuffer;
};
export type ChannelSharedDataTyped = {
  currentPeak: Float32Array;
  allTimePeak: Float32Array;
  rmsPower: Float32Array;
};

type ChannelSharedData = ChannelSharedDataSab & ChannelSharedDataTyped; //TODO: move to common file for worklet and worklet user classes

export class AudioWorkletVolumeMeter extends AbstractWorkletVisualizer {
  public eventEmitter: EventEmitter<AudioWorkletVolumeMeterEvents>;
  private sharedData: Array<ChannelSharedData> = [];
  private peakTimeToLive: number = AUDIO_EDITOR_CONFIGURATION.tracksEditor.masterMixer.audioWorkletVolumeMeter.functionality.peakTimeToLive; //seconds
  private timeWindowSize: number = AUDIO_EDITOR_CONFIGURATION.tracksEditor.masterMixer.audioWorkletVolumeMeter.functionality.defaultTimeWindowSize; //samples

  constructor(toneAudioContext: Tone.BaseContext, inputNode: AudioNode) {
    super(toneAudioContext, inputNode, "volume-meter-processor", VolumeMeterProcessor as unknown as string); //TODO: may case issues. need to check
    this.eventEmitter = new EventEmitter<AudioWorkletVolumeMeterEvents>();
  }

  private initializeSharedData() {
    if (!this.audioWorkletNode) {
      throw new Error();
    }
    this.sharedData = new Array(this.audioWorkletNode.channelCount);
    for (let i = 0; i < this.sharedData.length; i++) {
      const currentPeakSab = new SharedArrayBuffer(4);
      const currentPeak = new Float32Array(currentPeakSab);

      const allTimePeakSab = new SharedArrayBuffer(4);
      const allTimePeak = new Float32Array(allTimePeakSab);

      const rmsPowerSab = new SharedArrayBuffer(4);
      const rmsPower = new Float32Array(rmsPowerSab);
      this.sharedData[i] = {
        currentPeakSab,
        currentPeak,
        allTimePeakSab,
        allTimePeak,
        rmsPowerSab,
        rmsPower,
      };
    }

    const sharedDataSab: Array<ChannelSharedDataSab> = this.sharedData.map((channel) => {
      return {
        currentPeakSab: channel.currentPeakSab,
        allTimePeakSab: channel.allTimePeakSab,
        rmsPowerSab: channel.rmsPowerSab,
      };
    });
    const payload = {
      sharedData: sharedDataSab,
    };
    this.audioWorkletNode.port.postMessage({ action: "setSharedData", payload });
  }
  private initializeWorkletProperties() {
    if (!this.audioWorkletNode) {
      throw new Error();
    }
    this.audioWorkletNode.port.postMessage({ action: "setPeakTimeToLive", payload: this.peakTimeToLive });
    this.audioWorkletNode.port.postMessage({ action: "setTimeWindowSize", payload: this.timeWindowSize });
  }
  protected override continueInitialization(): void {
    if (!this.audioWorkletNode) {
      throw new Error();
    }
    this.initializeSharedData();
    this.initializeWorkletProperties();
    this.inputNode.connect(this.audioWorkletNode);
  }
  protected override render(): void {
    const renderPayload = this.sharedData.map((channel) => {
      const data = {
        allTimePeak: atomicLoadFloat32(channel.allTimePeak, 0),
        currentPeak: atomicLoadFloat32(channel.currentPeak, 0),
        rmsPower: atomicLoadFloat32(channel.rmsPower, 0),
      };
      return data;
    });
    this.eventEmitter["emit"]("render-data", renderPayload);
  }
  public resetPeaks() {
    if (!this.audioWorkletNode) {
      throw new Error();
    }
    this.audioWorkletNode.port.postMessage({ action: "resetPeaks" });
  }
  public get timeWindowSizeSamples() {
    return this.timeWindowSize;
  }
  public set timeWindowSizeSamples(timeWindowSamples: number) {
    this.timeWindowSize = timeWindowSamples;
    if (!this.audioWorkletNode) {
      throw new Error();
    }
    this.audioWorkletNode.port.postMessage({ action: "setTimeWindowSize", payload: this.timeWindowSize });
  }
  public get timeWindowSizeSeconds() {
    return this.timeWindowSize / this.audioContext.sampleRate;
  }
  public set timeWindowSizeSeconds(timeWindowSeconds: number) {
    const timeWindowSamples = Math.floor(timeWindowSeconds * this.audioContext.sampleRate);
    this.timeWindowSizeSamples = timeWindowSamples;
  }
}
