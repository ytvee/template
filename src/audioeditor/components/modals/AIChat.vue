<template>
  <div class="ai-chat" :style="{ height: chatHistory?.length ? '800px' : '700px' }">
    <DialogHeader :close-dialog-action="closeChat" />
    <div class="chat-container">
      <!--      <SwitchPanel :tabs="tabs" />-->
      <div ref="messagesContainer" class="messages-container">
        <!--        <div v-if="chatHistory?.length" class="date-line">-->
        <!--          <div></div>-->
        <!--          {{ currentDateLabel }}-->
        <!--          <div></div>-->
        <!--        </div>-->
        <div v-for="(message, index) in chatHistory" :key="index" :class="['message-container', message.isUser ? 'from-user' : 'from-ai']">
          <AIMessage :message="message" is-full-screen-chat="false" />
          <UserMessage v-if="message.isUser" :message="message" />
        </div>
      </div>
      <UserInput :is-chat-active="!!chatHistory?.length" :is-support-buttons-showed="!!chatHistory[chatHistoryLength - 1]?.foundedAudios?.length" />
      <div class="gradient-wrapper"></div>
    </div>
    <!--     <div class="gradient-loader-animation"></div>-->
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@/audioeditor/data/store/storeModules";
import DialogHeader from "./aichat/DialogHeader.vue";
import UserMessage from "./aichat/UserMessage.vue";
import AIMessage from "./aichat/AIMessage.vue";
import UserInput from "./aichat/UserInput.vue";

export default {
  components: { DialogHeader, UserMessage, AIMessage, UserInput },
  data() {
    return {
      tabs: [{ label: "Synth" }, { label: "One-Shot" }, { label: "Loop" }, { label: "More" }],
      currentDateLabel: "Today", // todo: add logic for last 2 days before messages. And older - show a date
    };
  },
  computed: {
    ...mapGetters(AUDIO_EDITOR_SUBMODULES.AI_CHAT, ["textOfLastMessageInHistory"]),
    ...mapState(AUDIO_EDITOR_SUBMODULES.AI_CHAT, {
      chatHistory: (state) => state.selectedChatHistory,
      chatHistoryLength: (state) => state.selectedChatHistory?.length || 0,
    }),
  },
  watch: {
    chatHistoryLength: {
      handler() {
        this.scrollToBottom();
      },
      deep: true,
      flush: "post",
    },
    textOfLastMessageInHistory: {
      handler() {
        this.scrollToBottom();
      },
      deep: true,
      flush: "post",
    },
  },
  mounted() {
    this.scrollToBottom();
  },
  methods: {
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      const padding = 200;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight - padding,
          behavior: "smooth",
        });
      }
    },
    closeChat() {
      this.$modal.close();
    },
  },
};
</script>

<style scoped>
.gradient-loader-animation {
  position: absolute;
  bottom: 0px;
  width: 99.9%;
  height: 100%;
  border-radius: var(--large-border-radius-2);
  background: var(--gradient-primary-transparent-1);
  animation: gradient 1.5s ease infinite;
}

@keyframes gradient {
  0% {
    height: 19%;
  }
  50% {
    height: 90%;
  }
  100% {
    height: 19%;
  }
}

.ai-chat {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 922px;
  display: flex;
  flex-direction: column;
  margin: auto;
  border: 1px solid var(--transparent-light-15);
  border-radius: var(--large-border-radius-2);
  background: var(--chat-background-gradient);
  overflow: hidden;
  z-index: var(--modal-z-index);
  transform: translate(-50%, -50%) scale(1);
  transition: all 0.5s ease;
}

.chat-container {
  height: 100%;
  padding: 0 0 0 70px;
}

.messages-container {
  max-height: 597px;
  height: 100%;
  padding: 22px 85px 70px 0;
  margin-top: 1px;
  margin-right: 1px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  gap: var(--small-block-gap);
}

.message-container {
  display: flex;
  flex-direction: column;
  padding: 0px 4px 8px 12px;
}

.message-container:first-of-type {
  margin-top: auto;
}

.message-container:not(:first-of-type) {
  margin-top: 8px;
}

.message-container.from-user {
  align-items: flex-end;
}

.message-container.from-ai {
  align-items: flex-start;
  gap: 15px;
}

.date-line {
  padding-top: 9px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  gap: var(--small-block-gap);
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  color: var(--date-text-color);

  font-size: 13px;
  font-weight: var(--regular-font-weight);
}

.date-line div {
  width: 208px;
  height: 2px;
  background-color: rgba(166, 145, 182, 0.2);
}

.gradient-wrapper {
  background: var(--gradient-light-to-dark-3-steps);
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80px;
  pointer-events: none;
}
</style>
