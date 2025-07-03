import * as Tone from "customized-tone";
import { AnyAudioContext } from "customized-tone/build/esm/core/context/AudioContext";
import { AbstractVisualizer } from "./AbstractVisualizer";
import { createWorkletNode } from "../worklet/utils";

export abstract class AbstractWorkletVisualizer extends AbstractVisualizer {
  private initializePromise: Promise<any>;

  protected toneAudioContext: Tone.BaseContext;
  protected audioContext: AnyAudioContext;

  protected inputNode: AudioNode;
  protected audioWorkletNode?: AudioWorkletNode;

  constructor(toneAudioContext: Tone.BaseContext, inputNode: AudioNode, AudioWorkletProcessorRegistrationName: string, AudioWorkletProcessorUrl: string) {
    super();
    this.toneAudioContext = toneAudioContext;
    this.audioContext = this.toneAudioContext.rawContext;

    this.inputNode = inputNode;
    this.initializePromise = this.initialize(AudioWorkletProcessorRegistrationName, AudioWorkletProcessorUrl);
  }
  public async destroy() {
    await this.initializePromise;
    super.destroy();
    if (!this.audioWorkletNode) {
      throw new Error();
    }
    const isActive = this.audioWorkletNode.parameters.get("isActive");
    if (!isActive) {
      throw new Error("Please add the isActive parameter via 'parameterDescriptors' in your class implementing the AudioWorkletProcessor interface. This will allow the worklet to terminate when it is no longer needed.");
    }
    isActive.value = 0;
  }

  private async initialize(name: string, url: string) {
    this.audioWorkletNode = await createWorkletNode(this.toneAudioContext, name, url);
    this.continueInitialization();
  }

  protected abstract continueInitialization(): void;
}
