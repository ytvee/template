<template>
  <div class="sound-splitter-page">
    <AudioEditor />
  </div>
</template>

<script>
import AudioEditor from "@audioeditor/AudioEditor.vue";

export default {
  name: "SoundSplitterPage",
  components: {
    AudioEditor,
  },
};
</script>

<style scoped></style>
