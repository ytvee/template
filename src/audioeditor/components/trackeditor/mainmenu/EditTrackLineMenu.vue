<template>
  <div class="edit-track-line-menu">
    <div @click="undoHandler" v-html="DEFAULT_ICONS.PROJECT_HISTORY_UNDO"></div>
    <div @click="redoHandler" v-html="DEFAULT_ICONS.PROJECT_HISTORY_REDO"></div>
    <div @click="cutHandler" v-html="DEFAULT_ICONS.CUT"></div>
    <div @click="copyHandler" v-html="DEFAULT_ICONS.COPY"></div>
  </div>
</template>

<script>
import { DEFAULT_ICONS } from "@audioeditor/data/icons.js";
export default {
  name: "EditTrackLineMenu",
  data() {
    return {
      DEFAULT_ICONS,
    };
  },
  methods: {
    undoHandler() {
      console.log(`undo`);
    },
    redoHandler() {
      console.log(`redo`);
    },
    cutHandler() {
      console.log(`cut`);
    },
    copyHandler() {
      console.log(`copy`);
    },
  },
};
</script>
<style scoped>
.edit-track-line-menu {
  height: 60px;
  background: red;
  border-radius: var(--audio-editor-default-border-radius);

  padding: 15px 20px;
  display: flex;
  gap: 13px;
}
</style>
