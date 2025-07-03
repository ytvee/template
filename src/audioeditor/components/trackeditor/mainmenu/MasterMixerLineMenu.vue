<template>
  <div class="line-menu master-mixer">
    <div class="line-menu-item">
      <div class="range-slider-wrapper">
        <GradientRangeSlider :min="0" :max="2" :step="0.01" :value="masterMixer.volume" :volume-meter="volumeMeter" @input="onInputVolume" @change="onChangeVolume" />
      </div>
      <div class="value-holder power-holder">
        <span class="value-holder">{{ formatNumberWithPlusSign(masterMixer.volumePower) }}</span>
        dB
      </div>
      <div class="peaks" title="Click to reset reached peaks" @click="resetPeakValuesHandler">
        <div class="channels">
          <div class="value-holder peak-holder">
            L: <span :class="{ danger: lMax > 0 }">{{ formatNumberWithPlusSignNoNegativeInfinity(lMax) }}</span> dB
          </div>
          <div class="value-holder peak-holder">
            R: <span :class="{ danger: rMax > 0 }">{{ formatNumberWithPlusSignNoNegativeInfinity(rMax) }}</span> dB
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { formatNumberWithPlusSign, formatNumberWithPlusSignNoNegativeInfinity } from "@audioeditor/audiomodel/audioeditor/common/miscellaneous";
import GradientRangeSlider from "../mainworkarea/trackmixingtoolscontainer/trackmixingtools/GradientRangeSlider.vue";
export default {
  name: "MasterMixerLineMenu",
  components: {
    GradientRangeSlider,
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      masterMixer: (state) => state.masterMixer,
    }),
    volumeMeter() {
      return {
        leftChannel: {
          volume: this.masterMixer.audioWorkletVolumeMeter.channels[0]?.rmsPower,
          peakVolume: this.masterMixer.audioWorkletVolumeMeter.channels[0]?.currentPeak,
        },
        rightChannel: {
          volume: this.masterMixer.audioWorkletVolumeMeter.channels[1]?.rmsPower,
          peakVolume: this.masterMixer.audioWorkletVolumeMeter.channels[1]?.currentPeak,
        },
      };
    },
    lMax() {
      return this.masterMixer.audioWorkletVolumeMeter.channels[0]?.allTimePeak ?? -Infinity;
    },
    rMax() {
      return this.masterMixer.audioWorkletVolumeMeter.channels[1]?.allTimePeak ?? -Infinity;
    },
  },
  methods: {
    // ...mapMutations(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, []),
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["masterMixerAudioWorkletVolumeMeterResetPeaks", "setMasterMixerVolume"]),
    onInputVolume({ value }) {
      this.setMasterMixerVolume({ commandArgs: { volume: value }, controllerOptions: { isOnChange: false } });
    },
    onChangeVolume(change) {
      this.setMasterMixerVolume({ commandArgs: { volume: change.newValue, oldVolume: change.oldValue }, controllerOptions: { isOnChange: true } });
    },
    formatNumberWithPlusSign,
    formatNumberWithPlusSignNoNegativeInfinity,
    resetPeakValuesHandler() {
      this.masterMixerAudioWorkletVolumeMeterResetPeaks();
    },
  },
};
</script>

<style scoped>
.value-holder span {
  text-align: end;
  color: var(--audio-editor-color-white);
}
.value-holder span.danger {
  color: var(--audio-editor-color-danger-2);
}

.line-menu.master-mixer .line-menu-item {
  cursor: unset;
  gap: var(--smallest-block-gap);
}
.line-menu.master-mixer:hover .line-menu-item {
  color: unset;
}

.range-slider-wrapper {
  padding-left: var(--regular-padding);
}
.power-holder {
  width: 80px;
}

.peaks {
  display: flex;
  cursor: pointer;
}
.peak-holder {
  width: 120px;
}
</style>
