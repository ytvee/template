import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";
import { SaveLoadManager, TrackSave } from "../../../../audiomodel/audioeditor/trackeditor/trackeditorbase/SaveLoadManager";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import { TrackOptions } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/TrackFactory";
import { EnvironmentImpactManager, RedoImpactAndGetMementoSpecializedFunctions } from "../enviromentmemento/EnvironmentImpactManager";

export class RemoveTracks extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private trackIds: Array<UniqueId>;
  private environmentMemento?: Awaited<ReturnType<RedoImpactAndGetMementoSpecializedFunctions["RemoveTracks"]>>;
  /* /redo */

  /* undo */
  private trackSaves: Array<TrackSave> = [];
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackIds: Array<UniqueId>) {
    super("RemoveTracks");
    this.audioEditor = audioEditor;
    this.context = context;

    this.trackIds = trackIds;

    for (let i = 0; i < this.trackIds.length; i++) {
      this.trackSaves.push(SaveLoadManager.getTrackSaveByTrack(audioEditor.trackEditor.getTrackByTrackId(this.trackIds[i])));
    }

    this._verboseDescription = `count:${trackIds.length}`;
  }
  private removeTrack(trackId: UniqueId) {
    this.audioEditor.trackEditor.removeTrack(trackId);
    this.context.commit("removeVisualTrack", { trackId });
  }
  public override async undo(): Promise<AbstractCommandExecutionResult> {
    //TODO: now we have three ways to add track: by user, by undo, by save. We do not want to duplicate code. Think about it
    const tracksOptions: Array<TrackOptions> = [];
    for (let i = 0; i < this.trackSaves.length; i++) {
      //TODO: save and parse to options in constructor. Not in undo.
      const trackSave = this.trackSaves[i];
      tracksOptions.push(SaveLoadManager.getTrackOptionsByTrackSave(trackSave));
    }
    await this.context.dispatch("addTracks", { commandArgs: { tracks: tracksOptions }, controllerOptions: { isCalledByCommand: true } });

    if (this.environmentMemento === undefined) {
      throw new Error();
    }

    await EnvironmentImpactManager.undoImpactWithMemento("RemoveTracks", this.environmentMemento);
    return;
  }
  public override async redo(): Promise<AbstractCommandExecutionResult> {
    this.environmentMemento = await EnvironmentImpactManager.redoImpactAndGetMemento("RemoveTracks", this.audioEditor, this.context, this.trackIds);

    for (let i = 0; i < this.trackIds.length; i++) {
      this.removeTrack(this.trackIds[i]);
    }
    return;
  }
}
