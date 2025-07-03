import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import { SaveLoadManager, TrackSave } from "../../../../audiomodel/audioeditor/trackeditor/trackeditorbase/SaveLoadManager";
import { TrackFactory, TrackOptions } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/TrackFactory";
import { VisualTrackFactory } from "@/audioeditor/visualmodel/VisualTrackFactory";
import store from "@/store/store";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";

export class AddTracks extends AbstractCommand {
  private audioEditor: AudioEditor;
  // private context: Context;

  /* redo */
  private tracksOptions: Array<TrackOptions>;
  private directionToPush?: "top" | "bottom";

  /**
   * first call with TrackOptions futher - with TrackSave
   */
  private isFirstRedoCall = true;
  private trackSaves: Array<TrackSave> = [];
  /* /redo */

  /* undo */
  private trackIds: Array<UniqueId> = [];
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, tracksOptions: Array<TrackOptions>, directionToPush?: "top" | "bottom") {
    super("AddTracks");
    this.audioEditor = audioEditor;
    // this.context = context;

    this.tracksOptions = tracksOptions;
    this.directionToPush = directionToPush;

    this._verboseDescription = `count:${tracksOptions.length} direction:${directionToPush}`;
  }
  private async addTrack(trackOptions: TrackOptions) {
    const audioEditor = AudioEditor.getInstance();
    const pushedTrack = await audioEditor.trackEditor.addTrack(trackOptions);

    const visualTrackToPush = VisualTrackFactory.parseVisualTrackFromTrack(store.state.audioEditor.trackEditor.visualTracksModel.tracks, pushedTrack);
    const currentTrackColor = visualTrackToPush.trackColor.primary;
    audioEditor.trackEditor.updateTrackColor(visualTrackToPush.id, currentTrackColor); //TODO: redo

    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "addVisualTrack", visualTrackToPush);

    pushedTrack.volumeMeter.eventEmitter.on("volume-updated", (payload) => {
      store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "updateTrackVolumeMeter", { ...payload, trackId: pushedTrack.id });
    });

    return pushedTrack;
  }
  public override undo(): AbstractCommandExecutionResult {
    store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "removeTracks", { commandArgs: { trackIds: this.trackIds }, controllerOptions: { isCalledByCommand: true } });
    return;
  }
  private async firstRedo(): Promise<AbstractCommandExecutionResult> {
    const tracksOptions = TrackFactory.completeTrackOptionsY(this.audioEditor, this.tracksOptions, this.directionToPush);
    for (let i = 0; i < tracksOptions.length; i++) {
      const track = await this.addTrack(tracksOptions[i]);
      this.trackIds.push(track.id);
      this.trackSaves.push(SaveLoadManager.getTrackSaveByTrack(track));
    }
    return;
  }
  private async furtherRedo(): Promise<AbstractCommandExecutionResult> {
    for (let i = 0; i < this.trackSaves.length; i++) {
      await this.addTrack(SaveLoadManager.getTrackOptionsByTrackSave(this.trackSaves[i]));
    }
    return;
  }
  public override async redo(): Promise<AbstractCommandExecutionResult> {
    if (this.isFirstRedoCall) {
      await this.firstRedo();
      this.isFirstRedoCall = false;
    } else {
      await this.furtherRedo();
    }
    return;
  }
}
