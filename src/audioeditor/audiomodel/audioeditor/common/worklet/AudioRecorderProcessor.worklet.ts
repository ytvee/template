import { ProcessInput, ProcessOutput } from "./types";

const CHANNEL_COUNT = 2; //TODO: think how to get the actual channel number
export default class AudioRecorderProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    // <1>
    return [
      {
        name: "isRecording",
        defaultValue: 0,
        minValue: 0,
        maxValue: 1,
        automationRate: "k-rate",
      },
    ];
  }
  constructor() {
    super();
  }

  process(inputs: Array<ProcessInput>, outputs: Array<ProcessOutput>, parameters: Record<string, Float32Array>): boolean {
    if (parameters.isRecording[0] === 0) {
      //we can enable or disable recording porcess by set isRecordin parametr 0 or 1
      return true; // false will stop the porcess
    }
    if (inputs[0].length !== CHANNEL_COUNT) {
      // when playback is stopped process continues receive rendering quantums (blocks)
      return true;
    }
    const chunk: Array<Array<number>> = [[], []];
    const channel1 = 0;
    const channel2 = 1;

    for (let t = 0; t < inputs[0][channel1].length; t += 1) {
      //TODO: remake
      chunk[0].push(inputs[0][channel1][t]);
    }
    for (let t = 0; t < inputs[0][channel2].length; t += 1) {
      chunk[1].push(inputs[0][channel2][t]);
    }

    if (chunk[0].length >= 1) {
      this.port.postMessage({ chunk }); // Send a message when the number of elements in the chunk is 1 or more.
    }
    return true;
  }
}

registerProcessor("audio-recorder-processor", AudioRecorderProcessor); // Register the Audio Recorder as an Audio Worklet.
