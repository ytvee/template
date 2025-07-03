<script setup>
import { ref } from "vue";
import CheckMark from "@/components/common/uielements/CheckMark.vue";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { useMapActions, useMapState } from "@/audioeditor/composable/utils/useStoreMaps";
const snapToGridState = useMapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, {
  snapToGrid: (state) => state.snapToGrid,
}).snapToGrid;
const snapToGridActions = useMapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR_NAVIGATION, ["switchSnapToGrid", "setSubdivisionSelectionMethod", "setSnapToGridSubdivision", "setThresholdSelectionMethod", "setSnapToGridThreshold"]);

const snapToGridSubdivision = ref();
const snapToGridThreshold = ref();

function switchGridSnap() {
  snapToGridActions.switchSnapToGrid(!snapToGridState.value.isEnabled);
}
function onChangeSubdivisionSelectionMethod(event) {
  snapToGridActions.setSubdivisionSelectionMethod(event.target.value);
}
function onClickApplySnapToGridSubdivision() {
  snapToGridActions.setSnapToGridSubdivision(Number(snapToGridSubdivision.value));
}
function onChangeThresholdSelectionMethod(event) {
  snapToGridActions.setThresholdSelectionMethod(event.target.value);
}
function onClickApplySnapToGridThreshold() {
  snapToGridActions.setSnapToGridThreshold(Number(snapToGridThreshold.value));
}
</script>

<template>
  <div class="grid-tools-demo">
    <h4>Grid tools demo</h4>

    <div class="toggle" @click="switchGridSnap">
      <div class="check-mark-wrapper">
        <CheckMark :checked="snapToGridState.isEnabled" />
      </div>
      <span>Enable snap to grid</span>
    </div>

    <h5>Choose snap grid subdivision:</h5>
    <label><input type="radio" value="EXPLICIT" :checked="snapToGridState.subdivisionSelectionMethod === 'EXPLICIT'" @change="onChangeSubdivisionSelectionMethod" />explicit subdivision</label>
    <div class="row">
      <input v-model="snapToGridSubdivision" type="text" placeholder="input subdivision" />
      <button class="audio-editor-button" @click="onClickApplySnapToGridSubdivision">apply</button>
    </div>
    Current snap subdivision: {{ snapToGridState.explicitSubdivision }}
    <label><input type="radio" value="CURRENT_GRID_STEP" :checked="snapToGridState.subdivisionSelectionMethod === 'CURRENT_GRID_STEP'" @change="onChangeSubdivisionSelectionMethod" />current grid step</label>

    <h5>Choose snap threshold:</h5>
    <label><input type="radio" value="EXPLICIT" :checked="snapToGridState.thresholdSelectionMethod === 'EXPLICIT'" @change="onChangeThresholdSelectionMethod" />explicit threshold in px</label>
    <div class="row">
      <input v-model="snapToGridThreshold" type="text" placeholder="input threshold px" />
      <button class="audio-editor-button" @click="onClickApplySnapToGridThreshold">apply</button>
    </div>
    Current threshold: {{ snapToGridState.threshold }}
    <label><input type="radio" value="NEAREST" :checked="snapToGridState.thresholdSelectionMethod === 'NEAREST'" @change="onChangeThresholdSelectionMethod" />nearest</label>
  </div>
</template>

<style scoped>
.grid-tools-demo {
  display: flex;
  flex-direction: column;
}
h5 {
  color: var(--audio-editor-color-white);
  font-size: var(--audio-editor-font-text-size);
  font-weight: var(--largest-font-weight);
}
label {
  font: var(--audio-editor-font-text-size);
  color: var(--audio-editor-color-translucent-white-1);
}
.row {
  display: flex;
}
.toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.check-mark-wrapper {
  width: 25px;
  height: 25px;
}
</style>
