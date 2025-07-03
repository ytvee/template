import type { ActionContext } from "vuex";
import { State } from "@/store/store";

import { TimeSignature, TimeUnitType } from "@audioeditor/audiomodel/types";
import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";
import { BaseCanvasPainter } from "@/audioeditor/visualmodel/canvaspainters/BaseCanvasPainter";
import { controllerActions, controllerMutations } from "./navigation/controller";
import { presenterActions, presenterMutations } from "./navigation/presenter";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { Point } from "@/audioeditor/visualmodel/types";

const TRACK_EDITOR_CONFIGURATION = AUDIO_EDITOR_CONFIGURATION.tracksEditor;

export type SubdivisionSelectionMethod = "EXPLICIT" | "CURRENT_GRID_STEP";
export type ThresholdSelectionMethod = "EXPLICIT" | "NEAREST";
type SnapToGrid = {
  isEnabled: boolean;
  subdivisionSelectionMethod: SubdivisionSelectionMethod;
  explicitSubdivision: number;
  thresholdSelectionMethod: ThresholdSelectionMethod;
  threshold: number;
};
export type AbsoluteTimeGridOptions = {
  baseRiskTimeStep: number;
  baseRiskTimeStepPower: number; //0.01 ~ -2; 0.1 ~ -1; 1 ~ 0; 10 ~ 1; 100 ~ 2 and so on
  intermediateRiskCount: number;
};
export type BeatsTimeGridOptions = {
  baseRiskBeatStep: number; //in bars
  intermediateRiskCount: number;
  power: number;
  isSubdivided: boolean;

  tempo: number;
  timeSignature: TimeSignature;
};

export type ViewportState = {
  //TODO: use ObjectTransformations instead of this implementation.
  viewportOrigin: Point;
  viewportScaleX: number;
  viewportScaleY: number;
};

export interface NavigationState {
  timeUnitType: TimeUnitType;
  secondaryTimeLineTimeUnitType: TimeUnitType;
  absoluteTimeGridOptions: AbsoluteTimeGridOptions;
  beatsTimeGridOptions: BeatsTimeGridOptions;

  cursorCoordinates: Point; //x seconds; y trackUnits. 1 trackUnit = height of one track + vertical gap between tracks in px.
  currentTime: number;
  isDraggingAudioCursor: boolean;

  audioCursorCoordinates: {
    x: number;
    y: number;
  };
  isDraggingViewPort: boolean; //TODO: need to be removed. Do not use anymore! Use useClickAndDrag composable instead!
  viewportOrigin: {
    x: number; //seconds
    y: number; //trackUnits
  };
  viewportScaleX: number; //seconds per pixel
  viewportScaleY: number; //world pixels per client pixels

  snapToGrid: SnapToGrid;

  /* playback settings */
  isPlaying: boolean;
  isPlaybackCycled: boolean;
  /* /playback settings */
}
export type Context = ActionContext<NavigationState, State>;

function getInitialNavigationState(): NavigationState {
  return {
    snapToGrid: {
      //TODO: get value from config
      isEnabled: AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.snapToGrid.isEnabled,
      subdivisionSelectionMethod: AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.snapToGrid.subdivisionSelectionMethod,
      explicitSubdivision: AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.snapToGrid.explicitSubdivision,
      thresholdSelectionMethod: AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.snapToGrid.thresholdSelectionMethod,
      threshold: AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.snapToGrid.explicitThreshold,
    },
    isPlaying: false,
    isPlaybackCycled: false,

    timeUnitType: TRACK_EDITOR_CONFIGURATION.appearance.timeUnitType,
    secondaryTimeLineTimeUnitType: TRACK_EDITOR_CONFIGURATION.secondaryTimeLine.appearance.timeUnitType,
    absoluteTimeGridOptions: {
      baseRiskTimeStep: TRACK_EDITOR_CONFIGURATION.appearance.baseRiskTimeStep,
      baseRiskTimeStepPower: 0,
      intermediateRiskCount: TRACK_EDITOR_CONFIGURATION.appearance.intermediateRiskCount,
    },
    beatsTimeGridOptions: {
      baseRiskBeatStep: 1,
      intermediateRiskCount: 1,
      power: 0,
      isSubdivided: false,

      tempo: TRACK_EDITOR_CONFIGURATION.functionality.tempo,
      timeSignature: TRACK_EDITOR_CONFIGURATION.functionality.timeSignature,
    },
    cursorCoordinates: {
      x: 0, //seconds
      y: 0, //pixels
    },
    currentTime: 0,
    audioCursorCoordinates: {
      x: 0,
      y: 0,
    },
    isDraggingAudioCursor: false,

    /* viewport object transformation */
    viewportOrigin: {
      x: 0, //seconds
      y: 0, //pixels
    },
    viewportScaleX: TRACK_EDITOR_CONFIGURATION.appearance.viewportScaleX, //seconds per pixel
    viewportScaleY: TRACK_EDITOR_CONFIGURATION.appearance.trackScale,
    /* /viewport object transformation */

    isDraggingViewPort: false,
  };
}

const navigationModule = {
  namespaced: true as boolean,
  state: (): NavigationState => getInitialNavigationState(),
  getters: {
    formattedCurrentTime(state: NavigationState) {
      return BaseCanvasPainter.getRiskLabelByRiskTimeMISSMS(
        //use canvas utilites to formatt current time
        state.currentTime,
        -2
      );
    },
  },
  mutations: {
    ...controllerMutations,
    ...presenterMutations,
    /**
     * Below are mutations which user or model should not call directly
     */
    /* initialization */
    resetState(state: NavigationState) {
      Object.assign(state, getInitialNavigationState());
    },
    /* /initialization */

    /* navigation */
    setTimeScale(state: NavigationState, viewportScaleX: number) {
      state.viewportScaleX = viewportScaleX;
    },
    switchSnapToGrid(state: NavigationState, isEnabled: boolean) {
      state.snapToGrid.isEnabled = isEnabled;
    },
    setSubdivisionSelectionMethod(state: NavigationState, method: SubdivisionSelectionMethod) {
      state.snapToGrid.subdivisionSelectionMethod = method;
    },
    setSnapToGridSubdivision(state: NavigationState, subdivision: number) {
      state.snapToGrid.explicitSubdivision = subdivision;
    },
    setThresholdSelectionMethod(state: NavigationState, method: ThresholdSelectionMethod) {
      state.snapToGrid.thresholdSelectionMethod = method;
    },
    setSnapToGridThreshold(state: NavigationState, threshold: number) {
      state.snapToGrid.threshold = threshold;
    },
    /* /navigation */

    /* playback */
    setIsPlaybackCycled(state: NavigationState, isPlaybackCycled: boolean) {
      state.isPlaybackCycled = isPlaybackCycled;
    },
    setTempo(state: NavigationState, tempo: number) {
      state.beatsTimeGridOptions.tempo = tempo;
    },
    setTimeSignature(state: NavigationState, timeSignature: TimeSignature) {
      state.beatsTimeGridOptions.timeSignature.upper = timeSignature.upper;
      state.beatsTimeGridOptions.timeSignature.lower = timeSignature.lower;
    },
    /* /playback */
  },
  actions: {
    ...controllerActions,
    ...presenterActions,
    /**
     * Below are actions which user or model should not call directly
     */
    initializeNavigation(context: Context) {
      context.dispatch("setTimeScale", { viewportScaleX: AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.viewportScaleX });
      const audioEditor = AudioEditor.getInstance();

      audioEditor.trackEditor.eventEmitter.on("render", ({ transportTime }) => {
        context.commit("updateVisualCurrentTime", transportTime);
      });
      audioEditor.on("playback-started", () => {
        context.commit("setIsPlaying", true);
      });
      audioEditor.on("playback-paused", () => {
        context.commit("setIsPlaying", false);
      });
    },
    resetModule(context: Context) {
      context.commit("resetState");
    },
  },
};
export default navigationModule;
