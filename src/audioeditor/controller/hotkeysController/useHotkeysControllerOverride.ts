import { inject, onBeforeUnmount, onMounted } from "vue";
import { HOTKEYS_CONTROLLER_SYMBOL } from "./useHotkeysController";
import { HotkeysControllerOverrideApi } from "./HotkeysController";

function getHotkeysControllerOverrideApi(hotkeysControllerOverrideApi: HotkeysControllerOverrideApi | undefined) {
  if (hotkeysControllerOverrideApi === undefined) {
    throw new Error("useHotkeysController must be initialized first!");
  }
  return hotkeysControllerOverrideApi;
}
/**
 * This function is intended for cases where a component needs special behavior for hotkeys. For example, if a component represents a text input, it should not respond to most hotkeys while it has focus.
 * @param rules create rules for your component and pass them here
 * @param hotkeysControllerOverrideApi paramenter for global rules set. Because we can't use provide/inject within the same component.
 */
export function useHotkeysControllerOverride(rules: Array<any>, hotkeysControllerOverrideApi?: HotkeysControllerOverrideApi) {
  hotkeysControllerOverrideApi = hotkeysControllerOverrideApi ?? inject<HotkeysControllerOverrideApi>(HOTKEYS_CONTROLLER_SYMBOL);

  const unregisterRuleCallbacks: Array<() => void> = [];
  onMounted(() => {
    for (const rule of rules) {
      unregisterRuleCallbacks.push(getHotkeysControllerOverrideApi(hotkeysControllerOverrideApi).registerRule(rule));
    }
  });
  onBeforeUnmount(() => {
    for (const unregisterRule of unregisterRuleCallbacks) {
      unregisterRule();
    }
  });
}
