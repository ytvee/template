import { NavigationState, SubdivisionSelectionMethod, ThresholdSelectionMethod } from "../navigation";

import { Context } from "../navigation";
import { TimeSignature, TimeUnitType } from "@audioeditor/audiomodel/types";
import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { adaptRiskTimeStepToTimeScale, adaptRiskBeatStepToTimeScale, snapToGrid } from "./navigationFunctions";
import { Controller } from "../../../../../controller/Controller";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";
import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";
import { Point } from "@/audioeditor/visualmodel/types";

/**
 * Methods placed in this object act as a controller between user and AudioEditor (our audio model). The user should be able to call them directly. The scheme is: user -> controller action or mutation -> AudioEditor (or subobjects) send event -> presenter actions or mutataions update reactive state
 * Do not put here internal functions or mutations or actions of store which user should not call directly.
 */
export const controllerMutations = {
  setCursorCoordinates(
    state: NavigationState,
    {
      offsetPixelsX,
      offsetPixelsY,
    }: {
      offsetPixelsX: number | undefined;
      offsetPixelsY: number | undefined;
    }
  ) {
    if (typeof offsetPixelsX !== "undefined") {
      state.cursorCoordinates.x = Transformation.windowToWorld({ x: offsetPixelsX, y: 0 }, state, { x: 0, y: 0 }).x;
    }
    if (typeof offsetPixelsY !== "undefined") {
      state.cursorCoordinates.y = Transformation.windowToWorld({ x: 0, y: offsetPixelsY }, state, { x: 0, y: 0 }).y;
    }
  },
  /**
   * @deprecated do not use
   */
  setIsDraggingAudioCursor(state: NavigationState, isDraggingAudioCursor: boolean) {
    state.isDraggingAudioCursor = isDraggingAudioCursor;
  },
  /**
   * @param offsetPixelsX shift relative to viewport position in pixels. Optional parametr.
   * @param offsetPixelsY shift relative to viewport position in pixels Optional parametr.
   * @param currentTime seconds, new currentTime to set.
   */
  setAudioCursorCoordinates(
    state: NavigationState,
    {
      startAudioCursorCoordinates,
      movementXFromStart,
      movementYFromStart,
      currentTime,
    }: {
      startAudioCursorCoordinates: Point | undefined;
      movementXFromStart: number | undefined;
      movementYFromStart: number | undefined;
      currentTime: number | undefined;
    }
  ) {
    const audioEditor = AudioEditor.getInstance();
    const offsetPixelsX = movementXFromStart;
    const offsetPixelsY = movementYFromStart;
    if (offsetPixelsX !== undefined && offsetPixelsY !== undefined && startAudioCursorCoordinates !== undefined) {
      let calculatedCurrentTime: number = startAudioCursorCoordinates.x + Transformation.windowToWorldDistance({ x: offsetPixelsX, y: 0 }, state, { x: 0, y: 0 }).x;

      if (calculatedCurrentTime < AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder) {
        calculatedCurrentTime = AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder;
      }
      calculatedCurrentTime = snapToGrid(calculatedCurrentTime, state);

      audioEditor.trackEditor.audioCursorUpdatedHandler(calculatedCurrentTime);
      state.audioCursorCoordinates.y = state.audioCursorCoordinates.y + Transformation.windowToWorldDistance({ x: 0, y: offsetPixelsY }, state, { x: 0, y: 0 }).y;
    }

    if (typeof currentTime !== "undefined") {
      if (currentTime < AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder) {
        currentTime = AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder;
      }
      audioEditor.trackEditor.audioCursorUpdatedHandler(currentTime);
    }
  },
  setIsDraggingViewPort(state: NavigationState, isDraggingViewPort: boolean) {
    state.isDraggingViewPort = isDraggingViewPort;
  },
  setViewPortCoordinates(
    state: NavigationState,
    {
      offsetPixelsX,
      offsetPixelsY,
    }: {
      offsetPixelsX: number | undefined;
      offsetPixelsY: number | undefined;
    }
  ) {
    if (state.isDraggingViewPort) {
      if (typeof offsetPixelsX !== "undefined") {
        let updatedViewPortCoordinates = state.viewportOrigin.x - Transformation.windowToWorldDistance({ x: offsetPixelsX, y: 0 }, state, { x: 0, y: 0 }).x; //TODO: use matrix to transform

        if (updatedViewPortCoordinates < AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder) {
          updatedViewPortCoordinates = AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder;
        }
        state.viewportOrigin.x = updatedViewPortCoordinates;
      }
      if (typeof offsetPixelsY !== "undefined") {
        state.viewportOrigin.y = state.viewportOrigin.y - Transformation.windowToWorldDistance({ x: 0, y: offsetPixelsY }, state, { x: 0, y: 0 }).y; //TODO: use matrix to transform
      }
    }
  },
  setViewPortCoordinatesWorld(state: NavigationState, viewportOrigin: Point) {
    state.viewportOrigin.x = viewportOrigin.x;
    state.viewportOrigin.y = viewportOrigin.y;
  },
  setBaseRiskTimeStep(state: NavigationState, { step, power }: { step: number; power: number }) {
    state.absoluteTimeGridOptions.baseRiskTimeStep = step;
    state.absoluteTimeGridOptions.baseRiskTimeStepPower = power;
  },
  setBeatGridTimeStep(state: NavigationState, { step, power, isSubdivided, intermediateRiskCount }: { step: number; power: number; isSubdivided: boolean; intermediateRiskCount: number }) {
    state.beatsTimeGridOptions.baseRiskBeatStep = step;
    state.beatsTimeGridOptions.power = power;
    state.beatsTimeGridOptions.isSubdivided = isSubdivided;
    state.beatsTimeGridOptions.intermediateRiskCount = intermediateRiskCount;
  },
  setIntermediateRiskCount(state: NavigationState, intermediateRiskCount: number) {
    state.absoluteTimeGridOptions.intermediateRiskCount = intermediateRiskCount;
  },
  setTimeUnitType(state: NavigationState, timeUnitType: TimeUnitType) {
    state.timeUnitType = timeUnitType;
  },
  /* /navigation */
};

export const controllerActions = {
  /* navigation */
  setTimeScale(context: Context, { sx, sy, viewportScaleX }: { sx?: number; sy?: number; viewportScaleX?: number }) {
    //TODO: remake timeScale?: number
    let viewportOrigin = structuredClone(context.state.viewportOrigin);
    const oldViewportOrigin = structuredClone(context.state.viewportOrigin);
    if (viewportScaleX !== undefined || sx !== undefined) {
      if (sx !== undefined && viewportScaleX === undefined) {
        const result = Transformation.scaleRelativeToAuxiliaryOrigin(Transformation.formTransformationMatrix(context.state.viewportOrigin.x, context.state.viewportOrigin.y), Transformation.formTransformationMatrix(0, 0, context.state.viewportScaleX, context.state.viewportScaleY), { x: context.state.cursorCoordinates.x, y: context.state.cursorCoordinates.y }, Transformation.formTransformationMatrix(0, 0, sx, sy));

        viewportScaleX = result.updatedObjectScaleMatrix[0][0];
        viewportOrigin = { x: result.updatedObjectTranslationMatrix[0][2], y: result.updatedObjectTranslationMatrix[1][2] };
      } else if (sx === undefined && viewportScaleX !== undefined) {
      } else {
        throw new Error();
      }
      if (viewportScaleX < AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.minTimeScale) {
        viewportScaleX = AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.minTimeScale;
        viewportOrigin = oldViewportOrigin; //TODO: get viewportOrigin for minTimeScale and maxTimeScale
      }
      if (viewportScaleX > AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.maxTimeScale) {
        viewportScaleX = AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.maxTimeScale;
        viewportOrigin = oldViewportOrigin; //TODO: get viewportOrigin for minTimeScale and maxTimeScale
      }
      if (viewportOrigin.x < AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder) {
        viewportOrigin.x = AUDIO_EDITOR_CONFIGURATION.tracksEditor.navigation.functionality.leftWorldBorder;
      }

      context.commit("setViewPortCoordinatesWorld", viewportOrigin);
      context.commit("setTimeScale", viewportScaleX);

      //TODO: move to getter setBaseRiskTimeStep and setBeatGridTimeStep
      const { step, power } = adaptRiskTimeStepToTimeScale(viewportScaleX);
      context.commit("setBaseRiskTimeStep", { step, power });

      const audioEditor = AudioEditor.getInstance();
      const { step: beatStep, power: beatPower, isSubdivided: beatIsSubdivided, intermediateRiskCount: barIntermediateRiskCount } = adaptRiskBeatStepToTimeScale(viewportScaleX, audioEditor.trackEditor.tempo, audioEditor.trackEditor.timeSignature);
      context.commit("setBeatGridTimeStep", { step: beatStep, power: beatPower, isSubdivided: beatIsSubdivided, intermediateRiskCount: barIntermediateRiskCount });
    } else if (sy !== undefined) {
      //TODO:
    } else {
      throw new Error();
    }
  },

  switchSnapToGrid(context: Context, isEnabled: boolean) {
    context.commit("switchSnapToGrid", isEnabled);
  },
  setSubdivisionSelectionMethod(context: Context, method: SubdivisionSelectionMethod) {
    context.commit("setSubdivisionSelectionMethod", method);
  },
  setSnapToGridSubdivision(context: Context, subdivision: string) {
    context.commit("setSnapToGridSubdivision", subdivision);
  },
  setThresholdSelectionMethod(context: Context, method: ThresholdSelectionMethod) {
    context.commit("setThresholdSelectionMethod", method);
  },
  setSnapToGridThreshold(context: Context, threshold: number) {
    context.commit("setSnapToGridThreshold", threshold);
  },
  /* /navigation */

  /* playback */
  play() {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.play();
  },
  pause() {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.pause();
  },
  setIsPlaybackCycled(context: Context, isPlaybackCycled: boolean) {
    const audioEditor = AudioEditor.getInstance();
    audioEditor.trackEditor.isPlaybackCycled = isPlaybackCycled;
    context.commit("setIsPlaybackCycled", audioEditor.trackEditor.isPlaybackCycled);
  },
  setTempo(context: Context, tempo: number) {
    Controller.syncHandleCommand(context, { commandName: "SetTempo", unCompletedCommandArgs: [tempo] });
  },
  setTimeSignature(context: Context, timeSignature: Partial<TimeSignature>) {
    Controller.syncHandleCommand(context, { commandName: "SetTimeSignature", unCompletedCommandArgs: [timeSignature] });
  },
  /* /playback */
};
