/* base class */
import { AbstractCommand, AbstractCommandExecutionResult } from "../../AbstractCommand";

/* receivers */
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import { UniqueId } from "@/audioeditor/audiomodel/types";
import { getVisualTrackByTrackId } from "@/audioeditor/store/modules/submodules/trackEditorFunctions";
import { Track } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/Track";
import store from "@/store/store";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
/* /receivers */

/**
 * We have two cases of segment movement: when the selection is moved and when the segment itself is moved. This command is common for these two cases.
 * This command should only be called from other commands. Do not call it directly in response to user actions. Use the MoveSegment.ts command instead.
 */
export class MoveSegmentHelper extends AbstractCommand {
  private audioEditor: AudioEditor;

  private isFirstRedoCall = true;

  /* redo */
  private newTrackId: UniqueId;
  private segmentId: UniqueId;
  private newSegmentStartWithBounds: number;
  private destinationTrackId: UniqueId;
  /* /redo */

  /* undo */
  private oldTrackId?: UniqueId;
  private oldSegmentStartWithBounds?: number;
  /* /undo */

  constructor(audioEditor: AudioEditor, context: any, trackId: UniqueId, segmentId: UniqueId, segmentStartWithBounds: number, destinationTrackId: UniqueId | null, oldTrackId?: UniqueId, oldSegmentStartWithBounds?: number) {
    super("MoveSegmentHelper");
    this.audioEditor = audioEditor;

    this.newTrackId = trackId;
    this.segmentId = segmentId;
    this.newSegmentStartWithBounds = segmentStartWithBounds;
    this.destinationTrackId = destinationTrackId ?? this.newTrackId;

    this.oldTrackId = oldTrackId;
    this.oldSegmentStartWithBounds = oldSegmentStartWithBounds;

    this._verboseDescription = `trackId:${this.getTrackIdDescription()} segmentId:${this.segmentId} segmentStartTime:${this.oldSegmentStartWithBounds?.toFixed(2)}-->${this.newSegmentStartWithBounds?.toFixed(2)}`;
  }
  private getTrackIdDescription() {
    return this.oldTrackId === this.destinationTrackId ? this.oldTrackId + "(not changed)" : this.oldTrackId + "-->" + this.destinationTrackId;
  }

  private auxiliary(currentTrackId: UniqueId, destinationTrackId: UniqueId, segmentStartWithBounds: number) {
    this.audioEditor.trackEditor.moveSegmentX(currentTrackId, this.segmentId, segmentStartWithBounds);
    store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "moveSegmentX", { trackId: currentTrackId, segmentId: this.segmentId, segmentStartWithBounds });

    if (currentTrackId !== destinationTrackId) {
      let segmentMoveDestinationTrack: Track | undefined;
      if (destinationTrackId !== null) {
        segmentMoveDestinationTrack = this.audioEditor.trackEditor.tracks.get(destinationTrackId);
      }
      if (segmentMoveDestinationTrack === undefined) {
        console.log("create new track"); // TODO: create temporary track and move segment there
      } else {
        if (destinationTrackId === null) {
          throw new Error();
        }
        store.commit(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "moveVisualSegment", { trackId: currentTrackId, destinationTrackId: destinationTrackId, segmentId: this.segmentId });
        this.audioEditor.trackEditor.moveSegmentY(currentTrackId, this.segmentId, destinationTrackId);
        this.audioEditor.trackEditor.updateTrackColor(destinationTrackId, getVisualTrackByTrackId(store.state.audioEditor.trackEditor, destinationTrackId).trackColor.primary);
      }
    }
  }
  public override undo(): AbstractCommandExecutionResult {
    if (this.oldTrackId === undefined || this.oldSegmentStartWithBounds === undefined) {
      throw new Error();
    }
    this.auxiliary(this.destinationTrackId, this.oldTrackId, this.oldSegmentStartWithBounds);
    return;
  }
  public override redo(): AbstractCommandExecutionResult {
    if (this.isFirstRedoCall) {
      this.auxiliary(this.newTrackId, this.destinationTrackId, this.newSegmentStartWithBounds);
      this.isFirstRedoCall = false;
    } else {
      if (this.oldTrackId === undefined) {
        throw new Error();
      }
      this.auxiliary(this.oldTrackId, this.destinationTrackId, this.newSegmentStartWithBounds);
      return;
    }
  }
}
