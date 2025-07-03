import { logger } from "@/plugins/logger/loggerPlugin";

export namespace HotkeyUtils {
  const modifierCodeArray = ["AltLeft", "AltRight", "ControlLeft", "ControlRight", "ShiftLeft", "ShiftRight"] as const;
  type ModifierCode = (typeof modifierCodeArray)[number]; //INFO: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
  type NonModifierCode = "Backspace" | "Tab" | "Enter" | "Pause" | "CapsLock" | "Escape" | "Space" | "PageUp" | "PageDown" | "End" | "Home" | "ArrowLeft" | "ArrowUp" | "ArrowRight" | "ArrowDown" | "PrintScreen" | "Insert" | "Delete" | "Digit0" | "Digit1" | "Digit2" | "Digit3" | "Digit4" | "Digit5" | "Digit6" | "Digit7" | "Digit8" | "Digit9" | "KeyA" | "KeyB" | "KeyC" | "KeyD" | "KeyE" | "KeyF" | "KeyG" | "KeyH" | "KeyI" | "KeyJ" | "KeyK" | "KeyL" | "KeyM" | "KeyN" | "KeyO" | "KeyP" | "KeyQ" | "KeyR" | "KeyS" | "KeyT" | "KeyU" | "KeyV" | "KeyW" | "KeyX" | "KeyY" | "KeyZ" | "MetaLeft" | "MetaRight" | "ContextMenu" | "Numpad0" | "Numpad1" | "Numpad2" | "Numpad3" | "Numpad4" | "Numpad5" | "Numpad6" | "Numpad7" | "Numpad8" | "Numpad9" | "NumpadMultiply" | "NumpadAdd" | "NumpadSubtract" | "NumpadDecimal" | "NumpadDivide" | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12" | "NumLock" | "ScrollLock";
  export type KeyboardCode = ModifierCode | NonModifierCode;

  type Hotkey = Array<KeyboardCode>;
  export type HotkeyString = string; //INFO: codes sorted alphabetically and linked by a '+' sign. Example: "AltLeft+ControlLeft+KeyA"

  type HotkeyAction = (...args: any[]) => ActionCallbacks;
  export type HotkeyPair = { hotkey: Hotkey; action: HotkeyAction };

  export type HotkeySet = Set<KeyboardCode>;
  export type ActionCallbacks = { name: string; repeatStartCallback?: (...args: any[]) => any; endCallback?: (...args: any[]) => any }; //INFO: name field for debug purposes.
  export type HotkeyMapValue = { hotkeySet: HotkeySet; action: HotkeyAction };
  export type HotkeyMap = Map<HotkeyString, HotkeyMapValue>;

  function hotkeyToHotkeyString(hotkey: Hotkey): HotkeyString {
    return hotkey.sort().join("+");
  }

  function hasNoDuplicates(hotkeys: Array<HotkeyPair>, hotkeyMap: HotkeyMap) {
    return hotkeys.length === hotkeyMap.size;
  }

  export function getHotkeyMap(hotkeys: Array<HotkeyPair>): HotkeyMap {
    const hotkeyMap: HotkeyMap = new Map(hotkeys.map((hotkeyPair) => [hotkeyToHotkeyString(hotkeyPair.hotkey), { hotkeySet: new Set(hotkeyPair.hotkey), action: hotkeyPair.action }]));
    if (!hasNoDuplicates(hotkeys, hotkeyMap)) {
      logger.log("warn", "hotkeys", "hotkeys have duplicates");
    }
    return hotkeyMap;
  }

  export function activeKeySetToHotkeyString(activeKeySet: Set<KeyboardCode>): HotkeyString {
    const hotkeyString = Array.from(activeKeySet).sort().join("+");
    return hotkeyString;
  }
}
