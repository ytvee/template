import * as Tone from "customized-tone";
import { createPlayer } from "@audioeditor/audiomodel/ToneJsUtils";
import { Subdivision } from "customized-tone/build/esm/core/type/Units";
import { TimeSignature } from "@audioeditor/audiomodel/types";
import { defaultMetronomeValues, metronomeMessages, metronomeSounds, metronomeSubdivisions } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/metronome/constants";
import { DestinationClass } from "customized-tone/build/esm/core/context/Destination";
import { TransportClass } from "packages/customized-tone/build/esm/core/clock/Transport";
import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";

export type MetronomeSound = {
  name: string;
  downBeatSampleUrl: string;
  upBeatSampleUrl: string;
  default?: boolean;
};
export type MetronomeSubdivision = {
  name: string;
  value: Subdivision;
  defalut?: boolean;
};

type MetronomeOptions = {
  output: AudioNode;

  tempo: number;
  timeSignature: TimeSignature;
  subdivision: MetronomeSubdivision;
  emphasizeDownbeat: boolean;
};
export type PartialMetronomeOptions = Partial<MetronomeOptions>;

const VOLUME_RAMP_TIME = 0.01; //s

export class Metronome {
  public static async createInstance(toneAudioContext: Tone.BaseContext, options?: PartialMetronomeOptions): Promise<Metronome> {
    const metronome = new Metronome(toneAudioContext, options);
    await metronome.initialize();

    return metronome;
  }
  private toneAudioContext: Tone.BaseContext;
  private transport: TransportClass;

  private _isStarted = false;
  public get isStarted() {
    return this._isStarted;
  }
  private output: AudioNode | DestinationClass;

  private downBeatPlayer: Tone.Player | null = null;
  private upBeatPlayer: Tone.Player | null = null;

  // private loop: Tone.Loop;
  private sheduledEventId: number | null = null;

  private sound?: MetronomeSound;
  private _tempo: number;
  private _timeSignature: TimeSignature;

  private _subdivision: MetronomeSubdivision;

  private _emphasizeDownbeat: boolean;

  public get volume() {
    if (!this.downBeatPlayer) {
      throw new Error();
    }
    return Tone.dbToGain(this.downBeatPlayer.volume.value);
  }
  public set volume(volume: number) {
    if (!this.downBeatPlayer || !this.upBeatPlayer) {
      throw new Error();
    }
    this.downBeatPlayer.volume.linearRampTo(Tone.gainToDb(volume), VOLUME_RAMP_TIME);
    this.upBeatPlayer.volume.linearRampTo(Tone.gainToDb(volume), VOLUME_RAMP_TIME);
  }

  private repeatStartTime: number | null = null;

  private eventCallback = (time: number) => {
    const transportTime = this.transport.seconds;
    const quantizedTime = Tone.Time(transportTime).quantize(this.subdivision.value);
    const formattedTime = Tone.Time(quantizedTime).toBarsBeatsSixteenths();

    if (this.emphasizeDownbeat && this.isDownBeat(formattedTime)) {
      if (!this.downBeatPlayer) {
        throw new Error();
      }
      this.downBeatPlayer.start(time);
    } else {
      if (!this.upBeatPlayer) {
        throw new Error();
      }
      this.upBeatPlayer.start(time);
    }
  };
  constructor(toneAudioContext: Tone.BaseContext, options?: PartialMetronomeOptions) {
    this.toneAudioContext = toneAudioContext;
    this.transport = this.toneAudioContext.transport;

    this.output = options?.output ?? this.toneAudioContext.destination;
    this._tempo = options?.tempo ?? AUDIO_EDITOR_CONFIGURATION.tracksEditor.functionality.tempo;
    this._timeSignature = structuredClone(options?.timeSignature) ?? structuredClone(AUDIO_EDITOR_CONFIGURATION.tracksEditor.functionality.timeSignature);
    this._subdivision = options?.subdivision ?? defaultMetronomeValues.subdivision;
    this._emphasizeDownbeat = options?.emphasizeDownbeat ?? defaultMetronomeValues.emphasizeDownbeat;

    if (!metronomeSounds.length) {
      throw new Error();
    }
  }
  /**
   * downbeat - the first beat in bar
   * upbeat - other beat in bar
   */
  private isDownBeat(formattedTime: string) {
    return formattedTime.split(":")[1] === "0" && formattedTime.split(":")[2] === "0"; //TODO: not work fine when bpm greater then nearly 400 - 600
  }
  private getDefaultSound(): MetronomeSound {
    if (!metronomeSounds.length) {
      throw new Error(metronomeMessages.ERRORS.NO_SOUNDS);
    }

    let defaultSound = metronomeSounds.find((sound) => sound.default === true);
    if (!defaultSound) {
      console.warn(metronomeMessages.WARNINGS.NO_DEFAULT_SOUND);
      defaultSound = metronomeSounds[0];
    }
    return defaultSound;
  }
  private async initialize() {
    const defaultSound = this.getDefaultSound();
    await this.setSound(defaultSound);
  }

  private getRepeatStartTime() {
    const transportSeconds = this.transport.seconds;

    const beatDuration = Tone.Time(this.subdivision.value).toSeconds();
    const beatsPassed = transportSeconds / beatDuration;
    const repeatStartTime = Math.floor(beatsPassed) * beatDuration;
    return repeatStartTime;
  }
  public start() {
    if (this._isStarted) {
      return;
    }
    this._isStarted = true;

    const repeatStartTime = this.getRepeatStartTime();
    this.repeatStartTime = repeatStartTime;

    this.sheduledEventId = this.transport.scheduleRepeat(this.eventCallback, this.subdivision.value, repeatStartTime);
  }
  public stop() {
    if (!this._isStarted) {
      return;
    }
    this._isStarted = false;

    if (this.sheduledEventId !== null) {
      this.transport.clear(this.sheduledEventId);
      this.sheduledEventId = null;
      this.repeatStartTime = null;
    }
  }
  public restartIfStarted() {
    if (this._isStarted) {
      this.stop();
      this.start();
    }
  }
  /*
   * For tranport loop
   */
  public restartEarlier() {
    if (this.repeatStartTime && this.getRepeatStartTime() < this.repeatStartTime) {
      this.restartIfStarted();
    }
  }

  public get tempo(): number {
    return this._tempo;
  }
  public set tempo(tempo: number) {
    this._tempo = tempo;
    this.restartIfStarted();
  }
  public get timeSignature(): TimeSignature {
    return this._timeSignature;
  }
  public set timeSignature(timeSignature: TimeSignature) {
    this._timeSignature = structuredClone(timeSignature);
  }
  public setSubdivisionByName(subdivisionName: string) {
    const subdivision = metronomeSubdivisions.find((subdivision) => subdivision.name === subdivisionName);
    if (!subdivision) {
      throw new Error();
    }
    this.subdivision = subdivision;
  }
  public get subdivision(): MetronomeSubdivision {
    return structuredClone(this._subdivision);
  }
  public set subdivision(subdivision: MetronomeSubdivision) {
    this._subdivision = structuredClone(subdivision);
    this.restartIfStarted();
  }
  public get emphasizeDownbeat(): boolean {
    return this._emphasizeDownbeat;
  }
  public set emphasizeDownbeat(emphasizeDownbeat: boolean) {
    this._emphasizeDownbeat = emphasizeDownbeat;
  }
  public async setSound(sound: MetronomeSound) {
    this.sound = structuredClone(sound);
    this.downBeatPlayer = await createPlayer(this.sound.downBeatSampleUrl);
    this.downBeatPlayer.connect(this.output);
    this.upBeatPlayer = await createPlayer(this.sound.upBeatSampleUrl);
    this.upBeatPlayer.connect(this.output);
  }
  public async setSoundByName(soundName: string) {
    const sound = metronomeSounds.find((sound) => sound.name === soundName);
    if (!sound) {
      throw new Error(metronomeMessages.ERRORS.SOUND_WAS_NOT_FOUND(soundName));
    }
    await this.setSound(sound);
  }
  getCurrentSound() {
    if (!this.sound) {
      throw new Error();
    }
    return structuredClone(this.sound);
  }
}
