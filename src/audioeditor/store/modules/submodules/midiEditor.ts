import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";
import { AudioEditor } from "@audioeditor/audiomodel/AudioEditor";
import type { ActionContext } from "vuex";
import { State } from "@/store/store";
export type Context = ActionContext<MidiEditorState, State>;

const MIDI_EDITOR_CONFIGURATION = AUDIO_EDITOR_CONFIGURATION.midiEditor;

type NavigationModel = {
  baseRiskTimeStep: number;
  intermediateRiskCount: number;
  cursorCoordinates: {
    x: number; //seconds
    y: number; //noteUnits. 1 noteUnit = height of one note in pixels.
  };
  currentTime: number;
  isDraggingAudioCursor: boolean;

  audioCursorCoordinates: {
    x: number;
    y: number;
  };
  isDraggingViewPort: boolean;
  viewPortCoordinates: {
    x: number; //seconds
    y: number; //noteUnits
  };

  /* units settings */
  timeScale: number; //seconds per pixel
  noteScale: number; //world pixels per client pixels

  /* playback settings */
  isPlaying: boolean;
  isPlaybackCycled: boolean;
  /* /playback settings */
};
const initialNavigationModel: NavigationModel = {
  isPlaying: false,
  isPlaybackCycled: false,
  baseRiskTimeStep: MIDI_EDITOR_CONFIGURATION.appearance.baseRiskTimeStep,
  intermediateRiskCount: MIDI_EDITOR_CONFIGURATION.appearance.intermediateRiskCount,
  cursorCoordinates: {
    x: MIDI_EDITOR_CONFIGURATION.functionality.initialCursorCoordinates.x,
    y: MIDI_EDITOR_CONFIGURATION.functionality.initialCursorCoordinates.y,
  },
  currentTime: MIDI_EDITOR_CONFIGURATION.functionality.initialCurrentTime,

  audioCursorCoordinates: {
    x: MIDI_EDITOR_CONFIGURATION.functionality.initialAudioCursorCoordinates.x,
    y: MIDI_EDITOR_CONFIGURATION.functionality.initialAudioCursorCoordinates.y,
  },
  isDraggingAudioCursor: false,

  viewPortCoordinates: {
    x: MIDI_EDITOR_CONFIGURATION.functionality.initialViewPortCoordinates.x, //seconds
    y: MIDI_EDITOR_CONFIGURATION.functionality.initialViewPortCoordinates.y, //pixels
  },
  isDraggingViewPort: false,

  /* units settings */
  timeScale: MIDI_EDITOR_CONFIGURATION.appearance.viewportScaleX, //seconds per pixel
  noteScale: 1 / MIDI_EDITOR_CONFIGURATION.appearance.noteWidth, //world pixels per client pixels. notes per pixel
};

export interface MidiEditorState {
  navigationModel: NavigationModel;
}

const midiEditorSubModule = {
  namespaced: true as boolean,
  state: (): MidiEditorState => ({
    navigationModel: initialNavigationModel,
  }),
  mutations: {
    /* navigation */
    setCursorCoordinates(
      state: MidiEditorState,
      {
        offsetPixelsX,
        offsetPixelsY,
      }: {
        offsetPixelsX: number | undefined;
        offsetPixelsY: number | undefined;
      }
    ) {
      if (typeof offsetPixelsX !== "undefined") {
      }
      if (typeof offsetPixelsY !== "undefined") {
      }
    },
    setIsDraggingAudioCursor(state: MidiEditorState, isDraggingAudioCursor: boolean) {
      state.navigationModel.isDraggingAudioCursor = isDraggingAudioCursor;
    },
    /**
     * @param offsetPixelsX shift relative to viewport position in pixels. Optional parametr.
     * @param offsetPixelsY shift relative to viewport position in pixels Optional parametr.
     * @param currentTime seconds, new currentTime to set.
     */
    setAudioCursorCoordinates(
      state: MidiEditorState,
      {
        offsetPixelsX,
        offsetPixelsY,
        currentTime,
      }: {
        offsetPixelsX: number | undefined;
        offsetPixelsY: number | undefined;
        currentTime: number | undefined;
      }
    ) {
      if (state.navigationModel.isDraggingAudioCursor) {
        if (offsetPixelsX !== undefined) {
          // const calculatedCurrentTime: number = state.navigationModel.audioCursorCoordinates.x + convertClientOffsetToWorldOffset(offsetPixelsX, state.navigationModel.viewportScaleX);
          const audioEditor = AudioEditor.getInstance();

          // audioEditor.audioCursorUpdatedHandler(calculatedCurrentTime);
        }
        if (typeof offsetPixelsY !== "undefined") {
          // state.navigationModel.audioCursorCoordinates.y = state.navigationModel.audioCursorCoordinates.y + convertClientOffsetToWorldOffset(offsetPixelsY, state.navigationModel.noteScale);
        }
      }
      if (typeof currentTime !== "undefined") {
        const audioEditor = AudioEditor.getInstance();
        // audioEditor.audioCursorUpdatedHandler(currentTime);
      }
    },
    setIsDraggingViewPort(state: MidiEditorState, isDraggingViewPort: boolean) {
      state.navigationModel.isDraggingViewPort = isDraggingViewPort;
    },
    setViewPortCoordinates(
      state: MidiEditorState,
      {
        offsetPixelsX,
        offsetPixelsY,
      }: {
        offsetPixelsX: number | undefined;
        offsetPixelsY: number | undefined;
      }
    ) {
      if (state.navigationModel.isDraggingViewPort) {
        if (typeof offsetPixelsX !== "undefined") {
          // state.navigationModel.viewportOrigin.x = state.navigationModel.viewportOrigin.x - convertClientOffsetToWorldOffset(offsetPixelsX, state.navigationModel.viewportScaleX);
        }
        if (typeof offsetPixelsY !== "undefined") {
          // state.navigationModel.viewportOrigin.y = state.navigationModel.viewportOrigin.y - convertClientOffsetToWorldOffset(offsetPixelsY, state.navigationModel.noteScale);
        }
      }
    },
    setTimeScale(state: MidiEditorState, timeScale: number) {
      // state.navigationModel.viewportScaleX = timeScale;
    },
    setNoteScale(state: MidiEditorState, noteScale: number) {
      state.navigationModel.noteScale = noteScale;
    },
    setBaseRiskTimeStep(state: MidiEditorState, baseRiskTimeStep: number) {
      state.navigationModel.baseRiskTimeStep = baseRiskTimeStep;
    },
    setIntermediateRiskCount(state: MidiEditorState, intermediateRiskCount: number) {
      state.navigationModel.intermediateRiskCount = intermediateRiskCount;
    },
    updateVisualCurrentTime(state: MidiEditorState, currentTime: number) {
      state.navigationModel.currentTime = currentTime;
      state.navigationModel.audioCursorCoordinates.x = currentTime;
    },
    /* /navigation */
  },
  actions: {
    /* initialization and destruction */
    AudioEditorInitialized(context: Context) {
      // AudioEditor.getInstance().on("current-time-changed", ({ currentTime }) => {
      //   context.commit("updateVisualCurrentTime", currentTime);
      // });
    },
    /* /initialization and destruction */
  },
};

export default midiEditorSubModule;
