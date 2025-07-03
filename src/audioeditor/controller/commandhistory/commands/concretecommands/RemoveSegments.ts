import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { SegmentOptions } from "../../../../audiomodel/audioeditor/trackeditor/trackeditorbase/track/SegmentFactory";
import { SaveLoadManager, SegmentSave } from "../../../../audiomodel/audioeditor/trackeditor/trackeditorbase/SaveLoadManager";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import store from "@/store/store";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { EnvironmentImpactManager, RedoImpactAndGetMementoSpecializedFunctions } from "../enviromentmemento/EnvironmentImpactManager";

export class RemoveSegments extends AbstractCommand {
  private audioEditor: AudioEditor;
  private context: Context;

  /* redo */
  private trackId: UniqueId;
  private segmentIds: Array<UniqueId>;
  private environmentMemento?: Awaited<ReturnType<RedoImpactAndGetMementoSpecializedFunctions["RemoveSegments"]>>;
  /* /redo */

  /* undo */
  private segmentSaves: Array<SegmentSave>;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackId: UniqueId, segmentIds: Array<UniqueId>) {
    //TODO: remove trackId
    super("RemoveSegments");
    this.audioEditor = audioEditor;
    this.context = context;

    this.trackId = trackId;
    this.segmentIds = segmentIds;

    this.segmentSaves = [];
    for (let i = 0; i < this.segmentIds.length; i++) {
      this.segmentSaves.push(SaveLoadManager.getSegmentSaveBySegment(audioEditor.trackEditor.getSegmentByTrackIdSegmentId(this.trackId, this.segmentIds[i])));
    }

    this._verboseDescription = `Remove segments: count:${segmentIds.length} trackId:${trackId}`;
  }
  public override async undo(): Promise<AbstractCommandExecutionResult> {
    const segmentsOptions: Array<SegmentOptions> = [];
    for (const segmentSave of this.segmentSaves) {
      segmentsOptions.push(SaveLoadManager.getSegmentOptionsBySegmentSave(segmentSave));
    }
    await store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "addSegmentsToExistingTrack", { commandArgs: { trackId: this.trackId, segments: segmentsOptions, placeToTrackEnd: false }, controllerOptions: { isCalledByCommand: true } }); //TODO: remake with Controller.

    if (this.environmentMemento === undefined) {
      throw new Error();
    }
    EnvironmentImpactManager.undoImpactWithMemento("RemoveSegments", this.environmentMemento);
    return;
  }
  public override async redo(): Promise<AbstractCommandExecutionResult> {
    this.environmentMemento = await EnvironmentImpactManager.redoImpactAndGetMemento("RemoveSegments", this.audioEditor, this.context, this.segmentIds);
    for (let i = 0; i < this.segmentIds.length; i++) {
      store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "removeSegment", { trackId: this.trackId, segmentId: this.segmentIds[i] });
    }
    return;
  }
}
