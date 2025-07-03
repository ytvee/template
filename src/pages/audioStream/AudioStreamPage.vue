<template>
  <div class="audio-stream-page">
    <h3>Audio stream demo</h3>
    <AudioStreamWithAWSIVS />
  </div>
</template>

<script>
import AudioStreamWithAWSIVS from "@/components/structure/audiostream/AudioStreamWithAWSIVS.vue";
export default {
  name: "AudioStreamPage",
  components: {
    AudioStreamWithAWSIVS,
  },
};
</script>

<style scoped>
.audio-stream-page {
}
</style>
