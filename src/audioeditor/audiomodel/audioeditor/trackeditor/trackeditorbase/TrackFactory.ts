import * as Tone from "customized-tone";
import { UniqueId } from "../../../types";
import { Track, TrackColor } from "./Track";
import { generateUniqueId } from "../../common/common";
import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { SegmentOptions } from "./track/SegmentFactory";
import { AudioEditor } from "../../../AudioEditor";
import { RandomTrackColors } from "./RandomTrackColors";
import { COLORS } from "@/audioeditor/data/constants";
import { BaseTrackEditor } from "../BaseTrackEditor";

type UserSpecifiedTrackOptions = {
  id: UniqueId;

  musicianName: string;
  soundSource: string;

  y: number;
  trackColor: TrackColor;

  trackMixingToolsOptions: TrackMixingToolsOptions;
  segments: Array<SegmentOptions>;
};
export type TrackOptions = Partial<UserSpecifiedTrackOptions>;
export type CompletedTrackOptions = UserSpecifiedTrackOptions & {
  toneAudioContext: Tone.BaseContext;
  outputNode: AudioNode;
};

type TrackMixingToolsOptions = {
  trackVolume?: number;
  trackStereoPanorama?: number;
  trackMuteState?: {
    isMuted?: boolean;
    isSolo?: boolean;
    isMutedBySolo?: boolean;
  };
};

export class TrackFactory {
  public static completeTrackOptionsY(audioEditor: AudioEditor, trackOptionsArray: Array<TrackOptions>, directionToPush?: "top" | "bottom"): Array<TrackOptions> {
    directionToPush = directionToPush ?? "bottom";
    if (directionToPush === "top") {
      const minTrackY = audioEditor.trackEditor.getMinTrackY();
      trackOptionsArray.forEach((trackOptions, index) => {
        if (trackOptions.y !== undefined) {
          return;
        }
        const offset = -(trackOptionsArray.length - 1 - index); //offset from 0
        if (minTrackY === undefined) {
          trackOptions.y = offset;
        } else {
          trackOptions.y = minTrackY - 1 + offset;
        }
      });
    } else {
      const maxTrackY = audioEditor.trackEditor.getMaxTrackY();
      trackOptionsArray.forEach((trackOptions, index) => {
        if (trackOptions.y !== undefined) {
          return;
        }
        const offset = index; //offset from 0
        if (maxTrackY === undefined) {
          trackOptions.y = offset;
        } else {
          trackOptions.y = maxTrackY + 1 + offset;
        }
      });
    }
    return trackOptionsArray;
  }

  private static getTrackColor(trackOptions: TrackOptions, trackEditor: BaseTrackEditor): TrackColor {
    if (trackOptions.trackColor) {
      return structuredClone(trackOptions.trackColor);
    } else {
      if (trackOptions.y === undefined) {
        throw new Error();
      }
      const index = RandomTrackColors.generateTrackColor(trackOptions.y, trackEditor.tracks);
      return {
        index,
        primary: COLORS.TRACK_COLORS[index].primary,
        text: COLORS.TRACK_COLORS[index].text,
      };
    }
  }
  /**
   * This function accepts track which was passed by user and returns track wich is used in AudioEditor internaly
   * @param trackOptions
   */
  private static completeTrackOptions(trackEditor: BaseTrackEditor, toneAudioContext: Tone.BaseContext, outputNode: AudioNode, trackOptions: TrackOptions, isSomeTrackSolo: boolean): CompletedTrackOptions {
    if (trackOptions.y === undefined) {
      throw new Error();
    }
    const trackMixingToolsOptions = structuredClone(trackOptions.trackMixingToolsOptions) ?? {};
    trackMixingToolsOptions.trackMuteState = trackOptions.trackMixingToolsOptions?.trackMuteState ?? {};
    trackMixingToolsOptions.trackMuteState.isMutedBySolo = isSomeTrackSolo;
    const completedTrackOptions: CompletedTrackOptions = {
      ...trackOptions,
      id: trackOptions.id ?? generateUniqueId(),

      musicianName: trackOptions.musicianName ?? AUDIO_EDITOR_CONFIGURATION.tracksEditor.strings.musicianName,
      soundSource: trackOptions.soundSource ?? AUDIO_EDITOR_CONFIGURATION.tracksEditor.strings.soundSource,

      y: trackOptions.y,
      trackColor: this.getTrackColor(trackOptions, trackEditor),
      segments: [],

      trackMixingToolsOptions,
      toneAudioContext: toneAudioContext,
      outputNode: outputNode,
    };
    return completedTrackOptions;
  }

  public static async createTrack(trackEditor: BaseTrackEditor, toneAudioContext: Tone.BaseContext, outputNode: AudioNode, trackOptions: TrackOptions, isSomeTrackSolo: boolean) {
    const completedTrackOptions = this.completeTrackOptions(trackEditor, toneAudioContext, outputNode, trackOptions, isSomeTrackSolo);
    const track = new Track(completedTrackOptions);

    if (trackOptions.segments !== undefined) {
      for (let i = 0; i < trackOptions.segments.length; i++) {
        await track.addSegment(trackOptions.segments[i]);
      }
    }
    return track;
  }
}
