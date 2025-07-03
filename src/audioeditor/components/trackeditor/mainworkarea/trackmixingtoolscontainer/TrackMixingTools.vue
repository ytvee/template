<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="track-mixing-tools" :class="{ 'color-input-focused': isColorInputFocused }">
    <RoundAvatar :avatar-src="userPictureURI()" :track="track" />
    <div class="right-column">
      <div class="right-column-header">
        <div class="insturment-name-input-holder" :class="{ deactivated: !isInstrumentNameInputEnabled }" @dblclick="instrumentNameHolderDblclickHandler">
          <input ref="instrumentNameInput" type="text" :value="track.soundSource.toUpperCase()" @input="instrumentNameHolderInputHandler" @focus="instrumentNameInputFocusHandler" @blur="instrumentNameInputBlurHandler" />
        </div>
        <div class="audio-editor-svg-button" @click="removeTrackButtonHandler()">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 7.79348L2.19522 11.6087C1.95435 11.8478 1.64826 11.9674 1.27696 11.9674C0.905652 11.9674 0.599565 11.8478 0.358696 11.6087C0.119565 11.3696 0 11.0652 0 10.6957C0 10.3261 0.119565 10.0217 0.358696 9.78261L4.17391 5.96739L0.358696 2.19522C0.119565 1.95435 0 1.64826 0 1.27696C0 0.905652 0.119565 0.599565 0.358696 0.358695C0.597826 0.119565 0.902174 0 1.27174 0C1.6413 0 1.94565 0.119565 2.18478 0.358695L6 4.17391L9.77217 0.358695C10.013 0.119565 10.3191 0 10.6904 0C11.0617 0 11.3678 0.119565 11.6087 0.358695C11.8696 0.619565 12 0.929565 12 1.2887C12 1.64783 11.8696 1.94652 11.6087 2.18478L7.79348 5.96739L11.6087 9.77217C11.8478 10.013 11.9674 10.3191 11.9674 10.6904C11.9674 11.0617 11.8478 11.3678 11.6087 11.6087C11.3478 11.8696 11.0383 12 10.68 12C10.3217 12 10.0226 11.8696 9.78261 11.6087L6 7.79348Z" fill="currentColor" />
          </svg>
        </div>
      </div>
      <div class="musician-name-input-holder" :class="{ deactivated: !isMusicianNameInputEnabled }" @dblclick="musicianNameInputHolderDblclickHandler">
        <input ref="musicianNameInput" type="text" :value="user ? user.name : track.musicianName" @input="musicianNameInputHandler" @focus="musicianNameInputFocusHandler" @blur="musicianNameInputBlurHandler" />
      </div>
      <div class="track-mixing-tools-controls">
        <button :class="`switchable-button ${getClassNameIsSelected('muted')}`" @click="muteTrackButtonHandler">M</button>
        <button :class="`switchable-button ${getClassNameIsSelected('solo')}`" @click="soloTrackButtonHandler">S</button>
        <div class="range-slider-wrapper">
          <GradientRangeSlider :min="0" :max="2" :step="0.01" :value="track.visualTrackMixingTools.trackVolume" :volume-power="track.visualTrackMixingTools.trackVolumePower" :volume-meter="track.visualTrackMixingTools.volumeMeter" @input="onInputVolume" @change="onChangeVolume" />
        </div>
        <ControlKnob :normalized-value="track.visualTrackMixingTools.trackStereoPanorama" @input="onInputStereoPanorama" @change="onChangeStereoPanorama" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { AUDIO_EDITOR_CONFIGURATION } from "@audioeditor/data/configuration";

import ControlKnob from "./trackmixingtools/ControlKnob.vue";
import GradientRangeSlider from "./trackmixingtools/GradientRangeSlider.vue";
import RoundAvatar from "@/components/common/user/RoundAvatar.vue";

export default {
  name: "TrackMixingTools",
  components: {
    RoundAvatar,
    GradientRangeSlider,
    ControlKnob,
  },
  props: {
    track: {
      type: Object,
      required: true,
    },
  },
  emits: ["change-solo-state", "changemutestate", "changevolumestate", "changepanoramastate"],
  data() {
    return {
      AUDIO_EDITOR_CONFIGURATION,
      isColorInputFocused: false,

      isInstrumentNameInputEnabled: false,
      instrumentNameBeforeChangeValue: this.$props.track.soundSource,

      isMusicianNameInputEnabled: false,
      musicianNameBeforeChangeValue: this.$props.track.musicianName,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.currentUser,
    }),
    getBackgroundColor() {
      const isMuted = this.$props.track.visualTrackMixingTools.trackMuteState.isMuted;
      const isMutedBySolo = this.$props.track.visualTrackMixingTools.trackMuteState.isMutedBySolo;

      if (isMuted || isMutedBySolo) {
        return AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.mutedBackgroundColor;
      }
      return this.$props.track.trackColor.primary;
    },
    getTextColor() {
      const isMuted = this.$props.track.visualTrackMixingTools.trackMuteState.isMuted;
      const isMutedBySolo = this.$props.track.visualTrackMixingTools.trackMuteState.isMutedBySolo;

      if (isMuted || isMutedBySolo) {
        return AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.mutedTrackColor;
      }
      return this.$props.track.colors.text;
    },
  },
  mounted() {
    this.$eventBus.on("track-mixing-tools-color-input-focus-changed", this.colorInputFocusChangedHandler);
  },
  unmounted() {
    this.$eventBus.off("track-mixing-tools-color-input-focus-changed", this.colorInputFocusChangedHandler);
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["muteTrack", "soloTrack", "removeTracks", "setTrackVolume", "setTrackPanorama", "setTrackSoundSourceName", "setTrackMusicianName"]),
    userPictureURI() {
      return this.user?.pictureURI;
    },
    /* change track attributes */
    instrumentNameHolderDblclickHandler() {
      this.$refs.instrumentNameInput.focus();
    },
    instrumentNameInputFocusHandler(event) {
      this.isInstrumentNameInputEnabled = true;
      this.instrumentNameBeforeChangeValue = event.target.value;
    },
    instrumentNameInputBlurHandler(event) {
      this.isInstrumentNameInputEnabled = false;
      this.setTrackSoundSourceName({ commandArgs: { trackId: this.$props.track.id, soundSource: event.target.value, oldSoundSource: this.instrumentNameBeforeChangeValue }, controllerOptions: { isOnChange: true } });
    },
    instrumentNameHolderInputHandler(event) {
      this.setTrackSoundSourceName({ commandArgs: { trackId: this.$props.track.id, soundSource: event.target.value }, controllerOptions: { isOnChange: false } });
    },
    musicianNameInputHolderDblclickHandler() {
      this.$refs.musicianNameInput.focus();
    },
    musicianNameInputFocusHandler(event) {
      this.isMusicianNameInputEnabled = true;
      this.musicianNameBeforeChangeValue = event.target.value;
    },
    musicianNameInputBlurHandler(event) {
      this.isMusicianNameInputEnabled = false;
      this.setTrackMusicianName({ commandArgs: { trackId: this.$props.track.id, musicianName: event.target.value, oldMusicianName: this.musicianNameBeforeChangeValue }, controllerOptions: { isOnChange: true } });
    },
    musicianNameInputHandler(event) {
      this.setTrackMusicianName({ commandArgs: { trackId: this.$props.track.id, musicianName: event.target.value }, controllerOptions: { isOnChange: false } });
    },
    /* /change track attributes */

    removeTrackButtonHandler() {
      this.removeTracks({ commandArgs: { trackIds: [this.$props.track.id] } });
    },
    getClassNameIsSelected(buttonName) {
      switch (buttonName) {
        case "solo":
          return this.$props.track.visualTrackMixingTools.trackMuteState.isSolo ? "selected" : " ";
        case "muted": {
          return this.$props.track.visualTrackMixingTools.trackMuteState.isMuted ? "selected" : "";
        }
      }
    },
    onInputVolume({ value }) {
      this.setTrackVolume({
        commandArgs: {
          trackId: this.$props.track.id,
          volume: Number(value),
        },
        controllerOptions: { isOnChange: false },
      });
    },
    onChangeVolume({ oldValue, newValue }) {
      this.setTrackVolume({
        commandArgs: {
          trackId: this.$props.track.id,
          volume: Number(newValue),
          oldVolume: Number(oldValue),
        },
        controllerOptions: {
          isOnChange: true,
        },
      });
    },
    onInputStereoPanorama(value) {
      this.setTrackPanorama({
        commandArgs: {
          trackId: this.$props.track.id,
          trackStereoPanorama: value,
        },
        controllerOptions: {
          isOnChange: false,
        },
      });
    },
    onChangeStereoPanorama({ value, oldValue }) {
      this.setTrackPanorama({
        commandArgs: {
          trackId: this.$props.track.id,
          trackStereoPanorama: value,
          oldTrackStereoPanorama: oldValue,
        },
        controllerOptions: {
          isOnChange: true,
        },
      });
    },
    muteTrackButtonHandler() {
      this.muteTrack({ trackId: this.$props.track.id });
    },
    soloTrackButtonHandler() {
      this.soloTrack({ trackId: this.$props.track.id });
    },
    colorInputFocusChangedHandler(isFocused) {
      this.isColorInputFocused = isFocused;
    },
  },
};
</script>

<style scoped>
.track-mixing-tools {
  position: relative;
  width: var(--audio-editor-main-left-column-width);
  height: v-bind("AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackHeight+'px'");
  border-radius: var(--audio-editor-track-mixing-tools-border-radius);
  background: var(--audio-editor-color-translucent-white-2);

  padding: var(--default-padding);

  display: flex;
  justify-content: space-between;
  gap: var(--regular-block-gap);

  user-select: none;
  z-index: 10;

  transition: background-color var(--default-transition);
}
.track-mixing-tools > label {
  padding: 2px;
}
.right-column {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.right-column-header {
  display: flex;
  justify-content: space-between;

  margin-bottom: 4px;
}
.insturment-name-input-holder {
  flex-grow: 1;
  font-family: var(--audio-editor-font-label-small-family);
  font-size: var(--audio-editor-font-label-small-size);
  letter-spacing: var(--audio-editor-font-label-small-letter);

  color: var(--audio-editor-color-translucent-white-1);
}
.insturment-name-input-holder input {
  margin-top: -2px;
  margin-left: -2px;

  padding: 0;
  font-family: var(--audio-editor-font-label-small-family);
  font-size: var(--audio-editor-font-label-small-size);
  font-weight: var(--audio-editor-font-label-small-weight-normal);
  letter-spacing: var(--audio-editor-font-label-small-letter);

  color: var(--audio-editor-color-white);
  transition: color var(--default-transition), border-color var(--default-transition);
}
.insturment-name-input-holder.deactivated input {
  pointer-events: none;
  border-color: transparent;
  color: var(--audio-editor-color-translucent-white-1);
}

.musician-name-input-holder input {
  margin-left: -2px;
  width: calc(100% + 2px);
  padding: 0;

  font-family: var(--audio-editor-font-text-family);
  font-size: var(--audio-editor-font-text-size);
  font-weight: var(--audio-editor-font-text-weight-normal);
  color: var(--audio-editor-color-white);

  color: var(--audio-editor-color-white);
  transition: color var(--default-transition), border-color var(--default-transition);
}
.musician-name-input-holder.deactivated input {
  pointer-events: none;
  border-color: transparent;
  color: var(--audio-editor-color-white);
}

.track-mixing-tools-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.switchable-button {
  all: unset;
  box-sizing: border-box;
  text-align: center;
  margin: 0;

  color: var(--audio-editor-color-translucent-white-1);

  font-family: var(--audio-editor-font-label-family);
  font-size: var(--audio-editor-font-label-size);
  font-weight: var(--largest-font-weight);
  transition: var(--default-transition);

  cursor: pointer;
}
.switchable-button:hover {
  color: var(--audio-editor-color-white);
  transition: var(--default-transition);
}
.switchable-button.selected {
  color: var(--audio-editor-color-white);
  transition: var(--default-transition);
}
.color-input-focused {
  transition: background-color 0s;
}
</style>
