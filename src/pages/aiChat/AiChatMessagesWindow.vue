<template>
  <div ref="messagesContainer" class="ai-chat-messages-window">
    <div class="ai-chat-messages-container">
      <div v-for="(message) in chatHistory" :key="message.messageId"
        :class="['message-container', message.isUser ? 'from-user' : 'from-ai']">
        <keep-alive>
          <AIMessage :message="message" :isFullScreenChat="true" />
        </keep-alive>
        <UserMessage v-if="message.isUser" :message="message" />
      </div>
    </div>
  </div>
</template>

<script>
import AIMessage from '@/audioeditor/components/modals/aichat/AIMessage.vue';
import UserMessage from '@/audioeditor/components/modals/aichat/UserMessage.vue';
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { mapState, mapGetters } from "vuex";

export default {
  name: "AiChatMessagesWindow",
  components: { AIMessage, UserMessage },
  methods: {
    ...mapGetters(AUDIO_EDITOR_SUBMODULES.AI_CHAT, ["textOfLastMessageInHistory"]),
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
  },
  mounted() {
    this.scrollToBottom();
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.AI_CHAT, {
      chatHistory: (state) => state.selectedChatHistory,
    })
  },
  watch: {
    textOfLastMessageInHistory: {
      handler() {
        this.scrollToBottom();
      },
      deep: true,
      flush: "post",
    },
    chatHistoryLength: {
      handler() {
        this.scrollToBottom();
      },
      deep: true,
      flush: "post",
    },
  }
}
</script>

<style scoped>
.ai-chat-messages-window {
  width: 100%;
  height: 100%;
  padding-top: 34px;
  padding-bottom: 226px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
}

.ai-chat-messages-container {
  width: 768px;
}

.message-container {
  display: flex;
  flex-direction: column;
  padding: 0px 8px 8px 12px;
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
</style>