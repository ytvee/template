import * as Tone from "customized-tone";
import EventEmitter from "wavesurfer.js/dist/event-emitter";
import { encodePureArraysToWaveFile } from "./common/audiorecorderutils/encode-audio";
import { AnyAudioContext } from "customized-tone/build/esm/core/context/AudioContext.js";
import { ProcessOutput } from "./common/worklet/types.js";
import { createWorkletNode } from "@/audioeditor/audiomodel/audioeditor/common/worklet/utils";
import AudioRecorderProcessor from "@/audioeditor/audiomodel/audioeditor/common/worklet/AudioRecorderProcessor.worklet";

type AudioRecorderProcessorChunk = ProcessOutput;

type AudioRecordEvents = {
  "recorded-file-ready": [{ recordedFile: Blob }];
};
export class AudioRecorder extends EventEmitter<AudioRecordEvents> {
  static async create(toneAudioContext: Tone.BaseContext, audioNodeToRecord: AudioNode): Promise<AudioRecorder> {
    const audioRecorder = new AudioRecorder(toneAudioContext, audioNodeToRecord);
    await audioRecorder.initialize();
    return audioRecorder;
  }

  private audioNodeToRecord?: AudioNode; //TODO: remove after debug
  private toneAudioContext: Tone.BaseContext;
  private audioContext: AnyAudioContext;
  private chunks: Array<AudioRecorderProcessorChunk> = [];

  public isRecording = false;
  public audioWorkletNode?: AudioWorkletNode; // created by registered audio-recorder-processor
  public recordedFile: string | null = null;

  constructor(toneAudioContext: Tone.BaseContext, audioNodeToRecord: AudioNode) {
    super();
    this.audioNodeToRecord = audioNodeToRecord;
    this.toneAudioContext = toneAudioContext;
    this.audioContext = this.toneAudioContext.rawContext;
    // this.audioNodeToRecord; //TODO: remove after debug
  }
  async initialize() {
    await this.initializeAudioWorkletNode();
  }
  finish() {
    this.audioWorkletNode?.port.close();
  }

  async initializeAudioWorkletNode() {
    this.audioWorkletNode = await createWorkletNode(this.toneAudioContext, "audio-recorder-processor", AudioRecorderProcessor as unknown as string);

    this.audioWorkletNode.port.addEventListener("message", (event) => {
      this.chunks.push(event.data.chunk);
    });
    this.audioWorkletNode.port.start(); // Start receiving messages from the worklet.
  }
  enableAudioWorkletNode() {
    if (!this.audioWorkletNode) {
      throw new Error();
    }
    const parameter = this.audioWorkletNode.parameters.get("isRecording");
    if (!parameter) {
      throw new Error();
    }
    parameter.setValueAtTime(1, this.audioContext.currentTime); // Set the worklet's isRecording parameter to 1 to start recording.
  }
  disableAudioWorkletNode() {
    if (!this.audioWorkletNode) {
      throw new Error();
    }
    const parameter = this.audioWorkletNode.parameters.get("isRecording");
    if (!parameter) {
      throw new Error();
    }
    parameter.setValueAtTime(0, this.audioContext.currentTime); // Set the worklet's isRecording parameter to 0 to stop recording.
  }
  clearChunks() {
    this.chunks = [];
  }
  encodeChunksToWaveFile() {
    //TODO: remove async
    const DEFAULT_AUDIO_CONTEXT_BITS_PER_SAMPLE = 16; //default is 16 bits per sample or what's the same 32 bits per 2 samples of 2 channels
    const DEFAULT_CHANNEL_COUNT = 2;

    const options = {
      bitsPerSample: DEFAULT_AUDIO_CONTEXT_BITS_PER_SAMPLE,
      sampleRate: this.audioContext.sampleRate,
      channelCount: DEFAULT_CHANNEL_COUNT,
    };
    const blob = encodePureArraysToWaveFile(this.chunks, options); // Call the encodeAudio function to convert the recorded audio to WAVE format.
    return blob;
  }

  public async startRecord() {
    if (this.isRecording) {
      return;
    }
    this.isRecording = true;
    await this.initializeAudioWorkletNode();
    if (!this.audioNodeToRecord || !this.audioWorkletNode) {
      throw new Error();
    }
    this.audioNodeToRecord.connect(this.audioWorkletNode);
    this.enableAudioWorkletNode();
  }
  pauseRecord() {
    if (!this.isRecording) {
      return;
    }
    this.isRecording = false;
    this.disableAudioWorkletNode();
    (async () => {
      const blob = this.encodeChunksToWaveFile();
      this.emit("recorded-file-ready", { recordedFile: blob });
    })();
  }
  resetRecord() {
    this.chunks = [];
  }
}
