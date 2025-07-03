<template>
  <div class="demos-container">
    <GridToolsDemo />
    <AudioRecordDemo />
    <SaveLoadDemo />
    <!-- <VolumeMeterDemo /> -->
    <!-- <MetronomeDemo /> -->
    <CommandHistoryDemo />
  </div>
</template>

<script>
import AudioRecordDemo from "./AudioRecordDemo.vue";
// import VolumeMeterDemo from "./VolumeMeterDemo.vue";
import MetronomeDemo from "./MetronomeDemo.vue";
import CommandHistoryDemo from "./CommandHistoryDemo.vue";
import SaveLoadDemo from "./SaveLoadDemo.vue";
import GridToolsDemo from "./GridToolsDemo.vue";

export default {
  name: "DemosContainer",
  components: {
    GridToolsDemo,
    AudioRecordDemo,
    SaveLoadDemo,
    // VolumeMeterDemo,
    MetronomeDemo,
    CommandHistoryDemo,
  },
}
</script>

<style scoped>
.demos-container {
  position: absolute;
  z-index: 100;
  left: 0;
  bottom: 0;
  max-height: 400px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  /* resize: both; */
  /* overflow: scroll; */
  border: 2px solid red;
}
</style>