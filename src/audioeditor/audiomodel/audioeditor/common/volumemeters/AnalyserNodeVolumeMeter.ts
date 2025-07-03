import * as Tone from "customized-tone";
import { computePowerByLevelSquare, millisecondsToSeconds } from "../common";
import { AbstractAnalyserNodeVisualizer, AbstractAnalyserNodeVisualizerOptions } from "./AbstractAnalyserNodeVisualizer";
import { BaseChannelAnalyser } from "./AbstractAnalyserNodeVisualizer";

type AnalyserNodeVolumeMeterOptions = AbstractAnalyserNodeVisualizerOptions & {
  peakTimeToLive: number;
};

type PeakChannelAnalyser = BaseChannelAnalyser & {
  dataArray: Float32Array;
  currentPeak: number;
  currentPeakRegistrationTime: number;
  allTimePeak: number;
};

export class AnalyserNodeVolumeMeter extends AbstractAnalyserNodeVisualizer {
  protected declare channelAnalysers: Array<PeakChannelAnalyser>;

  public peakTimeToLive: number;

  constructor(toneAudioContext: Tone.BaseContext, inputNode: AudioNode, options: AnalyserNodeVolumeMeterOptions) {
    super(toneAudioContext, inputNode, options);
    this.peakTimeToLive = options.peakTimeToLive;
  }
  protected override updateDataArraySize(channelAnalyser: PeakChannelAnalyser): void {
    channelAnalyser.dataArray = new Float32Array(channelAnalyser.analyserNode.frequencyBinCount);
  }

  protected override obtainAnalyserFields(analyserNode: AnalyserNode): Omit<PeakChannelAnalyser, keyof BaseChannelAnalyser> {
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    const analyser: Omit<PeakChannelAnalyser, keyof BaseChannelAnalyser> = { dataArray, currentPeak: Number.NEGATIVE_INFINITY, currentPeakRegistrationTime: 0, allTimePeak: Number.NEGATIVE_INFINITY };
    return analyser;
  }
  protected override calculateValues(channelAnalyser: PeakChannelAnalyser): object {
    channelAnalyser.analyserNode.getFloatTimeDomainData(channelAnalyser.dataArray as Float32Array);

    let peakInstantaneousPower = 0;
    for (let i = 0; i < channelAnalyser.dataArray.length; i++) {
      const power = channelAnalyser.dataArray[i] ** 2;
      peakInstantaneousPower += power;

      const dateNow = millisecondsToSeconds(Date.now());
      if (power > channelAnalyser.currentPeak || dateNow - channelAnalyser.currentPeakRegistrationTime > this.peakTimeToLive) {
        channelAnalyser.currentPeak = power;
        channelAnalyser.currentPeakRegistrationTime = dateNow;
      }
    }
    const peakInstantaneousPowerDecibels = computePowerByLevelSquare(peakInstantaneousPower / channelAnalyser.dataArray.length);
    const currentPeakVolume = computePowerByLevelSquare(channelAnalyser.currentPeak);

    channelAnalyser.allTimePeak = Math.max(channelAnalyser.allTimePeak, currentPeakVolume);

    return { volume: peakInstantaneousPowerDecibels, currentPeakVolume, allTimePeak: channelAnalyser.allTimePeak };
  }
  public resetPeakValues() {
    for (const channelAnalyser of this.channelAnalysers) {
      channelAnalyser.currentPeak = Number.NEGATIVE_INFINITY;
      channelAnalyser.allTimePeak = Number.NEGATIVE_INFINITY;
      channelAnalyser.currentPeakRegistrationTime = 0;
      this.updateValues(channelAnalyser);
    }
  }
  public override destroy(): void {
    super.destroy();
  }
}
