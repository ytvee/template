<template>
  <div class="dialog-header">
    <div class="generated-time-container">
      <div v-if="isLastMessageFromAi" class="generated-time-wrapper">
        <span
          >Generation time:
          <span v-if="chatHistory[chatHistory.length - 1]?.generationTime" class="generated-time"> {{ chatHistory[chatHistory.length - 1]?.generationTime }}s </span>
        </span>
      </div>
    </div>
    <div class="close-modal-button" @click="closeDialogAction">
      <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.98809 8.25548L5.32474 10.9261C5.15613 11.0935 4.94187 11.1772 4.68196 11.1772C4.42204 11.1772 4.20778 11.0935 4.03917 10.9261C3.87178 10.7587 3.78809 10.5457 3.78809 10.287C3.78809 10.0283 3.87178 9.81527 4.03917 9.64787L6.70983 6.97722L4.03917 4.3367C3.87178 4.16809 3.78809 3.95383 3.78809 3.69392C3.78809 3.43401 3.87178 3.21974 4.03917 3.05114C4.20656 2.88374 4.41961 2.80005 4.6783 2.80005C4.937 2.80005 5.15004 2.88374 5.31743 3.05114L7.98809 5.72179L10.6286 3.05114C10.7972 2.88374 11.0115 2.80005 11.2714 2.80005C11.5313 2.80005 11.7456 2.88374 11.9142 3.05114C12.0968 3.23374 12.1881 3.45074 12.1881 3.70214C12.1881 3.95353 12.0968 4.16261 11.9142 4.3294L9.24352 6.97722L11.9142 9.64057C12.0816 9.80918 12.1653 10.0234 12.1653 10.2834C12.1653 10.5433 12.0816 10.7575 11.9142 10.9261C11.7316 11.1087 11.5149 11.2 11.2641 11.2C11.0133 11.2 10.8039 11.1087 10.6359 10.9261L7.98809 8.25548Z" fill="white" />
      </svg>
    </div>
  </div>
</template>

<script>
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { mapGetters, mapState } from "vuex";

export default {
  props: {
    closeDialogAction: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      // isLastMessageFromAi: this.isLastMessageFromAi
    };
  },
  computed: {
    ...mapGetters(AUDIO_EDITOR_SUBMODULES.AI_CHAT, ["isLastMessageFromAi"]),
    ...mapState(AUDIO_EDITOR_SUBMODULES.AI_CHAT, {
      chatHistory: (state) => state.selectedChatHistory,
    }),
  },
};
</script>

<style scoped>
.dialog-header {
  min-height: 58px;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--transparent-light-15);
  user-select: none;
}

.generated-time-container {
  font-family: var(--wix-font-family);
  font-weight: var(--small-font-weight);
  font-size: var(--regular-font-size);
  color: var(--audio-editor-color-white);
}

.generated-time {
  font-weight: var(--regular-font-weight);
}

.close-modal-button {
  color: var(--audio-editor-color-white);
  fill-opacity: 0.4;
  cursor: pointer;
  transition: all var(--default-transition);
}

.close-modal-button:hover {
  color: var(--audio-editor-color-white);
  fill-opacity: 1;
  transition: all var(--default-transition);
}
</style>
