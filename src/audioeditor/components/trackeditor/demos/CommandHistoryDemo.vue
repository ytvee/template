<template>
  <div class="command-history-demo">
    <h3>Command history demo</h3>
    <div class="buttons-holder">
      <button class="audio-editor-button medium-button" :disabled="commandHistory.lastExecutedCommandIndex === -1" @click="undoAllHandler">undoAll</button><button class="audio-editor-button medium-button" :disabled="commandHistory.lastExecutedCommandIndex === commandHistory.history.length - 1" @click="redoAllHandler">redoAll</button>
      <div>
        <label for="command-history-length">history length</label>
        <div class="input-wrapper">
          <input id="command-history-length" v-model="commandHistoryLength" type="text" />
        </div>
        <button class="audio-editor-button medium-button" @click="setHistoryLengthHandler">apply</button>
      </div>
      <button class="audio-editor-button medium-button" :disabled="!commandHistory.history.length" @click="clearCommandHistory">clear</button>
    </div>

    <div v-for="(command, index) in commandHistory.history" :key="index" class="command" :class="{ active: index === commandHistory.lastExecutedCommandIndex }" @click="commandClickHandler(index)">
      name:<span>{{ command.name }}</span> description:<span>{{ command.verboseDescription }}</span>
    </div>
  </div>
</template>

<script>
import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import { mapActions, mapState } from "vuex";

export default {
  name: "CommandHistoryDemo",
  data() {
    return {
      commandHistoryLength: AUDIO_EDITOR_CONFIGURATION.commandHistory.historyLength,
    };
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, {
      commandHistory: (state) => state.commandHistory,
    }),
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.TRACK_EDITOR, ["undo", "redo", "undoAll", "redoAll", "setCommandHistoryLength", "clearCommandHistory"]),
    commandClickHandler(index) {
      const steps = index - this.commandHistory.lastExecutedCommandIndex;
      steps > 0 ? this.redo(steps) : this.undo(-steps);
    },
    undoAllHandler() {
      this.undoAll();
    },
    redoAllHandler() {
      this.redoAll();
    },
    setHistoryLengthHandler() {
      this.setCommandHistoryLength(this.commandHistoryLength);
    },
  },
};
</script>

<style scoped>
.command-history-demo {
  height: 300px;
  min-height: 300px;
  /* max-width: 800px; */
  overflow-y: scroll;
  border: 2px solid var(--audio-editor-color-translucent-white-1);
  border-radius: var(--small-border-radius);
}
.buttons-holder {
  display: flex;
  align-items: center;
}
.input-wrapper {
  display: inline-block;
  width: 50px;
}
.command {
  cursor: pointer;
}
span {
  font-weight: var(--largest-font-weight);
  color: var(--audio-editor-color-white);
}
.active {
  color: green;
}
</style>
