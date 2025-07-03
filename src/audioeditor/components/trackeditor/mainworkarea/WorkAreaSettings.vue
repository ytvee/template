<template>
  <div class="work-area-settings">
    <div class="header-holder" @click="isExpanded = !isExpanded">
      <span class="">Settings</span>
    </div>
    <div v-if="isExpanded" class="settings-holder">
      <div class="field">
        <span class="field-key"> timeScale, seconds/px: </span>
        <input id="myRange" v-model="timeScaleSliderValue" type="range" min="0.001" max="0.1" step="0.001" class="slider" />
        <div class="input-holder">
          <input v-model="timeScaleSliderValue" type="text" />
        </div>
      </div>
      <div class="field">
        <span class="field-key"> baseRiskTimeStep, seconds: </span>
        <input id="myRange" v-model="baseRiskTimeStepSliderValue" type="range" min="0.001" max="10" step="0.001" class="slider" />
        <div class="input-holder">
          <input v-model="baseRiskTimeStepSliderValue" type="text" />
        </div>
      </div>
      <div class="field">
        <span class="field-key"> intermediateRiskCount, pieces: </span>
        <input id="myRange" v-model="intermediateRiskCountSliderValue" type="range" min="0" max="50" class="slider" />
        <div class="input-holder">
          <input v-model="intermediateRiskCountSliderValue" type="text" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkAreaSettings",
  props: {
    navigationModel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
      timeScaleSliderValue: this.$props.navigationModel.viewportScaleX,
      baseRiskTimeStepSliderValue: this.$props.navigationModel.absoluteTimeGridOptions.baseRiskTimeStep,
      intermediateRiskCountSliderValue: this.$props.navigationModel.absoluteTimeGridOptions.intermediateRiskCount,
    };
  },
  watch: {
    timeScaleSliderValue: {
      handler(newValue) {
        const newValueNumber = Number(newValue);
        if (newValueNumber > 0) {
          this.$eventBus.emit("work-area-settings-time-scale-update", Number(newValue));
        }
      },
    },
    baseRiskTimeStepSliderValue: {
      handler(newValue) {
        const newValueNumber = Number(newValue);
        if (newValueNumber > 0) {
          this.$eventBus.emit("work-area-settings-base-risk-time-step-update", newValueNumber);
        }
      },
    },
    intermediateRiskCountSliderValue: {
      handler(newValue) {
        this.$eventBus.emit("work-area-settings-intermediate-risk-count-update", Number(newValue));
      },
    },
  },
};
</script>

<style scoped>
.work-area-settings {
  border-radius: var(--audio-editor-default-border-radius);
  background: var(--audio-editor-color-translucent-white-3);

  padding: 5px;
}
.header-holder {
  text-align: end;
  cursor: pointer;
}

.field {
  display: flex;
}
.field > *:first-child {
  margin-right: auto;
}
input[type="range"] {
  width: 300px;
}
.input-holder {
  width: 60px;
  height: 20px;
  text-align: right;
}
.input-holder input {
  height: 100%;
  padding: 0;
  text-align: center;
}
.field > *:last-child {
}
</style>
