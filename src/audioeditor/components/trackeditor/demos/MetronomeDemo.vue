<template>
  <div class="metronome-demo">
    <h4>Metronome demo</h4>
    <label for="metronome-sound">sound</label>
    <select id="metronome-sound" :value="metronome.soundName" @change="soundSelectHanlder">
      <option v-for="sound in metronomeSounds" :key="sound.name" :value="sound.name">{{ sound.name }}</option>
    </select>
    <br />

    <label for="metronome-subdivision-select">choose subdivision</label>
    <select id="metronome-subdivision-select" :value="metronome.subdivisionName" @change="subdivisionSelectHanlder">
      <option v-for="subdivision in metronomeSubdivisions" :key="subdivision.name" :value="subdivision.name">{{ subdivision.name }}</option>
    </select>

    <br />
    <label for="metronome-emphasize-downbeat">emphasizeDownbeat</label>
    <input id="metronome-emphasize-downbeat" name="metronome-emphasize-downbeat" type="checkbox" :checked="metronome.emphasizeDownbeat" @change="changeEmphasizeDownbeat" />
    <br />
    volume {{ metronome.volume }}
    <br />
    <input ref="volumeInput" type="range" :value="metronome.volume" min="0" max="1" step="0.01" @input="volumeInputHandler" @change="volumeChangeHandler" @pointerdown="emitBeforeChange" @beforeChange="beforeChangeHandler" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { metronomeSounds, metronomeSubdivisions } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/metronome/constants";
export default {
  name: "MetronomeDemo",
  data() {
    return {
      metronomeSounds,
      metronomeSubdivisions,

      beforeChangeVolume: 0,
    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      metronome: (state) => state.metronome,
    }),
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["setMetronomeSound", "setMetronomeSubdivision", "setEmphasizeDownbeat", "setMetronomeVolume"]),
    async soundSelectHanlder(event) {
      const soundName = event.target.value;
      await this.setMetronomeSound({ soundName });
    },
    subdivisionSelectHanlder(event) {
      const subdivisionName = event.target.value;
      this.setMetronomeSubdivision({ subdivisionName });
    },
    changeEmphasizeDownbeat(event) {
      const emphasizeDownbeat = event.target.checked;
      this.setEmphasizeDownbeat(emphasizeDownbeat);
    },
    volumeInputHandler(event) {
      const volume = Number(event.target.value);
      this.setMetronomeVolume({ commandArgs: { volume }, controllerOptions: { isOnChange: false } });
    },
    volumeChangeHandler(event) {
      const volume = Number(event.target.value);
      this.setMetronomeVolume({ commandArgs: { volume, oldVolume: this.beforeChangeVolume }, controllerOptions: { isOnChange: true } });
    },
    emitBeforeChange(event) {
      const beforeChangeValue = Number(event.target.value);
      const customEvent = new CustomEvent("beforeChange", {
        detail: { beforeChangeValue },
      });
      this.$refs.volumeInput.dispatchEvent(customEvent);
    },
    beforeChangeHandler(event) {
      this.beforeChangeVolume = event.detail.beforeChangeValue;
    },
  },
};
</script>

<style scoped>
input[type="checkbox"] {
  width: unset;
  height: unset;
}
</style>
