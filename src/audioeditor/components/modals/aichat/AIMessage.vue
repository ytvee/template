<template>
  <div v-if="!message.isUser && message.text !== 'segments generating' && !message.isError" class="audio-container-text">{{ message.text }}</div>
  <div v-if="!message.isUser && message.text !== 'segments generating' && message.isError" class="audio-container-text">
    <div class="error-box">
      <svg viewBox="0 0 24 24"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
      <span>{{ message.text }}</span>
    </div>
  </div>
  <div v-if="!message.isUser && message.text === 'segments generating'" class="segments-generation-loader-container">
    <div class="segments-generation-loader">
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="path-1-inside-1_5466_50266" fill="white">
          <path d="M12.0693 0.511962C18.6968 0.511962 24.0693 5.88455 24.0693 12.512C24.0693 19.1394 18.6968 24.512 12.0693 24.512C5.44192 24.512 0.0693357 19.1394 0.0693354 12.512C0.0693351 5.88455 5.44192 0.511963 12.0693 0.511962Z" />
        </mask>
        <g clip-path="url(#paint0_angular_5466_50266_clip_path)" data-figma-skip-parse="true" mask="url(#path-1-inside-1_5466_50266)">
          <g transform="matrix(0.012 -5.24537e-10 5.24537e-10 0.012 12.0693 12.512)">
            <foreignObject x="-1166.67" y="-1166.67" width="2333.33" height="2333.33"><div xmlns="http://www.w3.org/1999/xhtml" style="background: conic-gradient(from 90deg, rgba(82, 187, 77, 0) 0deg, rgba(82, 186, 77, 1) 360deg); height: 100%; width: 100%; opacity: 1"></div></foreignObject>
          </g>
        </g>
        <path
          d="M12.0693 2.51196C17.5922 2.51196 22.0693 6.98911 22.0693 12.512L26.0693 12.512C26.0693 4.77997 19.8013 -1.48804 12.0693 -1.48804L12.0693 2.51196ZM22.0693 12.512C22.0693 18.0348 17.5922 22.512 12.0693 22.512L12.0693 26.512C19.8013 26.512 26.0693 20.2439 26.0693 12.512L22.0693 12.512ZM12.0693 22.512C6.54649 22.512 2.06934 18.0348 2.06934 12.512L-1.93066 12.512C-1.93066 20.2439 4.33735 26.512 12.0693 26.512L12.0693 22.512ZM2.06934 12.512C2.06934 6.98911 6.54649 2.51196 12.0693 2.51196L12.0693 -1.48804C4.33735 -1.48804 -1.93066 4.77998 -1.93066 12.512L2.06934 12.512Z"
          data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_ANGULAR&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.32156863808631897,&#34;g&#34;:0.73333334922790527,&#34;b&#34;:0.30196079611778259,&#34;a&#34;:0.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.32238718867301941,&#34;g&#34;:0.73292642831802368,&#34;b&#34;:0.30320298671722412,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.32156863808631897,&#34;g&#34;:0.73333334922790527,&#34;b&#34;:0.30196079611778259,&#34;a&#34;:0.0},&#34;position&#34;:0.0},{&#34;color&#34;:{&#34;r&#34;:0.32238718867301941,&#34;g&#34;:0.73292642831802368,&#34;b&#34;:0.30320298671722412,&#34;a&#34;:1.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:24.0,&#34;m01&#34;:1.0490733757251292e-06,&#34;m02&#34;:0.069334886968135834,&#34;m10&#34;:-1.0490733757251292e-06,&#34;m11&#34;:24.0,&#34;m12&#34;:0.5119628906250},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"
          mask="url(#path-1-inside-1_5466_50266)"
        />
        <defs>
          <clipPath id="paint0_angular_5466_50266_clip_path"><path d="M12.0693 2.51196C17.5922 2.51196 22.0693 6.98911 22.0693 12.512L26.0693 12.512C26.0693 4.77997 19.8013 -1.48804 12.0693 -1.48804L12.0693 2.51196ZM22.0693 12.512C22.0693 18.0348 17.5922 22.512 12.0693 22.512L12.0693 26.512C19.8013 26.512 26.0693 20.2439 26.0693 12.512L22.0693 12.512ZM12.0693 22.512C6.54649 22.512 2.06934 18.0348 2.06934 12.512L-1.93066 12.512C-1.93066 20.2439 4.33735 26.512 12.0693 26.512L12.0693 22.512ZM2.06934 12.512C2.06934 6.98911 6.54649 2.51196 12.0693 2.51196L12.0693 -1.48804C4.33735 -1.48804 -1.93066 4.77998 -1.93066 12.512L2.06934 12.512Z" mask="url(#path-1-inside-1_5466_50266)" /></clipPath>
        </defs>
      </svg>
    </div>
    <span>Generating...</span>
  </div>
  <div v-for="(segment, index) in message.foundedAudios" v-else :key="index" class="ai-message">
    <div class="audio-container" @mouseenter="hoveredTrackId = index" @mouseleave="hoveredTrackId = -1">
      <div class="audio-wrapper">
        <div v-if="message.areSegmentsGenerated" class="audio">
          <keep-alive>
            <AudioSample :segment="segment" :message="message" :audio-index="message.foundedAudios.indexOf(segment)" :add-file-to-work-area="addFileToWorkArea" />
          </keep-alive>
          <transition name="fade">
            <div v-if="hoveredTrackId === index" class="add-track-button" :class="currentSegment.isAddedToWorkArea && 'not-clicked'" :style="{ cursor: !currentSegment.isAddedToWorkArea ? 'auto' : 'pointer' }" @mouseenter="isAddTooltipShowed = true" @mouseleave="isAddTooltipShowed = false" @click="downloadSample(segment)">
              <img v-if="!isDownloading && isFullScreenChat && (currentSegment.name !== segment.information.name || currentSegment.isAddedToWorkArea)" src="/assets/modal/donwloadArrow.svg" alt="" />
              <div v-else-if="isDownloading || (currentSegment.name === segment.information.name && !currentSegment.isAddedToWorkArea)" class="loading-animation">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 7.00029C12.9999 8.26735 12.5988 9.50187 11.854 10.5269C11.1092 11.552 10.059 12.3149 8.85392 12.7064C7.64886 13.0979 6.3508 13.0979 5.14576 12.7063C3.94073 12.3147 2.89059 11.5517 2.14584 10.5266C1.4011 9.50155 0.999991 8.26702 1 6.99996C1.00001 5.7329 1.40114 4.49837 2.14589 3.47329C2.89065 2.44822 3.9408 1.68523 5.14584 1.29368C6.35088 0.902124 7.64895 0.902107 8.854 1.29363" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <div v-if="isAddTooltipShowed" class="ai-message-add-button-tooltip-container">
                <div class="ai-message-add-button-tooltip-starter"></div>
                <div class="ai-message-add-button-tooltip">
                  <span>Download</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioSample from "./AudioSample.vue";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { mapActions, mapState } from "vuex";

export default {
  components: { AudioSample },
  props: {
    message: {
      type: Object,
      required: false,
      default: [],
    },
    isFullScreenChat: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      currentSegment: { name: "", isAddedToWorkArea: true },
      hoveredTrackId: -1,
      isAddTooltipShowed: false,
      isDownloading: false,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.currentUser,
    }),
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["addTracks"]),
    downloadSample(segment) {
      this.isDownloading = true;
      const element = document.createElement("a");
      element.href = segment.information.url;
      element.download = segment.information.name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      this.isDownloading = false;
    },
    async addFileToWorkArea(segment, directionToPush) {
      if (!segment?.waveSurfer) {
        return;
      }
      this.currentSegment.name = segment.information.name;
      this.currentSegment.isAddedToWorkArea = false;

      const trackOptionsArray = [
        {
          musicianName: this.user?.name || segment.information.name,
          soundSource: "custom",
          segments: [
            {
              name: segment.information.name,
              url: segment.information.url,
            },
          ],
        },
      ];
      await this.addTracks({ commandArgs: { tracks: trackOptionsArray, directionToPush } });
      this.currentSegment.isAddedToWorkArea = true;
      this.$modal.close();
    },
  },
};
</script>

<style scoped>
.audio-container-text {
  font-family: var(--wix-font-family);
  font-size: var(--regular-font-size);
  font-weight: var(--small-font-weight);
  color: var(--audio-editor-color-white);
}

.error-box {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid #da0000;
  border-radius: 100px;
  background-color: rgba(255, 221, 221, 0.8);
  color: #1E1E1E;
}

.error-box svg {
  width: 18px;
  height: 18px;
  fill: rgba(218, 0, 0, 0.8);
}

.segments-generation-loader-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--regular-2-block-gap);
}

.segments-generation-loader svg {
  -webkit-animation: spin 1s linear infinite;
  -moz-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

.segments-generation-loader-container span {
  font-family: var(--wix-font-family);
  font-weight: var(--small-font-weight);
  font-size: var(--regular-font-size);
  color: var(--audio-editor-color-white);
}

.ai-message {
  width: 100%;
  box-sizing: border-box;
  border-radius: 16px 16px 16px 4px;
  color: var(--message-text-color);
  user-select: text;
  overflow-wrap: break-word;

  display: flex;
  flex-direction: column;

  font-family: var(--chat-font-family);
  font-size: 17px;
  font-weight: var(--chat-font-weight-text);
  text-align: left;
  text-decoration-skip-ink: none;
}

.audio-logo-container img {
  width: 100%;
  object-fit: contain;
}

.audio-container {
  display: flex;
  flex-direction: column;
  gap: var(--regular-block-gap);
}

.audio-wrapper {
  width: 582px;
}

.audio {
  display: flex;
  gap: var(--small-block-gap);
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: all var(--default-transition) ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.add-track-button {
  position: relative;
  min-width: 32px;
  height: 32px;
  padding: var(--default-padding);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--border-raduis-circle);
  background-color: var(--transparent-light-05);
  transition: all var(--default-transition);
}

.add-track-button.not-clicked:hover {
  background-color: var(--color-success);
  transition: all var(--default-transition);
}

.loading-animation {
  width: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-animation: spin 1s linear infinite;
  -moz-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

/* todo: move tooltip styles to provider */
.ai-message-add-button-tooltip-container {
  position: absolute;
  min-width: 99px;
  top: 31px;
  left: 2px;
  /* todo: fix z index of all tooltips */
  z-index: 1000;
}

.ai-message-add-button-tooltip-container:hover {
  display: none;
}

.ai-message-add-button-tooltip-starter {
  position: relative;
  top: 8px;
  left: 9px;
  width: 11px;
  height: 11px;
  border-radius: 2px;
  transform: rotate(45deg);

  background-color: var(--ai-chat-background-color-2);
  box-shadow: 0px 22px 32px 0px #0000004d;
  backdrop-filter: blur(24px);
}

.ai-message-add-button-tooltip {
  padding: 8px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;

  background: var(--transparent-dark-55);
  box-shadow: 0px 22px 32px 0px #0000004d;
  backdrop-filter: blur(24px);
}

.ai-message-add-button-tooltip span {
  color: var(--transparent-light-60);
  font-size: var(--small-font-size);
  font-weight: var(--small-font-weight);
}

.audio {
  display: flex;
  justify-content: space-between;
}
</style>
