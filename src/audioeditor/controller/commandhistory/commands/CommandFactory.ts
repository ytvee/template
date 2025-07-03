import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { Commands } from ".";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";

const commandRegistry = {
  /* main menu */
  SetTempo: Commands.SetTempo,
  SetTimeSignature: Commands.SetTimeSignature,
  SetMasterMixerVolume: Commands.SetMasterMixerVolume,
  /* /main menu */

  /* track */
  AddTracks: Commands.AddTracks,
  RemoveTracks: Commands.RemoveTracks,
  SelectTrack: Commands.SelectTrack,
  SetTrackSoundSource: Commands.SetTrackSoundSource,
  SetTrackMusicianName: Commands.SetTrackMusicianName,
  SetTrackVolume: Commands.SetTrackVolume,
  SetTrackPanorama: Commands.SetTrackPanorama,
  SetTrackSolo: Commands.SetTrackSolo,
  SetTrackMute: Commands.SetTrackMute,
  SetTrackColor: Commands.SetTrackColor,
  /* /track */

  /* segment */
  AddSegments: Commands.AddSegments,
  RemoveSegments: Commands.RemoveSegments,
  MoveEditableSegmentBound: Commands.MoveEditableSegmentBound,
  SetSegmentName: Commands.SetSegmentName,
  /* /segment */

  /* metronome */
  ToggleMetronome: Commands.ToggleMetronome,
  SetMetronomeSound: Commands.SetMetronomeSound,
  SetMetronomeSubdivision: Commands.SetMetronomeSubdivision,
  SetMetronomeIsEmphasizeDownBeat: Commands.SetMetronomeIsEmphasizeDownBeat,
  SetMetronomeVolume: Commands.SetMetronomeVolume,
  /* /metronome */

  /* editing tools */
  MultiSegmentSelectionEndBoxSelection: Commands.MultiSegmentSelectionEndBoxSelection,
  MultiSegmentSelectionClear: Commands.MultiSegmentSelectionClear,
  MultiSegmentSelectionAddItems: Commands.MultiSegmentSelectionAddItems,
  ScissorsSliceSelection: Commands.ScissorsSliceSelection,

  MoveSegmentHelper: Commands.MoveSegmentHelper,
  MoveSegment: Commands.MoveSegment,
  MoveMultiSegmentSelection: Commands.MoveMultiSegmentSelection,
  RemoveMultiSegmentSelection: Commands.RemoveMultiSegmentSelection,
  CopyMultiSegmentSelection: Commands.CopyMultiSegmentSelection,
  PasteMultiSegmentSelection: Commands.PasteMultiSegmentSelection,
  CutMultiSegmentSelection: Commands.CutMultiSegmentSelection,
  /* /editing tools */
} as const;

export type CommandClasses = typeof commandRegistry;
export type CommandNames = keyof typeof commandRegistry;

export class CommandFactory {
  public static createCommand<CommandName extends CommandNames>(commandName: CommandName, ...args: ConstructorParameters<CommandClasses[CommandName]>): InstanceType<CommandClasses[CommandName]> {
    const CommandClassConstructor: CommandClasses[CommandName] = commandRegistry[commandName];

    // @ts-ignore
    const command: InstanceType<CommandClasses[CommandName]> = new CommandClassConstructor(...args);
    return command;
  }
}
