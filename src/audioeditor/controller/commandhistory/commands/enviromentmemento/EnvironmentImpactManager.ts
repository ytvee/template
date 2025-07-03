/**
 * This is "originator" class in memento pattern. "memento" is retuned by redoImpactAndGetMementoSpecializedFunctions and is saved in concrete commands and is used to restore environment by undoImpactWithMementoSpecializedFunctions; "caretaker" - is a concrete commmand, in the process of which objects that are foreign to the main object are affected
 * The environment for each object, in relation to which the command is executed, is its own.
 * Also, the environment depends on the command being executed. For different commands that work with the same objects, it will be different.
 * The purpose of the class is to record changes in enviroment, and not the entire state.
 */

import { UniqueId } from "@/audioeditor/audiomodel/types";
import { CommandNames } from "../CommandFactory";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { Controller, HandleCommandResult } from "@/audioeditor/controller/Controller";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";

/* helpers */
async function createMementoRemoveSegmentsHelper(audioEditor: AudioEditor, context: Context, segmentToRemoveIds: Array<UniqueId>) {
  const segmentToRemoveIdsInSelection = audioEditor.trackEditor.multiSegmentSelection.selection.filter((selectionItem) => segmentToRemoveIds.find((segmentToRemoveId) => segmentToRemoveId === selectionItem.segmentId)).map((selectionItem) => selectionItem.segmentId);

  const handleMultiSegmentSelectionAddItemsCommandResult = await Controller.handleCommandByCommand(context, { commandName: "MultiSegmentSelectionAddItems", unCompletedCommandArgs: [segmentToRemoveIdsInSelection, "substract"] });
  handleMultiSegmentSelectionAddItemsCommandResult.command;

  return handleMultiSegmentSelectionAddItemsCommandResult;
}
/* /helpers */
const redoImpactAndGetMementoSpecializedFunctions = {
  async RemoveTracks(audioEditor: AudioEditor, context: Context, trackToRemoveIds: Array<UniqueId>) {
    const segmentToRemoveIds = audioEditor.trackEditor.getSegmentsInTracks(trackToRemoveIds).map((segment) => segment.id);

    return await createMementoRemoveSegmentsHelper(audioEditor, context, segmentToRemoveIds);
  },
  async RemoveSegments(audioEditor: AudioEditor, context: Context, segmentToRemoveIds: Array<UniqueId>): Promise<HandleCommandResult> {
    return await createMementoRemoveSegmentsHelper(audioEditor, context, segmentToRemoveIds);
  },

  /* main menu */
  SetTempo: () => {},
  SetTimeSignature: () => {},
  SetMasterMixerVolume: () => {},
  /* /main menu */

  /* track */
  AddTracks: () => {},
  SelectTrack: () => {},
  SetTrackSoundSource: () => {},
  SetTrackMusicianName: () => {},
  SetTrackVolume: () => {},
  SetTrackPanorama: () => {},
  SetTrackSolo: () => {},
  SetTrackMute: () => {},
  SetTrackColor: () => {},
  /* /track */

  /* segment */
  AddSegments: () => {},
  MoveEditableSegmentBound: () => {},
  MoveSegment: () => {},
  SetSegmentName: () => {},
  /* /segment */

  /* metronome */
  ToggleMetronome: () => {},
  SetMetronomeSound: () => {},
  SetMetronomeSubdivision: () => {},
  SetMetronomeIsEmphasizeDownBeat: () => {},
  SetMetronomeVolume: () => {},
  /* /metronome */

  /* editing tools */
  MultiSegmentSelectionEndBoxSelection: () => {},
  MultiSegmentSelectionClear: () => {},
  MultiSegmentSelectionAddItems: () => {},
  ScissorsSliceSelection: () => {},
  MoveMultiSegmentSelection: () => {},
  MoveSegmentHelper: () => {},
  RemoveMultiSegmentSelection: () => {},
  CopyMultiSegmentSelection: () => {},
  PasteMultiSegmentSelection: () => {},
  CutMultiSegmentSelection: () => {},
  /* /editing tools */
} as const;

export type RedoImpactAndGetMementoSpecializedFunctions = {
  [K in CommandNames]: (typeof redoImpactAndGetMementoSpecializedFunctions)[K];
};

function getRedoSpecializedFunction<T extends CommandNames>(commandName: T): RedoImpactAndGetMementoSpecializedFunctions[T] {
  return redoImpactAndGetMementoSpecializedFunctions[commandName];
}

export type UndoImpactWithMementoSpecializedFunctions = {
  [K in CommandNames]: (arg: Awaited<ReturnType<RedoImpactAndGetMementoSpecializedFunctions[K]>>) => any;
};
const undoImpactWithMementoSpecializedFunctions: UndoImpactWithMementoSpecializedFunctions = {
  async RemoveTracks(memento) {
    await memento.command.undo();
  },
  async RemoveSegments(memento) {
    await memento.command.undo();
  },

  /* main menu */
  SetTempo: () => {},
  SetTimeSignature: () => {},
  SetMasterMixerVolume: () => {},
  /* /main menu */

  /* track */
  AddTracks: () => {},
  SelectTrack: () => {},
  SetTrackSoundSource: () => {},
  SetTrackMusicianName: () => {},
  SetTrackVolume: () => {},
  SetTrackPanorama: () => {},
  SetTrackSolo: () => {},
  SetTrackMute: () => {},
  SetTrackColor: () => {},
  /* /track */

  /* segment */
  AddSegments: () => {},
  MoveEditableSegmentBound: () => {},
  MoveSegment: () => {},
  SetSegmentName: () => {},
  /* /segment */

  /* metronome */
  ToggleMetronome: () => {},
  SetMetronomeSound: () => {},
  SetMetronomeSubdivision: () => {},
  SetMetronomeIsEmphasizeDownBeat: () => {},
  SetMetronomeVolume: () => {},
  /* /metronome */

  /* editing tools */
  MultiSegmentSelectionEndBoxSelection: () => {},
  MultiSegmentSelectionClear: () => {},
  MultiSegmentSelectionAddItems: () => {},
  ScissorsSliceSelection: () => {},
  MoveMultiSegmentSelection: () => {},
  MoveSegmentHelper: () => {},
  RemoveMultiSegmentSelection: () => {},
  CopyMultiSegmentSelection: () => {},
  PasteMultiSegmentSelection: () => {},
  CutMultiSegmentSelection: () => {},
  /* /editing tools */
} as const;

function getUndoSpecializedFunction<T extends CommandNames>(commandName: T): UndoImpactWithMementoSpecializedFunctions[T] {
  return undoImpactWithMementoSpecializedFunctions[commandName];
}

export class EnvironmentImpactManager {
  public static async redoImpactAndGetMemento<T extends CommandNames>(commandName: T, ...data: Parameters<RedoImpactAndGetMementoSpecializedFunctions[T]>): Promise<ReturnType<RedoImpactAndGetMementoSpecializedFunctions[T]>> {
    const redoSpecializedFunction = getRedoSpecializedFunction(commandName);
    //@ts-ignore
    return (await redoSpecializedFunction(...data)) as ReturnType<RedoImpactAndGetMementoSpecializedFunctions[T]>;
  }

  public static async undoImpactWithMemento<T extends CommandNames>(commandName: T, memento: Awaited<ReturnType<RedoImpactAndGetMementoSpecializedFunctions[T]>>) {
    const undoSpecializedFunction = getUndoSpecializedFunction(commandName);
    await undoSpecializedFunction(memento as Awaited<ReturnType<RedoImpactAndGetMementoSpecializedFunctions[T]>>);
  }
}
