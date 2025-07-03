<template>
  <div class="audio-segment">
    <div class="left-side-audio-segment">
      <div class="waveform-play-button-wrapper" @click="playAudioHandle()">
        <svg v-if="!segment?.information.isPlaying" width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.666748 10.3128V1.68783C0.666748 1.45172 0.750082 1.25366 0.916748 1.09366C1.08341 0.933662 1.27786 0.85394 1.50008 0.854495C1.56953 0.854495 1.64258 0.864773 1.71925 0.885329C1.79591 0.905884 1.86869 0.937273 1.93758 0.979495L8.72925 5.29199C8.85425 5.37533 8.94814 5.47949 9.01091 5.60449C9.07369 5.72949 9.1048 5.86144 9.10425 6.00033C9.10369 6.13922 9.07258 6.27116 9.01091 6.39616C8.94925 6.52116 8.85536 6.62533 8.72925 6.70866L1.93758 11.0212C1.86814 11.0628 1.79536 11.0942 1.71925 11.1153C1.64314 11.1364 1.57008 11.1467 1.50008 11.1462C1.27786 11.1462 1.08341 11.0662 0.916748 10.9062C0.750082 10.7462 0.666748 10.5484 0.666748 10.3128Z" fill="currentColor" />
        </svg>
        <svg v-else width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.33333 11.6667C7.875 11.6667 7.48278 11.5036 7.15667 11.1775C6.83056 10.8514 6.66722 10.4589 6.66667 10V1.66667C6.66667 1.20833 6.83 0.816112 7.15667 0.490001C7.48333 0.16389 7.87556 0.000556968 8.33333 1.41243e-06C8.79111 -0.000554143 9.18361 0.162779 9.51083 0.490001C9.83806 0.817223 10.0011 1.20945 10 1.66667V10C10 10.4583 9.83694 10.8508 9.51083 11.1775C9.18472 11.5042 8.79222 11.6672 8.33333 11.6667ZM1.66667 11.6667C1.20833 11.6667 0.816111 11.5036 0.49 11.1775C0.163889 10.8514 0.000555556 10.4589 0 10V1.66667C0 1.20833 0.163333 0.816112 0.49 0.490001C0.816667 0.16389 1.20889 0.000556968 1.66667 1.41243e-06C2.12444 -0.000554143 2.51694 0.162779 2.84417 0.490001C3.17139 0.817223 3.33444 1.20945 3.33333 1.66667V10C3.33333 10.4583 3.17028 10.8508 2.84417 11.1775C2.51806 11.5042 2.12556 11.6672 1.66667 11.6667Z" fill="currentColor" />
        </svg>
      </div>
      <div class="audio-segment-track-duration">{{ chatHistory[message.messageId]?.foundedAudios[audioIndex]?.information.currentTime }}</div>
      <div class="waveform-container-wrapper">
        <span v-if="chatHistory[message.messageId]?.foundedAudios[audioIndex]?.information.isLoading">Loading...</span>
        <keep-alive>
          <div :ref="'waveformContainer-msg-' + `${message.messageId}-audio-${audioIndex}`" :class="'waveform-container waveformContainer-msg-' + `${message.messageId}-audio-${audioIndex}`"></div>
        </keep-alive>
      </div>
    </div>
    <div class="right-side-audio-segment">
      <div class="icon-like" :class="segment?.information.rating === 1 ? 'clicked' : 'not-clicked'" @click="changeTrackRating('like')">
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.9069 5.3335C15.2625 5.3335 15.5736 5.46684 15.8402 5.7335C16.1069 6.00017 16.2402 6.31128 16.2402 6.66684V8.00017C16.2402 8.07795 16.2318 8.16128 16.2149 8.25017C16.198 8.33906 16.1731 8.42239 16.1402 8.50017L14.1402 13.2002C14.0402 13.4224 13.8736 13.6113 13.6402 13.7668C13.4069 13.9224 13.1625 14.0002 12.9069 14.0002H7.57357C7.2069 14.0002 6.89312 13.8697 6.63223 13.6088C6.37135 13.3479 6.24068 13.0339 6.24023 12.6668V5.8835C6.24023 5.70572 6.27646 5.53639 6.3489 5.3755C6.42135 5.21461 6.51846 5.07284 6.64023 4.95017L10.2569 1.35017C10.4236 1.19461 10.6209 1.10017 10.8489 1.06684C11.0769 1.0335 11.2962 1.07239 11.5069 1.1835C11.7176 1.29461 11.8705 1.45017 11.9656 1.65017C12.0607 1.85017 12.08 2.05573 12.0236 2.26684L11.2736 5.3335H14.9069ZM3.57357 14.0002C3.2069 14.0002 2.89312 13.8697 2.63223 13.6088C2.37135 13.3479 2.24068 13.0339 2.24023 12.6668V6.66684C2.24023 6.30017 2.3709 5.98639 2.63223 5.7255C2.89357 5.46461 3.20735 5.33395 3.57357 5.3335C3.93979 5.33306 4.25379 5.46372 4.51557 5.7255C4.77735 5.98728 4.90779 6.30106 4.9069 6.66684V12.6668C4.9069 13.0335 4.77646 13.3475 4.51557 13.6088C4.25468 13.8702 3.94068 14.0006 3.57357 14.0002Z"
            fill="white"
          />
        </svg>
      </div>
      <div class="icon-dislike" :class="segment?.information.rating === -1 ? 'clicked' : 'not-clicked'" @click="changeTrackRating('dislike')">
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.90755 10.6667C2.552 10.6667 2.24089 10.5333 1.97422 10.2667C1.70755 10 1.57422 9.68889 1.57422 9.33333V8C1.57422 7.92222 1.58244 7.83889 1.59889 7.75C1.61533 7.66111 1.64044 7.57778 1.67422 7.5L3.67422 2.8C3.77422 2.57778 3.94089 2.38889 4.17422 2.23333C4.40755 2.07778 4.652 2 4.90755 2H10.2409C10.6076 2 10.9216 2.13044 11.1829 2.39133C11.4442 2.65222 11.5747 2.96622 11.5742 3.33333V10.1167C11.5742 10.2944 11.5382 10.464 11.4662 10.6253C11.3942 10.7867 11.2969 10.9282 11.1742 11.05L7.55755 14.65C7.39089 14.8056 7.19377 14.9 6.96622 14.9333C6.73866 14.9667 6.51911 14.9278 6.30755 14.8167C6.096 14.7056 5.94333 14.55 5.84955 14.35C5.75577 14.15 5.73622 13.9444 5.79088 13.7333L6.54088 10.6667H2.90755ZM14.2409 2C14.6076 2 14.9216 2.13067 15.1829 2.392C15.4442 2.65333 15.5747 2.96711 15.5742 3.33333V9.33333C15.5742 9.7 15.4438 10.014 15.1829 10.2753C14.922 10.5367 14.608 10.6671 14.2409 10.6667C13.8738 10.6662 13.56 10.5358 13.2996 10.2753C13.0391 10.0149 12.9084 9.70089 12.9076 9.33333V3.33333C12.9076 2.96667 13.0382 2.65289 13.2996 2.392C13.5609 2.13111 13.8747 2.00044 14.2409 2Z"
            fill="white"
          />
        </svg>
      </div>
      <div class="audio-segment-menu" @click="addFileToWorkArea(segment, 'bottom')">
        <img src="/assets/modal/plus.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import WaveSurfer from "wavesurfer.js";
import { mapActions, mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";

export default {
  props: {
    segment: {
      type: Object,
      required: true,
    },
    message: {
      type: Object,
      required: true,
    },
    audioIndex: {
      type: Number,
      required: true,
    },
    addFileToWorkArea: {
      type: Function,
      required: false,
      default: console.log("stub function from AudioSample.vue"),
    },
  },
  data() {
    return {
      segmentColors: {
        drums: "#F29E1D",
        bass: "#52BB4D",
        synth: "#0082E8",
        keys: "#9932D0",
        fx: "#0FD6CA",
      },
    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.AI_CHAT, {
      chatHistory: (state) => state.history,
    }),
  },
  mounted() {
    this.initWaveSurfers();
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.AI_CHAT, ["initializeWaveSurfer", "playAudio", "likeSegment", "dislikeSegment"]),

    changeTrackRating(clickedReaction) {
      if (clickedReaction === "like") {
        this.likeSegment({
          messageIndex: this.$props.message.messageId,
          audioIndex: this.$props.audioIndex,
        });
        return;
      }
      this.dislikeSegment({
        messageIndex: this.$props.message.messageId,
        audioIndex: this.$props.audioIndex,
      });
    },
    playAudioHandle() {
      this.playAudio({
        messageIndex: this.$props.message.messageId,
        audioIndex: this.$props.audioIndex,
      });
    },
    initWaveSurfers() {
      const defaultWaveColor = "#3f423e";
      let defaultProgressColor = "#CDE768";
      const tagKey = this.$props.message.messageTag.toLowerCase();

      const waveSurfer = WaveSurfer.create({
        container: this.$refs[`waveformContainer-msg-${this.message.messageId}-audio-${this.audioIndex}`],
        waveColor: defaultWaveColor,
        progressColor: tagKey ? this.segmentColors[tagKey] : defaultProgressColor,
        cursorWidth: 0,
        barHeight: 3,
        height: 24,
        minPxPerSec: 0,
      });
      this.initializeWaveSurfer({
        waveSurfer: waveSurfer,
        messageIndex: this.$props.message.messageId,
        audioIndex: this.$props.audioIndex,
      });
    },
  },
};
</script>

<style scoped>
.audio-segment {
  padding: 4px 16px 4px 4px;
  width: 540px;
  min-height: 48px;
  display: flex;
  justify-content: space-between;
  gap: 21px;
  border-radius: 36px;
  background: #00000033;
}

.left-side-audio-segment {
  min-width: 414px;
  display: flex;
  align-items: center;
  gap: var(--regular-2-block-gap);
}

.waveform-play-button-wrapper {
  min-width: 40px;
  min-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--border-raduis-circle);
  background-color: var(--transparent-light-149);
  box-shadow: 0px 4px 3px 0px #0000001a;
  transition: background var(--default-transition);
  color: var(--message-text-color);
  cursor: pointer;
}

.waveform-play-button-wrapper:hover {
  background-color: rgba(255, 255, 255, 0.249);
  transition: background var(--default-transition);
}

.waveform-container-wrapper {
  width: 330px;
  height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  border-radius: 8px;
  white-space: nowrap;
}

.audio-segment-track-duration {
  min-width: 30px;
  font-size: var(--regular-font-size);
  font-weight: var(--regular-font-weight);
  white-space: nowrap;
}

.right-side-audio-segment {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;
}

.audio-segment-menu {
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.waveform-container-wrapper span {
  width: 45px;
  margin-left: 10px;
  margin-right: 4px;
  font-size: var(--small-font-size);
}

.waveform-container {
  overflow: hidden;
  width: 100%;
  height: 24px;
}

.icon-like,
.icon-dislike,
.audio-segment-menu {
  height: 100%;
  display: flex;
  align-items: center;
  fill-opacity: 0.4;
  transition: all var(--default-transition);
}

.audio-segment-menu:hover,
.audio-segment-menu:hover svg,
.icon-like:hover,
.icon-like:hover svg,
.icon-dislike:hover,
.icon-dislike:hover svg,
.icon-like.clicked,
.icon-dislike.clicked {
  fill-opacity: 1;
  cursor: pointer;
  transition: all var(--default-transition);
}

.audio-segment-menu img {
  opacity: 0.5;
}

.audio-segment-menu:hover img {
  opacity: 1;
}
</style>
