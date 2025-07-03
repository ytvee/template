import store from "@/store/store";
import { HotkeyUtils } from "../hotkeys";

import { globals } from "@/main";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { moveMultiSegmentSelectionHelper } from "../hotkeyActions/moveMultiSegmentSelectionHelpers";

const testHotkeys: Array<HotkeyUtils.HotkeyPair> = [
  // {hotkey: ["ArrowUp"], action: "testAction1"},
  // {hotkey: ["ControlLeft", "ArrowUp"], action: "testAction2"},
  // {hotkey: ["ControlLeft", "AltLeft", "KeyC"], action: "testAction3"},

  // {hotkey: ["ControlLeft", "KeyC"], action: "testActionC"},
  // {hotkey: ["ControlLeft", "KeyC", "KeyV"], action: "testActionCV"},
  {
    hotkey: ["ArrowUp"],
    action: () => {
      globals.$loggerNotifications.log("success", "hotkeys", "actionArrowUp: start");
      return {
        name: "actionCV",
        repeatStartCallback: () => {
          globals.$loggerNotifications.log("info", "hotkeys", "actionArrowUp: repeatStartCallback: start");
        },
        endCallback: () => {
          globals.$loggerNotifications.log("success", "hotkeys", "actionArrowUp: endCallback: start");
        },
      };
    },
  },

  {
    hotkey: ["ControlLeft", "KeyC", "KeyV"],
    action: () => {
      console.log("actionCV: start");
      return {
        name: "actionCV",
        repeatStartCallback: () => {
          console.log("actionCV: repeatStartCallback: start");
        },
        endCallback: () => {
          console.log("actionCV: endCallback: start");
        },
      };
    },
  },
];

/* track editor hotkeys */
/* navigation hotkeys */
const miscellaneousHotkeys: Array<HotkeyUtils.HotkeyPair> = [
  // {hotkey: "Delete", action: "delete multisegment selection"},
  {
    hotkey: ["Space"],
    action: () => {
      store.state.audioEditor.trackEditor.navigation.isPlaying ? store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION + "/" + "pause") : store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION + "/" + "play");
      return {
        name: "togglePlay",
      };
    },
  },
  {
    hotkey: ["ControlLeft", "KeyZ"],
    action: () => {
      //TODO: think about disable default for keyboard event for avoid collision with built-in input history
      store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "undo");
      return {
        name: "undo",
      };
    },
  },
  {
    hotkey: ["ControlLeft", "KeyY"],
    action: () => {
      store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR + "/" + "redo");
      return {
        name: "redo",
      };
    },
  },
  {
    hotkey: ["ArrowLeft"],
    action: () => {
      const result = moveMultiSegmentSelectionHelper("left");
      return result;
    },
  },
  {
    hotkey: ["ArrowRight"],
    action: () => {
      const result = moveMultiSegmentSelectionHelper("right");
      return result;
    },
  },
  {
    hotkey: ["ArrowUp"],
    action: () => {
      const result = moveMultiSegmentSelectionHelper("up");
      return result;
    },
  },
  {
    hotkey: ["ArrowDown"],
    action: () => {
      const result = moveMultiSegmentSelectionHelper("down");
      return result;
    },
  },
  {
    hotkey: ["Delete"],
    action: () => {
      store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS + "/" + "removeMultiSegmentSelection", {});
      return {
        name: "removeMultiSegmentSelection",
      };
    },
  },
  {
    hotkey: ["ControlLeft", "KeyC"],
    action: () => {
      store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS + "/" + "copyMultiSegmentSelection", {});
      return {
        name: "copy",
      };
    },
  },
  {
    hotkey: ["ControlLeft", "KeyV"],
    action: () => {
      store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS + "/" + "pasteMultiSegmentSelection", {});
      return {
        name: "paste",
      };
    },
  },
  {
    hotkey: ["ControlLeft", "KeyX"],
    action: () => {
      store.dispatch(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_EDITING_TOOLS + "/" + "cutMultiSegmentSelection", {});
      return {
        name: "cut",
      };
    },
  },
];
/* /navigation hotkeys */
/* /track editor hotkeys */

/**
 * Be careful! One combination - one action.
 * Example1 (acceptable):
 * combination1: 'KeyA' action1
 * combination2: 'ControlLeft' plus 'KeyA' action2
 *
 * Example2 (unacceptable):
 * combination1: 'KeyA' action1
 * combination2: 'KeyA' action2
 */
export const hotkeys: Array<HotkeyUtils.HotkeyPair> = [
  ...miscellaneousHotkeys,
  // ...testHotkeys
];
