/**
 * Web Audio buffer player emulating the behavior of an HTML5 Audio element.
 */
import * as Tone from "customized-tone";
import { AnyAudioContext } from "customized-tone/build/esm/core/context/AudioContext";
import EventEmitter from "wavesurfer.js/dist/event-emitter";

import { AUDIO_NODE_VALUE_CHANGE_TIME } from "@audioeditor/data/constants";

type WebAudioPlayerEvents = {
  loadedmetadata: [];
};

type WebAudioPlayerOptions = {
  isDummyPlayer?: boolean;
  outputNode?: AudioNode;
};

class WebAudioPlayer {
  public eventEmitter: EventEmitter<WebAudioPlayerEvents>;

  private toneAudioContext: Tone.BaseContext;
  private audioContext: AnyAudioContext;
  private bufferNode: AudioBufferSourceNode | null;
  private stereoPannerNode: StereoPannerNode;

  private gainNode: GainNode;
  private gainValue = 1;

  private _src = "";
  private _duration = 0;
  private _buffer: AudioBuffer | null = null;
  public get buffer() {
    return this._buffer;
  }

  public paused = true;
  public crossOrigin: string | null = null;

  constructor(toneAudioContext: Tone.BaseContext, options?: WebAudioPlayerOptions) {
    this.eventEmitter = new EventEmitter();

    this.toneAudioContext = toneAudioContext;
    this.audioContext = this.toneAudioContext.rawContext;

    this.bufferNode = null;

    this.stereoPannerNode = this.audioContext.createStereoPanner();
    this.gainNode = this.audioContext.createGain();

    // const compressor = this.audioContext.createDynamicsCompressor(); //INFO: NOT REMOVE! enable compressor and adjust its settings if nesseccary. do not forget to edit muted
    // compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
    // compressor.knee.setValueAtTime(20, this.audioContext.currentTime);
    // compressor.ratio.setValueAtTime(20, this.audioContext.currentTime);
    // compressor.attack.setValueAtTime(0, this.audioContext.currentTime);
    // compressor.release.setValueAtTime(1, this.audioContext.currentTime);

    this.stereoPannerNode.connect(this.gainNode);
    // this.gainNode.connect(compressor);
    // compressor.connect(this.audioContext.destination);

    if (!options?.outputNode) {
      console.warn("outputNode is not set! options?.outputNode=", options?.outputNode);
    }
    const output = options?.outputNode || this.audioContext.destination;
    this.gainNode.connect(output);
  }
  finish() {
    this.gainNode.disconnect();
  }

  addEventListener(event: string, listener: () => void, options?: { once?: boolean }) {
    this.eventEmitter.on(event as keyof WebAudioPlayerEvents, listener, options);
  }
  removeEventListener(event: string, listener: () => void) {
    this.eventEmitter.un(event as keyof WebAudioPlayerEvents, listener);
  }

  get src() {
    return this._src;
  }
  set src(value: string) {
    this.asyncSetSrc(value);
  }
  /**
   * use this method instead of src setter for correct error handling
   */
  public asyncSetSrc(value: string) {
    this._src = value;
    return new Promise<void>((resolve, reject) => {
      fetch(value)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => this.audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          this._buffer = audioBuffer;
          this._duration = audioBuffer.duration;

          // this.editableBounds.rightEditableBound = this.duration;
          this.eventEmitter["emit"]("loadedmetadata");
          resolve();
        })
        .catch((error) => reject(error));
    });
  }

  async play(time: number, offset: number, duration: number) {
    this.paused = false;
    this.bufferNode?.disconnect();
    this.bufferNode = this.audioContext.createBufferSource();
    this.bufferNode.buffer = this._buffer;

    this.bufferNode.connect(this.stereoPannerNode);
    this.bufferNode.start(time, offset);
    this.stopAt(time + duration);
  }

  pause() {
    if (this.paused) return;
    this.paused = true;
    this.bufferNode?.stop();
  }
  /**
   *
   * @param time audioContext time
   * @returns
   */
  public stopAt(time: number) {
    this.bufferNode?.stop(time);
  }
  public unStopAt() {
    const longEnoughTime = this.audioContext.currentTime + this.duration;
    this.bufferNode?.stop(longEnoughTime);
  }

  get playbackRate() {
    return this.bufferNode?.playbackRate.value ?? 1;
  }
  set playbackRate(value) {
    if (this.bufferNode) {
      this.bufferNode.playbackRate.value = value;
    }
  }

  get duration() {
    return this._duration;
  }
  set duration(value: number) {
    this._duration = value;
  }
  private isContextRunning() {
    //This solves the problem when there is a transition during start between values. Example: You set the volume of a track close to zero. Then record this track using offlineaudiocontext. You will hear something like an "attack" at the beginning of the sound.
    return this.audioContext.state === "running";
  }
  public getVolume() {
    return this.gainNode.gain.value;
  }
  public setVolume(value: number, isSharp?: boolean) {
    this.gainValue = value;
    if (!isSharp && this.isContextRunning()) {
      this.gainNode.gain.linearRampToValueAtTime(value, this.audioContext.currentTime + AUDIO_NODE_VALUE_CHANGE_TIME);
    } else {
      this.gainNode.gain.value = value;
    }
  }
  private _muted = false;
  set muted(muted: boolean) {
    this.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
    if (muted) {
      this.gainNode.gain.value = 0;
    } else {
      this.gainNode.gain.value = this.gainValue;
    }
    this._muted = muted;
  }
  get muted() {
    return this._muted;
  }
  get stereoPanorama() {
    return this.stereoPannerNode.pan.value;
  }
  setStereoPanorama(value: number, isSharp?: boolean) {
    if (!isSharp && this.isContextRunning()) {
      this.stereoPannerNode.pan.linearRampToValueAtTime(value, this.audioContext.currentTime + AUDIO_NODE_VALUE_CHANGE_TIME);
    } else {
      this.stereoPannerNode.pan.value = value;
    }
  }
  public getEgressNode() {
    return this.gainNode;
  }
}

export default WebAudioPlayer;
