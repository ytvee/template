<template>
  <div class="gradient-range-slider">
    <canvas ref="canvasRef" height="14px" width="94" class="range-slider-canvas"></canvas>
    <input ref="input" :value="value" :min="min" :max="max" type="range" :step="step" @input="inputValueHandler" @beforeChange="beforeChangeHandler" @change="changeValueHandler" @dblclick="dblclickHandler" @pointerdown="emitBeforeChange" />
    <!-- <div class="zero-mark"></div> -->
    <div class="thumb-label-holder" :style="{ left: 'calc( (100% - var(--thumb-width) )*' + normalisedValue(value) + ')' }">
      <p>level: {{ value.toFixed(2) }}</p>
      <div v-if="volumePower !== undefined">
        power: {{ formatNumberWithPlusSign(volumePower) }}
        <div class="unit">dB</div>
      </div>
    </div>
  </div>
</template>

<script>
const DEFALUT_INPUT_VALUE = 1;

import { shallowRef } from "vue";

import { GradientSliderCanvasPainter } from "@/audioeditor/visualmodel/canvaspainters/GradientSliderCanvasPainter";
import { formatNumberWithPlusSign } from "@audioeditor/audiomodel/audioeditor/common/miscellaneous";
export default {
  name: "GradientRangeSlider",
  props: {
    min: {
      type: Number,
      required: false,
      default: 0,
    },
    max: {
      type: Number,
      required: false,
      default: 100,
    },
    value: {
      type: Number,
      required: false,
      default: 50,
    },
    volumePower: {
      type: [Number, undefined],
      required: false,
      default: undefined,
    },
    step: {
      type: Number,
      required: false,
      default: 1,
    },
    volumeMeter: {
      type: Object,
      required: true,
    },
  },
  emits: ["input", "change"],
  data() {
    return {
      gradientSliderCanvasPainter: shallowRef(null),
      oldChangeValue: Number(this.$props.value),
    };
  },
  watch: {
    volumeMeter: {
      handler(newVolumeMeter) {
        this.gradientSliderCanvasPainter.redraw(-50, 5, 0, this.$props.volumeMeter.leftChannel.volume, this.$props.volumeMeter.rightChannel.volume, this.$props.volumeMeter.leftChannel.peakVolume, this.$props.volumeMeter.rightChannel.peakVolume);
      },
      deep: true,
    },
  },
  mounted() {
    this.gradientSliderCanvasPainter = new GradientSliderCanvasPainter(this.$refs.canvasRef);
    this.gradientSliderCanvasPainter.redraw(this.value, this.value);
  },
  unmounted() {
    this.gradientSliderCanvasPainter = null;
  },
  methods: {
    inputValueHandler(event) {
      this.$emit("input", { value: Number(event.target.value) });
    },
    changeValueHandler(event) {
      const newChangeValue = Number(event.target.value);
      if (newChangeValue !== this.oldChangeValue) {
        this.$emit("change", { oldValue: this.oldChangeValue, newValue: newChangeValue });
        this.oldChangeValue = newChangeValue;
      }
    },
    formatNumberWithPlusSign,
    normalisedValue(value) {
      return (value - this.$props.min) / (this.$props.max - this.$props.min);
    },
    dblclickHandler() {
      const input = this.$refs.input;
      input.value = DEFALUT_INPUT_VALUE;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      //  this.$emit("change", { value: 1 });
    },
    emitBeforeChange(event) {
      const beforeChangeValue = Number(event.target.value);
      const customEvent = new CustomEvent("beforeChange", {
        detail: { beforeChangeValue },
      });
      this.$refs.input.dispatchEvent(customEvent);
    },
    beforeChangeHandler(event) {
      this.oldChangeValue = event.detail.beforeChangeValue;
    },
  },
};
</script>

<style scoped>
.gradient-range-slider {
  --thumb-width: 10px;
  width: 94px;
  height: 14px;
  display: flex;
  align-items: center;

  position: relative;
}
.range-slider-canvas {
  position: absolute;
  /* z-index: -1; */
}
input[type="range"] {
  z-index: 3;
  -webkit-appearance: none;
  appearance: none;
  width: 94px;
  height: 4px !important;
  background: transparent;
}
input[type="range"]:focus {
  outline: unset;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 26px;
  width: var(--thumb-width);
  border-radius: var(--small-border-radius);
  border: 2px solid rgba(196, 196, 196, 1);
  box-shadow: 0px 4px 3px 0px var(--transparent-dark-10), 0px 8px 4px 0px var(--transparent-dark-12);

  background: var(--gradient-light-to-dark-4-steps);
  cursor: ew-resize;
}
input[type="range"]:focus::-webkit-slider-thumb {
  background: var(--audio-editor-color-white);
  outline: unset;
}

input[type="range"]::-webkit-slider-runnable-track {
  box-shadow: none;
  border: none;
  background: transparent;
}

.zero-mark {
  position: absolute;
  z-index: 2;
  top: 0;
  left: calc(v-bind("normalisedValue(1)") * 100%);
  height: 100%;
  width: 1px;
  background: var(--audio-editor-color-white);
}

.thumb-label-holder {
  display: none;
  position: absolute;
  bottom: 20px;
  transform: translate(calc(-50% + var(--thumb-width) / 2), 0);

  width: 125px;

  text-wrap: nowrap;
  color: var(--audio-editor-color-white);
  background: var(--audio-editor-color-tooltip-1);
  padding: 4px;
  border-radius: var(--audio-editor-default-border-radius);
}
input[type="range"]:active ~ .thumb-label-holder {
  display: unset;
}
.thumb-label-holder p,
.thumb-label-holder div {
  display: flex;
  justify-content: space-between;
}
.unit {
  text-align: end;
}
</style>
