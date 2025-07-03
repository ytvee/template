<template>
  <div
    v-if="isWidget"
    class="toggle-switch widget"
    :class="{
      'switched-on': isSwitchedOn,
    }"
    tabindex="0"
    @click="handleClick"
  >
    <div class="label">
      {{ label }}
    </div>
    <div class="toggle-container">
      <div class="toggle-handle off-background-holder">
        <div class="on-background-holder"></div>
        <div class="text-holder">
          {{ toggleHandleLabel }}
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="isLine"
    class="toggle-switch line"
    :class="{
      'switched-on': isSwitchedOn,
      locked: isLocked,
      disabled: isDisabled,
    }"
    tabindex="0"
    @click="handleClick"
  >
    <div class="label">
      {{ label }}
    </div>
    <div class="toggle-container">
      <div class="toggle-handle off-background-holder">
        <div class="on-background-holder"></div>
        <div class="text-holder">
          {{ toggleHandleLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const VARIANT = {
  LINE: "Line",
  WIDGET: "Widget",
};
export default {
  name: "ToggleSwitch",
  props: {
    initialIsSwitchedOn: {
      type: Boolean,
      required: false,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: false,
      default: VARIANT.WIDGET,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isLocked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["toggle-switch-event"],

  data() {
    return {
      isSwitchedOn: false,
      toggleHandleLabel: "OFF",
    };
  },
  computed: {
    isWidget() {
      return this.$props.variant === VARIANT.WIDGET;
    },
    isLine() {
      return this.$props.variant === VARIANT.LINE;
    },
  },
  watch: {
    initialIsSwitchedOn: {
      handler(newInitialIsSwitchedOn) {
        this.isSwitchedOn = newInitialIsSwitchedOn;
      },
      immediate: true,
    },
    isSwitchedOn(newIsSwitchOn) {
      this.setOnOFFLabel(newIsSwitchOn);
      this.$emit("toggle-switch-event", newIsSwitchOn);
    },
  },
  mounted() {
    this.isSwitchedOn = this.$props.initialIsSwitchedOn;
    this.setOnOFFLabel(this.isSwitchedOn);
  },
  methods: {
    handleClick() {
      this.isSwitchedOn = !this.isSwitchedOn;
    },
    setOnOFFLabel(isSwitchOn) {
      if (isSwitchOn) {
        this.toggleHandleLabel = "ON";
      } else {
        this.toggleHandleLabel = "OFF";
      }
    },
  },
};
</script>

<style scoped>
.toggle-switch.widget * {
  --toggle-handle-translation: 30px;
}
.toggle-switch.line * {
  --toggle-handle-translation: 22px;
}
.disabled,
.locked {
  pointer-events: none;
}
/* Widget */
.toggle-switch.widget {
  flex-shrink: 0;
  width: 76px;
  height: 30px;

  border-radius: var(--small-border-radius);
  background: var(--gradient-light-to-dark);

  padding: 1px 4px 4px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;
  outline: 1px solid transparent;
  transition: outline var(--default-transition);
}
.toggle-switch.widget:focus {
  outline: 1px solid var(--color-accent-primary);
  transition: outline var(--default-transition);
}
.toggle-switch.widget .label {
  margin-bottom: 1px;
  font-size: 0.5625rem;
  color: var(--color-light);
  user-select: none;
}
.toggle-switch.widget .toggle-container {
  width: 100%;
  height: 13px;
  flex-shrink: 0;
  border-radius: var(--large-border-radius-2);
  background: var(--color-dark);
  box-shadow: 0px 1px 4px 0px var(--transparent-accent-25);
}
.toggle-handle {
  position: relative;
  width: 38px;
  height: 100%;
  border-radius: var(--large-border-radius-2);

  text-align: center;
  font-size: var(--smallest-font-size);
  font-weight: var(--large-font-weight);
  user-select: none;

  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: var(--default-transition);
}
.toggle-switch.switched-on .toggle-handle {
  transform: translateX(var(--toggle-handle-translation));
  transition: var(--default-transition);
}
.off-background-holder {
  background: var(--color-gray-medium);
}
.on-background-holder {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--large-border-radius-2);
  opacity: 0;
  transition: var(--default-transition);
}
.toggle-switch.switched-on .on-background-holder {
  opacity: 1;
  transition: var(--default-transition);
}
.text-holder {
  position: absolute;
  width: 100%;
  height: 100%;
  color: var(--color-dark);
}
/* Line */
.toggle-switch.line {
  display: flex;
  align-items: center;
  gap: var(--medium-block-gap);
}
.toggle-switch.line .label {
  color: var(--color-light);
  user-select: none;
  font-size: var(--regular-font-size);
  font-weight: var(--small-font-weight);
}
.toggle-switch.line .toggle-container {
  width: 60px;
  height: 13px;
  flex-shrink: 0;
  border-radius: var(--large-border-radius-2);
  background: var(--color-dark);
  box-shadow: 0px 1px 4px 0px var(--transparent-accent-25);
}
</style>
