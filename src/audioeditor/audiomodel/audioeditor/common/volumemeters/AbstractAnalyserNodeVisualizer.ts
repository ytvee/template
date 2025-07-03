import * as Tone from "customized-tone";
import EventEmitter from "wavesurfer.js/dist/event-emitter";
import { AbstractVisualizer } from "./AbstractVisualizer";
import { AnyAudioContext } from "customized-tone/build/esm/core/context/AudioContext";

/**
 * all values avaliable for fftSize property of AnalyserNode
 */
export const avaliableSampleSize = {
  //INFO: "sampleSize": fftSize,
  "16": 32,
  "32": 64,
  "64": 128,
  "128": 256,
  "256": 512,
  "512": 1024,
  "1024": 2048, //INFO: default
  "2048": 4096,
  "4096": 8192,
  "8192": 16384,
  "16384": 32768,
};

export type AbstractAnalyserNodeVisualizerOptions = {
  channelCount?: number;
};

type AbstractAnalyserNodeVisualizerEvents = {
  "volume-updated": [{ channel: number }]; //TODO: render-data instead of volume-updated
};

export type BaseChannelAnalyser = {
  analyserNode: AnalyserNode;
  channel: number;
};

export abstract class AbstractAnalyserNodeVisualizer extends AbstractVisualizer {
  public eventEmitter: EventEmitter<AbstractAnalyserNodeVisualizerEvents>;
  private toneAudioContext: Tone.BaseContext;
  private audioContext: AnyAudioContext;
  protected channelAnalysers: Array<BaseChannelAnalyser> = [];

  public timeWindowSizeSamples = 0;
  public timeWindowSizeSeconds = 0;

  constructor(toneAudioContext: Tone.BaseContext, inputNode: AudioNode, options?: AbstractAnalyserNodeVisualizerOptions) {
    super();
    this.eventEmitter = new EventEmitter<AbstractAnalyserNodeVisualizerEvents>();
    this.toneAudioContext = toneAudioContext;
    this.audioContext = this.toneAudioContext.rawContext;

    const channelSplitterNode = this.audioContext.createChannelSplitter(options?.channelCount);
    inputNode.connect(channelSplitterNode);

    for (let i = 0; i < channelSplitterNode.channelCount; i++) {
      this.initializeAnalyser(channelSplitterNode, i);
    }
    this.computeWindowSize();
  }
  /**
   * compute window size in milliseconds
   */
  private computeWindowSize() {
    this.timeWindowSizeSamples = this.channelAnalysers[0]?.analyserNode.frequencyBinCount;
    this.timeWindowSizeSeconds = this.timeWindowSizeSamples / this.audioContext.sampleRate;
  }
  protected abstract updateDataArraySize(channelAnalyser: BaseChannelAnalyser): void;
  protected abstract obtainAnalyserFields(analyserNode: AnalyserNode): object;

  private initializeAnalyser(channelSplitterNode: ChannelSplitterNode, channel: number) {
    const analyserNode = this.audioContext.createAnalyser();
    channelSplitterNode.connect(analyserNode, channel, 0);
    const analyserFields = this.obtainAnalyserFields(analyserNode);
    this.channelAnalysers.push({ analyserNode, channel, ...analyserFields });
  }

  protected abstract calculateValues(channelAnalyser: BaseChannelAnalyser): object;
  protected updateValues(channelAnalyser: BaseChannelAnalyser) {
    const payload = this.calculateValues(channelAnalyser);
    this.eventEmitter["emit"]("volume-updated", { channel: channelAnalyser.channel, ...payload });
  }
  private setAnalysersfftSize(fftSize: number) {
    for (const channelAnalyser of this.channelAnalysers) {
      channelAnalyser.analyserNode.fftSize = fftSize;
      this.updateDataArraySize(channelAnalyser);
    }
    this.computeWindowSize();
  }
  public setAnalysersSampleSize(sampleSize: string) {
    this.setAnalysersfftSize(avaliableSampleSize[sampleSize as keyof typeof avaliableSampleSize]);
  }
  public getAnalysersSampleSize() {
    return this.channelAnalysers[0]?.analyserNode.frequencyBinCount;
  }
  protected override render(): void {
    for (const channelAnalyser of this.channelAnalysers) {
      this.updateValues(channelAnalyser);
    }
  }
}
