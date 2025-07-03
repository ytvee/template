<template>
  <div class="ai-chat-page">
    <AiChatSidebar />
    <div class="ai-chat-page-container">
      <AiChatMessagesWindow />
      <UserInput :isChatActive="!!chatHistoryLength"
        :isSupportButtonsShowed="!!chatHistory[chatHistoryLength - 1]?.foundedAudios?.length" :isFullPage="true" />
    </div>
  </div>
</template>

<script>
import AiChatSidebar from "../AiChatSidebar.vue";
import AiChatMessagesWindow from "../AiChatMessagesWindow.vue";
import UserInput from "@/audioeditor/components/modals/aichat/UserInput.vue";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { mapState } from "vuex";

export default {
  name: "AiChatPage",
  components: { AiChatSidebar, AiChatMessagesWindow, UserInput },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.AI_CHAT, {
      chatHistory: (state) => state.selectedChatHistory,
      chatHistoryLength: (state) => state.selectedChatHistory?.length || 0,
    }),
  },
};
</script>

<style scoped>
.ai-chat-page {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  min-width: 100vw;
  display: flex;
  background: linear-gradient(0deg, #373737, #373737), linear-gradient(0deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07)), linear-gradient(180.47deg, rgba(251, 251, 251, 0.03) 1.1%, rgba(255, 255, 255, 0) 77.2%), linear-gradient(165.99deg, rgba(82, 187, 77, 0.06) 3.84%, rgba(82, 187, 77, 0) 69.97%), linear-gradient(180deg, #373c36 0%, #2e2e2e 100%);
}

.ai-chat-page-container {
  min-width: 100%;
  margin-top: 1px;
  margin-right: 1px;
  margin-left: auto;
  color: white;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: content-box;
  gap: var(--small-block-gap);
}
</style>
