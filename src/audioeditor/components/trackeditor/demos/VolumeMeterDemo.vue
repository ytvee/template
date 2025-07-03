<template>
  <div class="volume-meter">
    <!-- <div class="section">
      <h4>Root Mean Squere from frequencities amplitudes (with AnalyseNode)</h4>
      <canvas ref="rmsFreqencitiesAmplitudesLChannel" width="30" height="200"></canvas>
      <canvas ref="rmsFreqencitiesAmplitudesRChannel" width="30" height="200"></canvas>
    </div> -->
    <div class="section">
      <h4>RMS + Peak meter (with AnalyserNode)</h4>
      Root Mean Squere + Peaks with AnalyseNode. RMS window can take fixed values from 0.33ms to 341ms due to AnalyserNode limitations.
      <br />
      RMS - green bar.
      <br />
      Peaks - blue bar.
      <br />
      <div class="accent">
        Choose window size, samples:
        <select id="" name="" :value="masterMixer.analyserNodeVolumeMeter.timeWindowSizeSamples" @input="sampleSizeInputHandler">
          <option v-for="(fftSize, sampleSize) in avaliableSampleSize" :key="sampleSize">{{ sampleSize }}</option>
        </select>
        ~ window size, ms = {{ secondsToMilliseconds(masterMixer.analyserNodeVolumeMeter.timeWindowSizeSeconds) }}ms
      </div>
      <div class="accent">
        allTimePeak: {{ formatNumberWithPlusSign(masterMixer.analyserNodeVolumeMeter.leftChannel.allTimePeak) }}dB allTimePeak: {{ formatNumberWithPlusSign(masterMixer.analyserNodeVolumeMeter.rightChannel.allTimePeak) }}dB
        <button class="audio-editor-button medium-button" @click="resetPeakValuesHandler">resetPeakValues</button>
      </div>

      <div>
        <canvas ref="peakMeterLChannel" width="30" height="200"></canvas>
        <canvas ref="peakMeterRChannel" width="30" height="200"></canvas>
      </div>
    </div>

    <div>
      <h4>RMS + Peaks (with AudioWorkletNode)</h4>
      Root Mean Squere + Peaks with AudioWorkletNode. Lower performance but higher accuracy compared to AnalyserNode.
      <div class="accent">
        Input time window size in samples
        <div class="input-wrapper">
          <input type="text" @input="masterMixerAudioWorkletVolumeMeterInputSamplesHandler" />
        </div>
        or in milliseconds
        <div class="input-wrapper">
          <input type="text" @input="masterMixerAudioWorkletVolumeMeterInputSecondsHandler" />
        </div>
        Current values: {{ masterMixer.audioWorkletVolumeMeter.timeWindowSizeSamples }} samples or {{ secondsToMilliseconds(masterMixer.audioWorkletVolumeMeter.timeWindowSizeSeconds) }} ms
        <br />
        <span v-for="(channel, index) in masterMixer.audioWorkletVolumeMeter.channels"> allTimePeak: {{ formatNumberWithPlusSign(channel.allTimePeak) }}dB </span>
        <button class="audio-editor-button medium-button" @click="masterMixerAudioWorkletVolumeMeterResetPeaksHandler">resetPeakValues</button>
        <div class="canvas-holder">
          <div v-for="(channel, index) in masterMixer.audioWorkletVolumeMeter.channels">
            <canvas :ref="(element) => setCanvasRef(element, index)" width="30" height="200"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { shallowRef } from "vue";
import { mapActions, mapState } from "vuex";

import { formatNumberWithPlusSign } from "@audioeditor/audiomodel/audioeditor/common/miscellaneous";

import { avaliableSampleSize } from "@/audioeditor/audiomodel/audioeditor/common/volumemeters/AbstractAnalyserNodeVisualizer";

import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { MeterChartCanvasPainter } from "@/audioeditor/visualmodel/canvaspainters/MeterChartCanvasPainter";
import { secondsToMilliseconds, millisecondsToSeconds } from "@audioeditor/audiomodel/audioeditor/common/common";

export default {
  name: "VolumeMeterDemo",
  components: {
    // MeterChart,
  },
  data() {
    return {
      peakMeterLChannelPainter: null,
      peakMeterRChannelPainter: null,
      avaliableSampleSize,

      canvasRefs: [],
      audioWorkletVolumeMeterPainters: [],
    };
  },
  mounted() {
    this.peakMeterLChannelPainter = shallowRef(new MeterChartCanvasPainter(this.$refs.peakMeterLChannel));
    this.peakMeterLChannelPainter.drawMeterChart(0, 1, 0.1, 0);
    this.peakMeterRChannelPainter = shallowRef(new MeterChartCanvasPainter(this.$refs.peakMeterRChannel));
    this.peakMeterRChannelPainter.drawMeterChart(0, 1, 0.1, 0);
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      masterMixer: (state) => state.masterMixer,
    }),
  },
  watch: {
    canvasRefs: {
      handler(newCanvasRefs) {
        this.audioWorkletVolumeMeterPainters = [];
        for (const canvasRef of newCanvasRefs) {
          const meterChartCanvasPainter = shallowRef(new MeterChartCanvasPainter(canvasRef));
          meterChartCanvasPainter.value.drawMeterChart(0, 1, 0.1, 0);
          this.audioWorkletVolumeMeterPainters.push(meterChartCanvasPainter);
        }
      },
      deep: true,
    },
    masterMixer: {
      handler(newMixer) {
        this.peakMeterLChannelPainter.drawMeterChart(-50, 5, 5, newMixer.analyserNodeVolumeMeter.leftChannel.volume, newMixer.analyserNodeVolumeMeter.leftChannel.peakVolume);
        this.peakMeterRChannelPainter.drawMeterChart(-50, 5, 5, newMixer.analyserNodeVolumeMeter.rightChannel.volume, newMixer.analyserNodeVolumeMeter.rightChannel.peakVolume);

        if (newMixer.audioWorkletVolumeMeter.channels.length !== this.audioWorkletVolumeMeterPainters.length) {
          return;
        }
        for (let i = 0; i < newMixer.audioWorkletVolumeMeter.channels.length; i++) {
          const channel = newMixer.audioWorkletVolumeMeter.channels[i];
          this.audioWorkletVolumeMeterPainters[i].value.drawMeterChart(-50, 5, 5, channel.rmsPower, channel.currentPeak);
        }
      },
      deep: true,
    },
  },

  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["masterMixerAnalyserNodeVolumeMeterResetPeaks", "masterMixerAnalyserNodeVolumeMeterSetTimeWindowSizeSamples", "masterMixerAudioWorkletVolumeMeterResetPeaks", "masterMixerAudioWorkletVolumeMeterSetParameters"]),
    secondsToMilliseconds,
    resetPeakValuesHandler() {
      this.masterMixerAnalyserNodeVolumeMeterResetPeaks();
    },
    sampleSizeInputHandler(event) {
      this.masterMixerAnalyserNodeVolumeMeterSetTimeWindowSizeSamples(event.target.value);
    },
    formatNumberWithPlusSign,

    /* audioWorkletVolumeMeter */
    audioWorkletVolumeMeterResetPeakValuesHandler() {
      //TODO:
    },
    setCanvasRef(element, index) {
      this.canvasRefs[index] = element;
    },
    masterMixerAudioWorkletVolumeMeterResetPeaksHandler() {
      this.masterMixerAudioWorkletVolumeMeterResetPeaks();
    },
    masterMixerAudioWorkletVolumeMeterInputSamplesHandler(event) {
      this.masterMixerAudioWorkletVolumeMeterSetParameters({ timeWindowSizeSamples: event.target.value });
    },
    masterMixerAudioWorkletVolumeMeterInputSecondsHandler(event) {
      this.masterMixerAudioWorkletVolumeMeterSetParameters({ timeWindowSizeSeconds: millisecondsToSeconds(event.target.value) });
    },
  },
};
</script>

<style scoped>
.accent {
  color: var(--audio-editor-color-white);
}
.input-wrapper {
  display: inline-flex;
  width: 80px;
}
.canvas-holder {
  display: flex;
}
</style>
