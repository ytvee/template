import JSZip, { JSZipObject } from "jszip";
import { TimeSignature, UniqueId } from "../../../types";
import { BaseTrackEditor } from "../BaseTrackEditor";
import { Track, TrackColor } from "./Track";
import { Segment, SegmentEditingTools } from "./track/Segment";
import { SegmentOptions } from "./track/SegmentFactory";
import { TrackOptions } from "./TrackFactory";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { Controller } from "@/audioeditor/controller/Controller";
import { Context } from "@/audioeditor/store/modules/submodules/trackEditor";

type MasterMixerSave = {
  volume: number;
};
export type SegmentSave = {
  id: UniqueId;
  name: string;
  url: string;
  startPosition: number;
  segmentEditingTools: SegmentEditingTools;
};
type TrackMixingToolsSave = {
  trackVolume: number;
  trackStereoPanorama: number;
  trackMuteState: {
    isMuted: boolean;
    isSolo: boolean;
    isMutedBySolo: boolean;
    isMutedEventually: boolean;
  };
};
export type TrackSave = {
  id: UniqueId;
  y: number;
  trackColor: TrackColor;
  musicianName: string;
  soundSource: string;
  segments: Array<SegmentSave>;
  trackMixingTools: TrackMixingToolsSave;
};
export type TrackEditorSave = {
  masterMixer: MasterMixerSave;
  selectedTrackId: UniqueId | null;
  timeSignature: TimeSignature;
  tempo: number;
  tracks: Array<TrackSave>;
};

export const SAVE_FILE_PROJECT_NAME = "project.zip";
enum SAVE_FILE_NAMES {
  PROJECT_JSON = "project.json",
  RESOURCES = "resources",
  SEGMENTS = "segments",
}

type TrackEditorSaveResources = {
  segmentResources: Map<UniqueId, Blob>;
};
type TrackEditorSaveWithResources = {
  project: TrackEditorSave;
  resources: TrackEditorSaveResources;
};
type SaveLoadManagerOptions = {
  isZip?: boolean;
};

export class SaveLoadManager {
  /* save */
  public static getSegmentSaveBySegment(segment: Segment, options?: SaveLoadManagerOptions): SegmentSave {
    return {
      id: segment.id,
      name: segment.name,
      url: options?.isZip ? "" : segment.url,
      startPosition: segment.startPosition,
      segmentEditingTools: structuredClone(segment.segmentEditingTools),
    };
  }
  public static getTrackSaveByTrack(track: Track, options?: SaveLoadManagerOptions): TrackSave {
    return {
      id: track.id,
      y: track.y,
      trackColor: structuredClone(track.trackColor),
      musicianName: track.musicianName,
      soundSource: track.soundSource,
      segments: Array.from(track.segments.values()).map((segment) => this.getSegmentSaveBySegment(segment, options)),
      trackMixingTools: structuredClone(track.trackMixingTools),
    };
  }
  public static saveTrackEditorToJson(trackEditor: BaseTrackEditor, options?: SaveLoadManagerOptions): TrackEditorSave {
    return {
      masterMixer: {
        volume: trackEditor.masterMixer.volume,
      },
      selectedTrackId: trackEditor.selectedTrackId,
      timeSignature: structuredClone(trackEditor.timeSignature),
      tempo: trackEditor.tempo,
      tracks: Array.from(trackEditor.tracks.values()).map((track) => this.getTrackSaveByTrack(track, options)),
    };
  }
  /* /save */

  /* load */
  public static getSegmentOptionsBySegmentSave(segmentSave: SegmentSave, resources?: TrackEditorSaveResources, options?: SaveLoadManagerOptions): SegmentOptions {
    let url = segmentSave.url;
    if (options && resources && options.isZip) {
      const segmentBlob = resources.segmentResources.get(segmentSave.id);
      if (segmentBlob) {
        url = URL.createObjectURL(segmentBlob);
      }
    }
    return {
      id: segmentSave.id,
      name: segmentSave.name,
      url: url,
      startPosition: segmentSave.startPosition,
      segmentEditingTools: structuredClone(segmentSave.segmentEditingTools),
    };
  }
  public static getTrackOptionsByTrackSave(trackSave: TrackSave, resources?: TrackEditorSaveResources, options?: SaveLoadManagerOptions): TrackOptions {
    return {
      id: trackSave.id,
      y: trackSave.y,
      trackColor: structuredClone(trackSave.trackColor),
      musicianName: trackSave.musicianName,
      soundSource: trackSave.soundSource,
      segments: trackSave.segments.map((segmentSave) => this.getSegmentOptionsBySegmentSave(segmentSave, resources, options)),
      trackMixingToolsOptions: structuredClone(trackSave.trackMixingTools),
    };
  }
  private static async loadTrackByTrackSave(trackEditor: BaseTrackEditor, trackSave: TrackSave, resources?: TrackEditorSaveResources, options?: SaveLoadManagerOptions) {
    //TODO: is isZip option really used?
    await trackEditor.addTrack(this.getTrackOptionsByTrackSave(trackSave, resources, options));
  }
  public static async loadTrackEditorSave(trackEditor: BaseTrackEditor, save: TrackEditorSave, resources?: TrackEditorSaveResources, options?: SaveLoadManagerOptions) {
    trackEditor.masterMixer.setVolume(save.masterMixer.volume, true);

    trackEditor.selectedTrackId = save.selectedTrackId;
    trackEditor.timeSignature = save.timeSignature;

    for (let i = 0; i < save.tracks.length; i++) {
      const trackSave = save.tracks[i];
      await this.loadTrackByTrackSave(trackEditor, trackSave, resources, options);
    }
  }
  /* /load */

  /* auxiliary */
  private static async getResources(trackEditor: BaseTrackEditor): Promise<TrackEditorSaveResources> {
    const resources: TrackEditorSaveResources = { segmentResources: new Map() };
    for (const track of trackEditor.tracks.values()) {
      for (const segment of track.segments.values()) {
        const segmentBlob = await fetch(segment.url).then((result) => result.blob());
        resources.segmentResources.set(segment.id, segmentBlob);
      }
    }
    return resources;
  }
  private static async getSaveWithResources(trackEditor: BaseTrackEditor): Promise<TrackEditorSaveWithResources> {
    const saveJson = this.saveTrackEditorToJson(trackEditor, { isZip: true });
    const resources = await this.getResources(trackEditor);
    return {
      project: saveJson,
      resources,
    };
  }
  /* /auxiliary */

  /* save/load to/from zip file */
  public static async saveTrackEditorToZip(trackEditor: BaseTrackEditor): Promise<Blob> {
    const saveWithResources = await this.getSaveWithResources(trackEditor);

    const jsZip = new JSZip();
    jsZip.file(SAVE_FILE_NAMES.PROJECT_JSON, JSON.stringify(saveWithResources.project)); //TODO: files and folders name to enumeration
    const jsZipResources = jsZip.folder(SAVE_FILE_NAMES.RESOURCES);
    if (!jsZipResources) {
      throw new Error();
    }
    const jsZipSegments = jsZipResources.folder(SAVE_FILE_NAMES.SEGMENTS);
    for (const segment of saveWithResources.resources.segmentResources) {
      jsZipSegments?.file(segment[0], segment[1]);
    }
    const zipBlob = await jsZip.generateAsync({ type: "blob" });

    return zipBlob;
  }

  private static async unzipProject(zipSave: Blob): Promise<{ save: TrackEditorSave; resources: TrackEditorSaveResources }> {
    const jsZip = new JSZip();
    const unzipResult = await jsZip.loadAsync(zipSave, { createFolders: true });
    const projectJsonString = await unzipResult.files[SAVE_FILE_NAMES.PROJECT_JSON].async("string");
    const projectJson = JSON.parse(projectJsonString);

    const segmentsFolder = unzipResult.folder(SAVE_FILE_NAMES.RESOURCES)?.folder(SAVE_FILE_NAMES.SEGMENTS);

    if (!segmentsFolder) {
      throw new Error();
    }
    const segmentJsZipFiles: Array<{ name: string; jsZipFile: JSZipObject }> = [];
    segmentsFolder.forEach((path, file) => {
      segmentJsZipFiles.push({ name: path, jsZipFile: file });
    });
    const segmentBlobs: Map<string, Blob> = new Map();
    for (let i = 0; i < segmentJsZipFiles.length; i++) {
      const blob = await segmentJsZipFiles[i].jsZipFile.async("blob");
      segmentBlobs.set(segmentJsZipFiles[i].name, blob);
    }

    const resources = { segmentResources: segmentBlobs };
    return {
      save: projectJson,
      resources,
    };
  }
  private static async loadTrackToWorkSpace(trackEditor: BaseTrackEditor, trackSave: TrackSave, resources?: TrackEditorSaveResources) {
    const trackOptions = this.getTrackOptionsByTrackSave(trackSave, resources, { isZip: true });
    await Controller.handleCommand(null, { commandName: "AddTracks", unCompletedCommandArgs: [[trackOptions], "bottom"], controllerOptions: { isCalledByCommand: true } });
  }
  private static async loadToWorkSpace(save: TrackEditorSave, resources?: TrackEditorSaveResources) {
    const trackEditor = AudioEditor.getInstance().trackEditor;
    await Controller.handleCommand({} as Context, { commandName: "SetMasterMixerVolume", unCompletedCommandArgs: [save.masterMixer.volume, undefined, { isSharp: true }], controllerOptions: { isCalledByCommand: true } });
    await Controller.handleCommand({} as Context, { commandName: "SetTimeSignature", unCompletedCommandArgs: [save.timeSignature], controllerOptions: { isCalledByCommand: true } });

    //TODO: set tempo
    await Controller.handleCommand({} as Context, { commandName: "SetTempo", unCompletedCommandArgs: [save.tempo], controllerOptions: { isCalledByCommand: true } });

    for (let i = 0; i < save.tracks.length; i++) {
      const trackSave = save.tracks[i];
      await this.loadTrackToWorkSpace(trackEditor, trackSave, resources);
    }

    await Controller.handleCommand({} as Context, { commandName: "SelectTrack", unCompletedCommandArgs: [save.selectedTrackId], controllerOptions: { isCalledByCommand: true } });
  }
  public static async loadTrackEditorZipSave(trackEditor: BaseTrackEditor, zipSave: Blob) {
    const { save, resources } = await this.unzipProject(zipSave);
    await this.loadToWorkSpace(save, resources);
  }
  /* / save/load to/from zip file */

  /* save/load to/from backend (simple) */
  public static async getSaveForBackend(trackEditor: BaseTrackEditor): Promise<TrackEditorSaveWithResources> {
    const saveWithResources = await this.getSaveWithResources(trackEditor);
    return saveWithResources;
  }
  public static async loadTrackEditorBackendSave(name: string, metadata: TrackEditorSave, segments: Record<string, string>): Promise<void> {
    // const resources: TrackEditorSaveResources = {
    //   segmentResources:
    // }
    for (const track of metadata.tracks) {
      for (const segment of track.segments) {
        segment.url = segments[segment.id];
      }
    }
    await this.loadToWorkSpace(metadata);
  }
  /* / save/load to/from backend (simple) */
}
