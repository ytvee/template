import { provide } from "vue";
import { useEventListener } from "@vueuse/core";

import { HotkeysController, HotkeysControllerOverrideApi } from "./HotkeysController";
import { useHotkeysControllerOverride } from "./useHotkeysControllerOverride";

import { hotkeys } from "./data/hotkeysData";
import { globalRules } from "./data/overrideGlobalRules";

export const HOTKEYS_CONTROLLER_SYMBOL = Symbol("hotkeysController");

function initializeEventListeners(hotkeysController: HotkeysController) {
  useEventListener(window, "blur", () => {
    hotkeysController.windowBlurHandler();
  });
  useEventListener(document, "keydown", (event) => {
    hotkeysController.documentKeydownHandler(event);
  });
  useEventListener(document, "keyup", (event) => {
    hotkeysController.documentKeyupHandler(event);
  });
}
function registerGlobalRules(hotkeysControllerOverrideApi: HotkeysControllerOverrideApi) {
  useHotkeysControllerOverride(globalRules, hotkeysControllerOverrideApi);
}

export function useHotkeysController() {
  const hotkeysController = new HotkeysController(hotkeys);
  initializeEventListeners(hotkeysController);
  provide(HOTKEYS_CONTROLLER_SYMBOL, hotkeysController.getOverrideApi());
  registerGlobalRules(hotkeysController.getOverrideApi());
}
