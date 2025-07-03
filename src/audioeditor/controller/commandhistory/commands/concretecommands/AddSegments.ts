import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { AbstractCommand, AbstractCommandExecutionResult } from "../AbstractCommand";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";
import { SegmentOptions } from "../../../../audiomodel/audioeditor/trackeditor/trackeditorbase/track/SegmentFactory";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import store from "@/store/store";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";

export class AddSegments extends AbstractCommand {
  private audioEditor: AudioEditor;
  // private context: Context;

  /* redo */
  private isFirstRedo: boolean;
  private segments: Array<SegmentOptions>;
  private trackId: UniqueId;
  private placeToTrackEnd: boolean;
  /* /redo */

  /* undo */
  private segmentIds: Array<UniqueId> = [];
  /* /undo */

  constructor(audioEditor: AudioEditor, context: Context, trackId: UniqueId, segments: Array<SegmentOptions>, placeToTrackEnd: boolean) {
    super("AddSegments");
    this.isFirstRedo = true;
    this.audioEditor = audioEditor;
    // this.context = context;
    this.segments = segments;
    this.trackId = trackId;
    this.placeToTrackEnd = placeToTrackEnd;

    this._verboseDescription = `count:${segments.length} trackId:${trackId}`;
  }
  public override undo(): AbstractCommandExecutionResult {
    store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "removeSegments", { commandArgs: { trackId: this.trackId, segmentIds: this.segmentIds }, controllerOptions: { isCalledByCommand: true } });
    return;
  }
  private async auxiliary(isFirstRedo: boolean) {
    const segments = [];
    for (let i = 0; i < this.segments.length; i++) {
      const segment = await store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "addSegmentToExistingTrack", {
        segment: isFirstRedo ? this.segments[i] : { ...this.segments[i], id: this.segmentIds[i] },
        trackId: this.trackId,
        placeToTrackEnd: this.placeToTrackEnd,
      });
      if (isFirstRedo) {
        this.segmentIds.push(segment.id);
      }
      segments.push(segment);
    }
    return segments;
  }
  private async firstRedo() {
    return await this.auxiliary(true);
  }
  private async futherRedo() {
    return await this.auxiliary(false);
  }
  public override async redo(): Promise<AbstractCommandExecutionResult> {
    let segments;
    if (this.isFirstRedo) {
      segments = await this.firstRedo();
      this.isFirstRedo = false;
    } else {
      segments = await this.futherRedo();
    }

    return { data: { segments } };
  }
}
