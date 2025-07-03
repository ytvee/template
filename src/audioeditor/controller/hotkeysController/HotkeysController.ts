import { isSubsetOf } from "@/audioeditor/utils/common";
// import { ActionCallbacks, activeKeySetToHotkeyString, getHotkeyMap, HotkeyMap, HotkeyMapValue, HotkeyPair, HotkeySet, HotkeyString, KeyboardCode } from "./hotkeys";
import { HotkeyUtils } from "./hotkeys";

type ActiveActionMap = Map<HotkeyUtils.HotkeyString, { hotkeySet: HotkeyUtils.HotkeySet; action: HotkeyUtils.ActionCallbacks }>;

type ConditionalFunction = (target: HTMLElement) => boolean;
type ConditionalValue = boolean; //TODO: think about reactive values MaybeRef<T>
type RuleCondition = { conditionFunction: ConditionalFunction } | { conditionValue: ConditionalValue };

export type Rule = {
  condition: RuleCondition;
  override: Array<HotkeyUtils.HotkeyPair>;
  disableDefault: boolean; //INFO: disables all default hotkeys. Only actions from the override will be applied
};
type RuleWithMap = Omit<Rule, "override"> & { override: HotkeyUtils.HotkeyMap };

export type HotkeysControllerOverrideApi = {
  registerRule: (rule: Rule) => () => void;
};

/**
 * designed to be as framework-independent as possible. Therefore, it does not directly use such features as useEventListener from vueuse, other features from vue and vueuse
 * do not use it directly in this project. Use it via useHotkeysController and UseHotkeysControllerOverride composables instead.
 */
export class HotkeysController {
  private hotkeyMap: HotkeyUtils.HotkeyMap;
  private overrideRules: Array<RuleWithMap>;

  private activeKeySet: Set<HotkeyUtils.KeyboardCode>;
  private activeActionMap: ActiveActionMap;

  constructor(hotkeys: Array<HotkeyUtils.HotkeyPair>) {
    this.hotkeyMap = HotkeyUtils.getHotkeyMap(hotkeys);
    this.overrideRules = [];

    this.activeKeySet = new Set();
    this.activeActionMap = new Map();
  }

  /* override api */
  private registerRule = (rule: Rule) => {
    const ruleWithMap = { condition: rule.condition, override: HotkeyUtils.getHotkeyMap(rule.override), disableDefault: rule.disableDefault };
    this.overrideRules.push(ruleWithMap);
    const unregisterRule = () => {
      const index = this.overrideRules.findIndex((ruleInArray) => ruleInArray === ruleWithMap);
      if (index === -1) {
        throw new Error("unregister callback did not found!");
      }
      this.overrideRules.splice(index, 1);
    };
    return unregisterRule;
  };
  public getOverrideApi(): HotkeysControllerOverrideApi {
    return { registerRule: this.registerRule };
  }
  /* /override api */

  private isConditionFunction(value: RuleCondition): value is { conditionFunction: ConditionalFunction } {
    return (value as { conditionFunction: ConditionalFunction }).conditionFunction !== undefined;
  }
  private isConditionValue(value: RuleCondition): value is { conditionFunction: ConditionalFunction } {
    return (value as { conditionValue: ConditionalValue }).conditionValue !== undefined;
  }
  private evaluateCondition(ruleCondition: RuleCondition, event: KeyboardEvent) {
    if (this.isConditionFunction(ruleCondition)) {
      return ruleCondition.conditionFunction(event.target as HTMLElement);
    } else if (this.isConditionValue(ruleCondition)) {
      return ruleCondition.conditionValue;
    } else {
      throw new Error();
    }
  }
  /**
   * Evaluates whether to use standard (not overrided) hotkeys.
   * @param lastActiveOverrideRule
   * @param lastSignificantHotkeyMapValue
   */
  private shouldDefaultHotkeysBeUsed(lastActiveOverrideRule: RuleWithMap | undefined, lastSignificantHotkeyMapValue: HotkeyUtils.HotkeyMapValue | undefined) {
    return lastSignificantHotkeyMapValue === undefined && (!lastActiveOverrideRule || (lastActiveOverrideRule && !lastActiveOverrideRule.disableDefault));
  }
  private handleHotkeyAction(hotkeyString: HotkeyUtils.HotkeyString, hotkeyMapValue: HotkeyUtils.HotkeyMapValue, event: KeyboardEvent) {
    const activeAction = this.activeActionMap.get(hotkeyString);
    if (event.repeat) {
      if (!activeAction) {
        throw new Error("Error on repeat action. The action was expected to already exist, but it was not found in the active action map.");
      }
      if (activeAction.action.repeatStartCallback) {
        activeAction.action.repeatStartCallback();
      }
    } else {
      if (activeAction) {
        throw new Error("Error on non repeat action. It was expected that the action does not exist, but the action was found in the active action map.");
      }
      const action = hotkeyMapValue.action();
      this.activeActionMap.set(hotkeyString, { hotkeySet: hotkeyMapValue.hotkeySet, action });
    }
  }
  private keydownHandler(event: KeyboardEvent) {
    const hotkeyString: HotkeyUtils.HotkeyString = HotkeyUtils.activeKeySetToHotkeyString(this.activeKeySet);
    let lastSignificantHotkeyMapValue: HotkeyUtils.HotkeyMapValue | undefined;
    let lastActiveOverrideRule: RuleWithMap | undefined;
    for (const overrideRule of this.overrideRules) {
      if (this.evaluateCondition(overrideRule.condition, event)) {
        lastActiveOverrideRule = overrideRule;

        const newHotkeyMapValue = overrideRule.override.get(hotkeyString);
        if (newHotkeyMapValue !== undefined) {
          lastSignificantHotkeyMapValue = newHotkeyMapValue;
        }
      }
    }

    if (this.shouldDefaultHotkeysBeUsed(lastActiveOverrideRule, lastSignificantHotkeyMapValue)) {
      lastSignificantHotkeyMapValue = this.hotkeyMap.get(hotkeyString);
    }

    if (lastSignificantHotkeyMapValue) {
      this.handleHotkeyAction(hotkeyString, lastSignificantHotkeyMapValue, event);
    }
  }
  private keyupHandler() {
    for (const [hotkeyString, activeAction] of this.activeActionMap.entries()) {
      if (!isSubsetOf(activeAction.hotkeySet, this.activeKeySet)) {
        if (activeAction.action.endCallback) {
          activeAction.action.endCallback();
        }
        this.activeActionMap.delete(hotkeyString);
      }
    }
  }
  /* keyboard event handlers */
  public windowBlurHandler() {
    this.activeKeySet.clear();
    this.keyupHandler();
  }
  public documentKeydownHandler(event: KeyboardEvent) {
    this.activeKeySet.add(event.code as HotkeyUtils.KeyboardCode);
    this.keydownHandler(event);
  }
  public documentKeyupHandler(event: KeyboardEvent) {
    this.activeKeySet.delete(event.code as HotkeyUtils.KeyboardCode);
    this.keyupHandler();
  }
  /* /keyboard event handlers */
}
