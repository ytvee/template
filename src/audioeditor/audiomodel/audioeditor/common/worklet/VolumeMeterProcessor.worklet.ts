/**
 * INFO: This worklet uses SharedArrayBuffer. Do not forget to set { "Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "require-corp" } headers to your web-app!
 */
import { atomicLoadFloat32, atomicStoreFloat32 } from "@/audioeditor/audiomodel/audioeditor/common/worklet/AtomicsHelper";
import { ChannelSharedDataSab, ChannelSharedDataTyped } from "@audioeditor/audiomodel/audioeditor/common/volumemeters/AudioWorkletVolumeMeter";
import { RingBuffer } from "../RingBuffer";
import { computePowerByLevelSquare, millisecondsToSeconds, squareMean } from "../common";
import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { ProcessInput, ProcessOutput } from "./types";

type TimeWindow = {
  oldMeanSquare: number;
  precalculatedSumsRingBuffer: RingBuffer;
};
type ChannelWorkletPrivateData = {
  currentPeakRegistrationTime: number;
  timeWindow?: TimeWindow;
};

const EXPECTED_CHANNEL_COUNT = AUDIO_EDITOR_CONFIGURATION.tracksEditor.masterMixer.audioWorkletVolumeMeter.functionality.expectedChannelCount;
const QUANTUM_SIZE = 128; //TODO: may be chaneged in future. Need to think how to redo.

export default class VolumeMeterProcessor extends AudioWorkletProcessor {
  private sharedData: Array<ChannelSharedDataTyped> = [];
  private privateData: Array<ChannelWorkletPrivateData> = [];
  private peakTimeToLive?: number; //seconds
  private timeWindowSize?: number; //seconds
  private isMultipleInputsWarned = false;

  static get parameterDescriptors() {
    return [
      {
        //0 value will kill the AudioWorkletNode instance. Use it to stop. TODO: set tail-time
        name: "isActive",
        defaultValue: 1,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate", //uses the same initial audio parameter value for the whole block processed; that is, 128 sample frames.
      },
    ];
  }
  constructor() {
    super();
    this.port.onmessage = (event) => {
      const data = event.data;
      switch (data.action) {
        case "setSharedData": {
          this.setSharedDataHandler(data.payload);
          break;
        }
        case "setPeakTimeToLive": {
          this.setPeakTimeToLiveHandler(data.payload);
          break;
        }
        case "setTimeWindowSize": {
          this.setTimeWindowSizeHandler(data.payload);
          break;
        }
        case "resetPeaks": {
          this.resetPeaksHandler();
          break;
        }
        default: {
          throw new Error(`worklet received action which was not recognized! action=${data.action}`);
        }
      }
    };
  }
  private setSharedDataHandler({ sharedData }: { sharedData: Array<ChannelSharedDataSab> }) {
    this.sharedData = sharedData.map((channel) => {
      return {
        currentPeak: new Float32Array(channel.currentPeakSab),
        allTimePeak: new Float32Array(channel.allTimePeakSab),
        rmsPower: new Float32Array(channel.rmsPowerSab),
      };
    });
    this.sharedData.forEach((channel) => {
      atomicStoreFloat32(channel.currentPeak, 0, Number.NEGATIVE_INFINITY);
      atomicStoreFloat32(channel.allTimePeak, 0, Number.NEGATIVE_INFINITY);
      atomicStoreFloat32(channel.rmsPower, 0, Number.NEGATIVE_INFINITY);
    });

    this.privateData = new Array<ChannelWorkletPrivateData>(sharedData.length);
    for (let i = 0; i < this.privateData.length; i++) {
      this.privateData[i] = {
        currentPeakRegistrationTime: 0,
      };
    }
  }
  private setPeakTimeToLiveHandler(peakTimeToLive: number) {
    this.peakTimeToLive = peakTimeToLive;
  }
  /**
   *
   * @param timeWindow samples
   */
  private precalculatedSumsRingBufferLength(timeWindowSize: number) {
    let ringBufferLength = Math.floor(timeWindowSize / QUANTUM_SIZE) * 2;
    if (timeWindowSize % QUANTUM_SIZE) {
      ringBufferLength += 1;
    }
    return ringBufferLength;
  }
  private setTimeWindowSizeHandler(timeWindowSize: number) {
    this.timeWindowSize = timeWindowSize;
    for (let i = 0; i < this.privateData.length; i++) {
      this.privateData[i].timeWindow = {
        oldMeanSquare: 0,
        precalculatedSumsRingBuffer: new RingBuffer(this.precalculatedSumsRingBufferLength(this.timeWindowSize)),
      };
    }
  }
  private resetPeaksHandler() {
    for (let i = 0; i < this.sharedData.length; i++) {
      atomicStoreFloat32(this.sharedData[i].allTimePeak, 0, Number.NEGATIVE_INFINITY);
      atomicStoreFloat32(this.sharedData[i].currentPeak, 0, Number.NEGATIVE_INFINITY);
      this.privateData[i].currentPeakRegistrationTime = 0;
    }
  }

  private isActive(parameters: Record<string, Float32Array>): boolean {
    return Boolean(parameters.isActive[0]);
  }

  private updateSharedData(currentInputChannel: number, rmsPower: number, decibelPeakInQuantum: number) {
    atomicStoreFloat32(this.sharedData[currentInputChannel].rmsPower, 0, rmsPower);

    const oldAllTimePeak = atomicLoadFloat32(this.sharedData[currentInputChannel].allTimePeak, 0);
    const newAllTimePeak = Math.max(oldAllTimePeak, decibelPeakInQuantum);
    atomicStoreFloat32(this.sharedData[currentInputChannel].allTimePeak, 0, newAllTimePeak);

    const oldCurrentPeakRegistrationTime = this.privateData[currentInputChannel].currentPeakRegistrationTime;
    const oldCurrentPeak = atomicLoadFloat32(this.sharedData[currentInputChannel].currentPeak, 0);
    const dateNow = millisecondsToSeconds(Date.now());
    if (this.peakTimeToLive === undefined) {
      throw new Error();
    }
    if (decibelPeakInQuantum > oldCurrentPeak || dateNow - oldCurrentPeakRegistrationTime > this.peakTimeToLive) {
      this.privateData[currentInputChannel].currentPeakRegistrationTime = dateNow;
      atomicStoreFloat32(this.sharedData[currentInputChannel].currentPeak, 0, decibelPeakInQuantum);
    }
  }
  computeTerms(currentChannel: Float32Array): { term1: number; term2: number } {
    if (this.timeWindowSize === undefined) {
      throw new Error();
    }
    const term2Length = this.timeWindowSize % currentChannel.length;
    const term1Length = currentChannel.length - term2Length;

    const term1 = squareMean(currentChannel.slice(0, term1Length), this.timeWindowSize);
    const term2 = squareMean(currentChannel.slice(term1Length), this.timeWindowSize);
    return { term1, term2 };
  }
  private processRmsPowerForSmallWindow(currentChannel: Float32Array): number {
    if (this.timeWindowSize === undefined) {
      throw new Error();
    }
    const meanSquare = squareMean(currentChannel.slice(currentChannel.length - this.timeWindowSize), this.timeWindowSize);
    const rmsPower = computePowerByLevelSquare(meanSquare);
    return rmsPower;
  }
  private processRmsPowerForLargeWindow(currentChannelIndex: number, currentChannel: Float32Array): number {
    const precalculatedSumsRingBuffer = this.privateData[currentChannelIndex].timeWindow?.precalculatedSumsRingBuffer;
    if (!precalculatedSumsRingBuffer) {
      throw new Error();
    }
    const subtrahend1 = precalculatedSumsRingBuffer.getFromStart(0);
    const subtrahend2 = precalculatedSumsRingBuffer.getFromStart(1);

    const { term1, term2 } = this.computeTerms(currentChannel);
    precalculatedSumsRingBuffer.push(term1);
    precalculatedSumsRingBuffer.push(term2);

    const timeWindow = this.privateData[currentChannelIndex].timeWindow;
    if (timeWindow === undefined) {
      throw new Error();
    }
    const meanSquare = timeWindow.oldMeanSquare - subtrahend1 - subtrahend2 + term1 + term2;
    timeWindow.oldMeanSquare = meanSquare;

    const rmsPower = computePowerByLevelSquare(meanSquare);
    return rmsPower;
  }
  private processRmsPower(currentChannelIndex: number, currentChannel: Float32Array): number {
    if (this.timeWindowSize === undefined) {
      throw new Error();
    }
    let rmsPower;
    if (this.timeWindowSize < currentChannel.length) {
      rmsPower = this.processRmsPowerForSmallWindow(currentChannel);
    } else {
      rmsPower = this.processRmsPowerForLargeWindow(currentChannelIndex, currentChannel);
    }
    return rmsPower;
  }
  private processChannel(currentChannelIndex: number, currentChannel: Float32Array) {
    const rmsPower = this.processRmsPower(currentChannelIndex, currentChannel);
    let peakInQuantum: number = Number.NEGATIVE_INFINITY;
    for (let currentSampleIndex = 0; currentSampleIndex < currentChannel.length; currentSampleIndex++) {
      const currentSample = currentChannel[currentSampleIndex];
      const power = currentSample ** 2;

      peakInQuantum = Math.max(peakInQuantum, power);
    }
    const decibelPeakInQuantum = computePowerByLevelSquare(peakInQuantum);
    this.updateSharedData(currentChannelIndex, rmsPower, decibelPeakInQuantum);
  }
  process(inputs: Array<ProcessInput>, outputs: Array<ProcessOutput>, parameters: Record<string, Float32Array>): boolean {
    if (!this.isActive(parameters)) {
      return false;
    }
    if (this.timeWindowSize === undefined) {
      return true;
    }

    if (!this.isMultipleInputsWarned && inputs.length > 1) {
      console.warn("Detected multiple inputs on VolumeMeterProcessor worklet node. VolumeMeterProcessor currently supports only one input. Feel free to implement mulitple inputs yourself");
      this.isMultipleInputsWarned = true;
    }
    if (!inputs.length) {
      console.warn("no inputs connected");
      return true;
    }

    const currentInput = inputs[0];

    for (let currentChannelIndex = 0; currentChannelIndex < currentInput.length; currentChannelIndex++) {
      this.processChannel(currentChannelIndex, currentInput[currentChannelIndex]);
    }
    if (currentInput.length < EXPECTED_CHANNEL_COUNT) {
      for (let i = 0; i < EXPECTED_CHANNEL_COUNT - currentInput.length; i++) {
        const length = currentInput.length ? currentInput[0].length : QUANTUM_SIZE;
        this.processChannel(i, new Float32Array(length));
      }
    }
    return true;
  }
}
registerProcessor("volume-meter-processor", VolumeMeterProcessor);
