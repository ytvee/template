import * as Tone from "customized-tone";

import EventEmitter from "wavesurfer.js/dist/event-emitter.js";
import { TrackEditor } from "./audioeditor/TrackEditorWithEditingTools";
import { AudioRecorder } from "./audioeditor/AudioRecorder";
import { OfflineAudioRecorder } from "./audioeditor/trackeditor/trackeditorbase/OfflineAudioRecorder";
import { initializeTone } from "./ToneJsUtils";
import { TransportClass } from "customized-tone/build/esm/core/clock/Transport";
import { AnyAudioContext } from "customized-tone/build/esm/core/context/AudioContext";
import { CommandHistory } from "../controller/commandhistory/CommandHistory";
import { ProjectManager } from "../controller/ProjectManager";

export type AudioEditorEvents = {
  "playback-started": [];
  "playback-paused": [];

  "recorded-file-ready": [{ recordedFile: Blob }]; //TODO: move to recorder
};

export class AudioEditor extends EventEmitter<AudioEditorEvents> {
  /* access */
  private static audioEditor: AudioEditor | null = null;
  // private static newInstancePromise: Promise<AudioEditor> | null = null;
  public static async createInstance(): Promise<AudioEditor> {
    await initializeTone();
    const instance = new AudioEditor();
    await instance.initialise();
    this.audioEditor = instance;
    return this.getInstance();
  }
  public static getInstance(): AudioEditor {
    if (!this.audioEditor) {
      throw new Error();
      // this.newInstancePromise = AudioEditor.createInstance();
    }
    return this.audioEditor;
  }
  public static destroyInstance() {
    if (this.audioEditor) {
      this.audioEditor.destroy();
    }
    this.audioEditor = null;
  }
  /* /access */

  /* playback */
  private isPlaying = false;
  /* /playback */

  /* audio tools */
  private toneAudioContext: Tone.BaseContext;
  private audioContext: AnyAudioContext;
  private transport: TransportClass;
  private addGainNode: GainNode;
  /* /audio tools */

  /* submodules */
  private _trackEditor: TrackEditor | null = null;
  public get trackEditor(): TrackEditor {
    if (!this._trackEditor) {
      throw new Error();
    }
    return this._trackEditor;
  }
  // midiEditor: MidiEditor;
  private _audioRecorder: AudioRecorder | null = null;
  public get audioRecorder(): AudioRecorder {
    if (!this._audioRecorder) {
      throw new Error();
    }
    return this._audioRecorder;
  }
  private _offlineAudioRecorder: OfflineAudioRecorder | null = null;
  public get offlineAudioRecorder(): OfflineAudioRecorder {
    if (!this._offlineAudioRecorder) {
      throw new Error();
    }
    return this._offlineAudioRecorder;
  }
  public commandHistory: CommandHistory; //TODO: move from audio model
  public projectManager: ProjectManager;
  /* submodules */

  constructor() {
    super();

    this.transport = Tone.getTransport();
    this.toneAudioContext = Tone.getContext();
    this.audioContext = this.toneAudioContext.rawContext;
    // console.log("lookAhead=", Tone.getContext().lookAhead);

    this.addGainNode = this.audioContext.createGain();
    this.addGainNode.connect(this.audioContext.destination);

    this.commandHistory = new CommandHistory();
    this.projectManager = new ProjectManager();
  }
  private async initialise() {
    this._trackEditor = await TrackEditor.createInstance(this.toneAudioContext, this.addGainNode);
    this._offlineAudioRecorder = new OfflineAudioRecorder(this.toneAudioContext, this.trackEditor);
    this.trackEditor.setOfflineAudioRecorder(this.offlineAudioRecorder);
  }
  /* instance initialization and destruction*/
  /**
   * destroys the AudioEditor instance
   */
  public destroy() {
    this.pause();
    this.trackEditor.destroy();
  }
  /* /instance initialization and destruction*/

  /* audio time, play and sync methods */
  public play() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;
    this.trackEditor.play();

    this.emit("playback-started");
  }

  public pause() {
    if (!this.isPlaying) {
      return;
    }
    this.isPlaying = false;

    this.trackEditor.pause();
    this.emit("playback-paused");
  }
  /* /audio time, play and sync methods */

  /* audioRecorder */
  public async enableAudioRecorder() {
    this._audioRecorder = await AudioRecorder.create(this.toneAudioContext, this.addGainNode);
    this.audioRecorder.on("recorded-file-ready", ({ recordedFile }) => {
      this.emit("recorded-file-ready", { recordedFile: recordedFile });
    });
  }
  public disableAudioRecorder() {
    this.audioRecorder.unAll();
    this.audioRecorder.finish();
    this._audioRecorder = null;
  }
  public async switchAudioRecord() {
    if (!this._audioRecorder) {
      await this.enableAudioRecorder();
    } else {
      this.disableAudioRecorder();
    }
  }
  get isAudioRecorderEnabled() {
    return Boolean(this._audioRecorder);
  }
  get isRecording() {
    return this._audioRecorder?.isRecording ?? false;
  }
  /* /audioRecorder */
}
