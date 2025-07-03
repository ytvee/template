/**
 * DAW Audio Segment implementation. The audio segment is what the tracks are made of.
 */
import * as Tone from "customized-tone";
import EventEmitter from "wavesurfer.js/dist/event-emitter.js";
import WaveSurfer, { type WaveSurferOptions } from "wavesurfer.js";
import WebAudioPlayer from "./segment/WebAudioPlayer";

import { waveSurferConstantOptions } from "@audioeditor/data/constants";
import { AnyAudioContext } from "customized-tone/build/esm/core/context/AudioContext";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import { CompletedSegmentOptions } from "./SegmentFactory";

export type SegmentEvents = {
  //eventName: [{ parameter: ParameterType}]
};

type EditableBounds = {
  /**
   * s, left bound position relative to segment;
   */
  leftBoundPosition: number;
  /**
   * s, right bound position relative to segment;
   */
  rightBoundPosition: number;
};
export type SegmentEditingTools = {
  editableBounds: EditableBounds;
};
export type SegmentEditingToolsOptions = {
  editableBounds: Partial<EditableBounds>;
};
type EditableBoundSide = "left" | "right";

export class Segment extends EventEmitter<SegmentEvents> {
  id: UniqueId;
  name: string;

  wavesurferContainerRef: HTMLElement;
  waveSurfer?: WaveSurfer;
  private toneAudioContext: Tone.BaseContext;
  audioContext: AnyAudioContext;
  duration?: number;
  startPosition: number; //s
  public url: string;
  public audio?: WebAudioPlayer;
  public segmentEditingTools: SegmentEditingTools;

  private outputNode?: AudioNode;

  private sheduledEventId: number | null = null;
  private sheduledOnceEventId: number | null = null;

  public get startWithBounds() {
    return this.startPosition + this.segmentEditingTools.editableBounds.leftBoundPosition;
  }
  public setStartWithBounds(startWithBounds: number) {
    this.startPosition = startWithBounds - this.segmentEditingTools.editableBounds.leftBoundPosition;
    this.updateSheduling();
  }
  public get durationWidthBounds() {
    if (!this.segmentEditingTools.editableBounds) {
      throw new Error();
    }
    return this.segmentEditingTools.editableBounds.rightBoundPosition - this.segmentEditingTools.editableBounds.leftBoundPosition;
  }
  public get endWithBounds() {
    if (!this.segmentEditingTools.editableBounds) {
      throw new Error();
    }
    return this.startPosition + this.segmentEditingTools.editableBounds.rightBoundPosition;
  }

  /* initialization and destruction */
  static async createSegment(completedSegmentOptions: CompletedSegmentOptions): Promise<Segment> {
    const segment = new Segment(completedSegmentOptions);
    await segment.continueInitializationWithAsyncMethods(completedSegmentOptions);
    return segment;
  }
  constructor(completedSegmentOptions: CompletedSegmentOptions) {
    super();
    this.id = completedSegmentOptions.id;
    (this.name = completedSegmentOptions.name), (this.startPosition = completedSegmentOptions.startPosition);
    this.segmentEditingTools = {
      editableBounds: {
        leftBoundPosition: completedSegmentOptions.segmentEditingTools.editableBounds.leftBoundPosition ?? 0,
        rightBoundPosition: completedSegmentOptions.segmentEditingTools.editableBounds.rightBoundPosition ?? 0,
      },
    };
    this.toneAudioContext = completedSegmentOptions.toneAudioContext;
    this.audioContext = this.toneAudioContext.rawContext;
    this.url = completedSegmentOptions.url;
    this.outputNode = completedSegmentOptions.outputNode;

    this.wavesurferContainerRef = document.createElement("div");
  }
  async waitForAudioInitialized(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.audio?.eventEmitter.on(
        "loadedmetadata",
        () => {
          resolve();
        },
        { once: true }
      );
    });
  }

  private getLeftBoundTransportTime(): number {
    return this.startPosition + this.segmentEditingTools.editableBounds.leftBoundPosition;
  }
  private getDurationInBounds(): number {
    return this.segmentEditingTools.editableBounds.rightBoundPosition - this.segmentEditingTools.editableBounds.leftBoundPosition;
  }

  private isTransitional(currentTransportTime?: number) {
    const currentTime = currentTransportTime ?? Tone.getTransport().seconds;
    const condition1 = this.startPosition + this.segmentEditingTools.editableBounds.leftBoundPosition < currentTime;
    const condition2 = this.startPosition + this.segmentEditingTools.editableBounds.rightBoundPosition > currentTime;
    if (condition1 && condition2) {
      return true;
    } else {
      return false;
    }
  }

  /* Tone transport sheduling */
  private resheduleTransportEvent() {
    this.unsheduleTransportEvent();
    this.sheduledEventId = Tone.getTransport().schedule((time) => {
      this.audio?.play(time, this.segmentEditingTools.editableBounds.leftBoundPosition, this.getDurationInBounds());
    }, this.getLeftBoundTransportTime());
  }
  private unsheduleTransportEvent() {
    if (this.sheduledEventId !== null) {
      Tone.getTransport().clear(this.sheduledEventId);
      this.sheduledEventId = null;
    }
  }
  private resheduleTransitionalEvents() {
    this.unsheduleTransitionalEvents();
    if (this.isTransitional()) {
      const currentTime = Tone.getTransport().seconds;
      const offset = currentTime - this.startPosition;
      this.sheduledOnceEventId = Tone.getTransport().scheduleOnce((time) => {
        this.audio?.play(time, offset, this.segmentEditingTools.editableBounds.rightBoundPosition - offset);
      }, Tone.Ticks(Tone.getTransport().ticks));
    }
  }
  private unsheduleTransitionalEvents() {
    if (this.sheduledOnceEventId !== null) {
      Tone.getTransport().clear(this.sheduledOnceEventId);
      this.sheduledOnceEventId = null;
    }
  }
  /**
   *
   * @param resheduleTransitionalEventsOnly
   */
  public updateSheduling(resheduleTransitionalEventsOnly = false) {
    this.pause();
    if (!resheduleTransitionalEventsOnly) {
      this.resheduleTransportEvent();
    }
    this.resheduleTransitionalEvents();
  }
  public updateShedulingOnEditableBoundChange(boundSide: "left" | "right", oldBoundPosition: number) {
    this.resheduleTransportEvent();
    switch (boundSide) {
      case "left": {
        if (this.startPosition + this.segmentEditingTools.editableBounds.leftBoundPosition > Tone.getTransport().seconds) {
          this.pause();
        } else if (this.startPosition + oldBoundPosition > Tone.getTransport().seconds) {
          this.resheduleTransitionalEvents();
        }
        break;
      }
      case "right": {
        if (this.startPosition + this.segmentEditingTools.editableBounds.rightBoundPosition < Tone.getTransport().seconds) {
          this.pause();
        } else if (this.startPosition + oldBoundPosition < Tone.getTransport().seconds) {
          this.resheduleTransitionalEvents();
        } else {
          this.audio?.stopAt(Tone.now() + this.startPosition + this.segmentEditingTools.editableBounds.rightBoundPosition - Tone.getTransport().seconds);
        }
        break;
      }
    }
  }
  /* /Tone transport sheduling */

  private async initializeAudio(): Promise<void> {
    if (this.audio) {
      console.error("you tried to initialize segment audio which is already initialized!");
      return Promise.resolve();
    }
    this.audio = new WebAudioPlayer(this.toneAudioContext, {
      outputNode: this.outputNode,
    });
    this.audio.crossOrigin = "anonymous";

    // this.audio.src = this.url;
    await this.audio.asyncSetSrc(this.url);
    // await this.waitForAudioInitialized();
    this.duration = this.audio.duration;

    this.updateSheduling();
  }
  public pause() {
    this.audio?.pause();
  }
  private initializeWavesurfer(): void {
    if (!this.audio || typeof this.duration === "undefined") {
      throw new Error();
    }
    const waveSurferOptions: WaveSurferOptions = {
      ...waveSurferConstantOptions,
      container: this.wavesurferContainerRef,
      media: this.audio as unknown as HTMLMediaElement,
      duration: this.duration,
    };
    this.waveSurfer = WaveSurfer.create(waveSurferOptions);
  }
  updateWaveColor(waveColor: string): void {
    this.waveSurfer?.setOptions({ waveColor: waveColor, progressColor: waveColor });
  }
  initializeSegmentEditingTools(completedSegmentOptions: CompletedSegmentOptions) {
    if (typeof this.duration === "undefined") {
      throw new Error();
    }
    if (completedSegmentOptions.segmentEditingTools.editableBounds.rightBoundPosition === undefined) {
      this.segmentEditingTools.editableBounds.rightBoundPosition = this.duration;
    }
    this.updateSheduling();
  }
  private async continueInitializationWithAsyncMethods(completedSegmentOptions: CompletedSegmentOptions): Promise<void> {
    await this.initializeAudio();
    this.initializeSegmentEditingTools(completedSegmentOptions);
    this.initializeWavesurfer();
  }
  destroy() {
    this.audio?.finish();
    this.waveSurfer?.destroy();
  }
  /* /initialization and destruction */

  /* segment editing tools */
  public moveX(startPosition: number) {
    //TODO: may be remove
    this.startPosition = startPosition;
    this.updateSheduling();
  }
  public setOutputNode(outputNode: AudioNode) {
    if (!this.audio) {
      throw new Error();
    }
    const audioEgressNode = this.audio.getEgressNode();
    audioEgressNode.disconnect(0);
    audioEgressNode.connect(outputNode);
  }
  private moveLeftEditableBound(boundPosition: number): number {
    const oldLeftBoundPosition = this.segmentEditingTools.editableBounds.leftBoundPosition;
    if (boundPosition < 0) {
      this.segmentEditingTools.editableBounds.leftBoundPosition = 0;
    } else if (boundPosition > this.segmentEditingTools.editableBounds.rightBoundPosition) {
      this.segmentEditingTools.editableBounds.leftBoundPosition = this.segmentEditingTools.editableBounds.rightBoundPosition;
    } else {
      this.segmentEditingTools.editableBounds.leftBoundPosition = boundPosition;
    }
    return oldLeftBoundPosition;
  }
  private moveRightEditableBound(boundPosition: number) {
    if (typeof this.duration === "undefined") {
      throw new Error();
    }
    const oldRightBoundPosition = this.segmentEditingTools.editableBounds.rightBoundPosition;
    if (boundPosition > this.duration) {
      this.segmentEditingTools.editableBounds.rightBoundPosition = this.duration;
    } else if (boundPosition < this.segmentEditingTools.editableBounds.leftBoundPosition) {
      this.segmentEditingTools.editableBounds.rightBoundPosition = this.segmentEditingTools.editableBounds.leftBoundPosition;
    } else {
      this.segmentEditingTools.editableBounds.rightBoundPosition = boundPosition;
    }
    return oldRightBoundPosition;
  }
  public moveEditableBound(boundSide: EditableBoundSide, boundPosition: number): number {
    let updatedBoundPosition = -1;
    switch (boundSide) {
      case "left": {
        const oldLeftBoundPosition = this.moveLeftEditableBound(boundPosition);
        updatedBoundPosition = this.segmentEditingTools.editableBounds.leftBoundPosition;
        this.updateShedulingOnEditableBoundChange(boundSide, oldLeftBoundPosition);
        break;
      }
      case "right": {
        const oldRightBoundPosition = this.moveRightEditableBound(boundPosition);
        updatedBoundPosition = this.segmentEditingTools.editableBounds.rightBoundPosition;
        this.updateShedulingOnEditableBoundChange(boundSide, oldRightBoundPosition);
        break;
      }
    }

    return updatedBoundPosition;
  }

  /* /segment editing tools */
}
