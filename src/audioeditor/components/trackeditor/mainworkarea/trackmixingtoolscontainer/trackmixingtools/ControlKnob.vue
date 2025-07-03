<template>
  <div class="control-knob" :class="{ active: isActive }">
    <div ref="controlKnob" class="control-knob-knob" @mousedown.left="mouseDownHandler" @dblclick="dblclickHandler">
      <div class="control-knob-cursor" :style="{ transform: 'rotate(' + rotateAngle + 'deg)' }">
        <svg width="3" height="6" viewBox="0 0 2 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="2" height="6" rx="1" fill="white" />
        </svg>
      </div>
    </div>

    <div class="control-knob-label">
      {{ normalizedValue.toFixed(2) }}
    </div>
  </div>
</template>

<script>
const DEFAULT_KNOB_VALUE = 0;
const MOVE_MULTIPLIER = 0.01; //px

export default {
  name: "ControlKnob",
  props: {
    normalizedValue: {
      type: Number,
      required: true,
    },
  },
  emits: ["input", "change"],
  data() {
    return {
      oldMouseClientX: 0,
      oldMouseClientY: 0,
      circleLength: Math.PI * 2 * 23,
      isActive: false,

      value: this.$props.normalizedValue,
      beforeChangeValue: this.$props.normalizedValue,
    };
  },
  computed: {
    rotateAngle() {
      return this.$props.normalizedValue * 180;
    },
    dasharray() {
      const visibleLength = Math.abs((this.circleLength / 360) * this.rotateAngle);
      return `${visibleLength}, ${this.circleLength - visibleLength}`;
    },
    dashoffset() {
      const visibleLength = Math.abs((this.circleLength / 360) * this.rotateAngle);
      if (this.rotateAngle < 0) {
        return this.circleLength / 4 + visibleLength;
      }
      return this.circleLength / 4;
    },
  },
  mounted() {
    this.value = this.$props.normalizedValue;
    this.beforeChangeValue = this.$props.normalizedValue;
  },
  methods: {
    documentMouseUpHandler() {
      document.removeEventListener("mousemove", this.mouseMoveHandler);
      document.removeEventListener("mousemove", this.documentMouseUpHandler);
      this.emitChange();
      this.isActive = false;
    },
    emitChange() {
      if (this.isActive && this.value !== this.beforeChangeValue) {
        this.$emit("change", { value: this.value, oldValue: this.beforeChangeValue });
      }
    },
    mouseMoveHandler(event) {
      const y = event.y;
      this.value = this.$props.normalizedValue + MOVE_MULTIPLIER * -(y - this.oldMouseClientY);

      if (this.value > 1) {
        this.value = 1;
      } else if (this.value < -1) {
        this.value = -1;
      }
      this.$emit("input", this.value);
      this.oldMouseClientX = event.x;
      this.oldMouseClientY = event.y;
    },
    mouseDownHandler(event) {
      this.oldMouseClientX = event.x;
      this.oldMouseClientY = event.y;
      document.addEventListener("mousemove", this.mouseMoveHandler);
      document.addEventListener("mouseup", this.documentMouseUpHandler);

      this.value = this.$props.normalizedValue;
      this.beforeChangeValue = this.$props.normalizedValue;
      this.isActive = true;
    },
    dblclickHandler() {
      this.value = DEFAULT_KNOB_VALUE;
      this.isActive = true;
      this.emitChange();
      this.isActive = false;
    },
  },
};
</script>

<style scoped>
.control-knob {
  position: relative;
  display: flex;
  justify-content: center;
}
.control-knob-knob {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 26px;
  height: 26px;
  border-radius: var(--border-raduis-circle);

  background: var(--gradient-ui-light);

  user-select: none;
  box-shadow: 0px 4px 3px 0px rgba(0, 0, 0, 0.07), 0px 8px 4px 0px rgba(0, 0, 0, 0.09);
}
.control-knob-cursor {
  display: flex;
  width: 100%;
  height: calc(100% - 8px);
  justify-content: center;
}
.control-knob-label {
  display: none;
  position: absolute;
  bottom: 100%;

  width: 40px;
  text-wrap: nowrap;
  color: var(--audio-editor-color-white);
  background: var(--audio-editor-color-translucent-black-1);
  padding: 2px;
  border-radius: var(--audio-editor-default-border-radius);
}
.control-knob.active .control-knob-label {
  display: unset;
}
</style>
