<template>
  <div class="audio-stream-with-aws-ivs">
    <div class="video-holder">
      <video ref="videoPlayer" class="video-js" controls playsinline></video>
    </div>
  </div>
</template>

<script>
import videojs from "video.js";

import { VideoJSQualityPlugin, VideoJSIVSTech, registerIVSQualityPlugin, registerIVSTech, VideoJSEvents } from "amazon-ivs-player";

// We use the TypeScript compiler (TSC) to check types; it doesn't know what this WASM module is, so let's ignore the error it throws (TS2307).
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import wasmBinaryPath from "amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm";
import wasmWorkerPath from "amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js";

import { audioStreamMessages } from "@/data/audiostream/constants";

const createAbsolutePath = (assetPath) => new URL(assetPath, document.URL).toString();

const DEFAULT_VOLUME = 1;
const DEFAULT_IS_MUTED = false;

//jg aws
const STREAM_URL = "https://1f529c2def1c.us-east-1.playback.live-video.net/api/video/v1/us-east-1.533793137436.channel.AIRFOziak1kY.m3u8";

//aws sdk example
// const STREAM_URL = 'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8';

export default {
  name: "AudioStreamWithAWSIVS",
  mounted() {
    this.initializeIVSPlayer();
  },
  methods: {
    initializeIVSPlayer() {
      // register the tech with videojs
      registerIVSTech(videojs, {
        wasmWorker: createAbsolutePath(wasmWorkerPath),
        wasmBinary: createAbsolutePath(wasmBinaryPath),
      });

      // register the quality plugin
      registerIVSQualityPlugin(videojs);

      // create the player with the appropriate types. We're using @types/video.js VideoJsPlayer, and intersecting our Player and Quality Plugin interface
      const player = videojs(
        this.$refs.videoPlayer,
        {
          liveui: true,

          techOrder: ["AmazonIVS"],
          // autoplay: true,
        },
        function () {
          console.warn("videojs player is ready to use");
          // setUpPlayerVolume(this);
        }
      );

      // enable the quality plugin
      player.enableIVSQualityPlugin();

      // listen to IVS specific events
      const events = player.getIVSEvents();
      const ivsPlayer = player.getIVSPlayer();

      //set audio_only quality. If only audio playback is presented in stream the IVC+videojs player will not play this audio with other qualities (auto, 720 etc).
      ivsPlayer.addEventListener(events.PlayerState.READY, () => {
        console.log("events.PlayerState.READY");
        const qualities = ivsPlayer.getQualities();
        const audioOnlyQuality = qualities.find((qualityItem) => qualityItem.name === "audio_only");
        if (!audioOnlyQuality) {
          throw new Error(audioStreamMessages.ERRORS.MISSING_AUDIO_ONLY_QUALITY);
        }
        ivsPlayer.setQuality(audioOnlyQuality);
      });

      ivsPlayer.addEventListener(events.PlayerState.PLAYING, () => {
        console.log("IVS Player is playing");
        setUpPlayerVolume(player);
      });

      const query = "?allow_audio_only=true";
      player.src(STREAM_URL + query);
    },
  },
};
function setUpPlayerVolume(player) {
  player.volume(DEFAULT_VOLUME);
  player.muted(DEFAULT_IS_MUTED);
}
</script>

<style>
.audio-stream-with-aws-ivs {
  width: 500px;
  height: 500px;
}
</style>
