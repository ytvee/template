<template>
  <SoundSplitterPage v-show="activePage === 'SOUND_SPLITTER'" />
  <div class="ai-chat-page" v-show="activePage === 'AICHAT'">
<!--    <div class="chat-sidebar" ref="chatsContainer">-->
<!--      <div class="ai-chat-page-control-panel">-->
<!--        <TransparentButton label="New Chat" iconPath="/assets/aichat/createChat.svg" @click="newChatHandle" />-->
<!--        <TransparentButton-->
<!--          iconPath="/assets/modal/upload.svg"-->
<!--          @click="addTrackButtonHandler"-->
<!--          @mouseenter="isUploadTooltipShowed = true"-->
<!--          @mouseleave="isUploadTooltipShowed = false"-->
<!--        />-->
<!--        <div class="tooltip-wrapper">-->
<!--          <DefaultTooltip-->
<!--            :isTooltipShowed="isUploadTooltipShowed"-->
<!--            text="Upload your sound"-->
<!--            :offsetX="30"-->
<!--            forwardTo="left"-->
<!--          />-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="ai-chat-page-chats-list-container">-->
<!--        <span class="ai-chat-page-chats-side-title">Projects</span>-->
<!--        <div-->
<!--          v-for="(value, index) in chats"-->
<!--          :key="index"-->
<!--          class="ai-chat-page-chat"-->
<!--          :class="{'selected-chat': selectedChat === index}"-->
<!--          @click="selectedChat = index"-->
<!--        >-->
<!--          <img src="/assets/aichat/folder.svg" alt="project-image">-->
<!--          <span>{{ `Project ${index}` }}</span>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <div class="ai-chat-page-container">
      <div ref="messagesContainer" class="ai-chat-messages-window">
        <div class="ai-chat-messages-container">
          <div v-for="(message, index) in chatHistory" :key="index" :class="['message-container', message.isUser ? 'from-user' : 'from-ai']">
            <keep-alive>
              <AIMessage :message="message" :isFullScreenChat="true" />
            </keep-alive>
            <UserMessage v-if="message.isUser" :message="message" />
          </div>
        </div>
      </div>
      <UserInput
        :isChatActive="!!chatHistory?.length"
        :isSupportButtonsShowed="!!chatHistory[chatHistoryLength - 1]?.foundedAudios?.length"
        :isFullPage="true"
      />
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/common/navigation/navbar/NavBar.vue";
import UserInput from "@audioeditor/components/modals/aichat/UserInput.vue";
import UserMessage from "@audioeditor/components/modals/aichat/UserMessage.vue";
import AIMessage from "@audioeditor/components/modals/aichat/AIMessage.vue";
import TransparentButton from "@audioeditor/components/modals/aichat/transparentbutton/TransparentButton.vue";
import { mapGetters, mapState } from "vuex";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import DefaultTooltip from "@/components/common/tooltip/DefaultTooltip.vue";
import { DialogTemplateNames } from "@/data/modal/constants";
import SoundSplitterPage from "@/pages/soundsplitter/SoundSplitterPage.vue";
import storeModules from "@/data/store/storeModules.json";

export default {
  name: "AiChatPage",
  components: {SoundSplitterPage, DefaultTooltip, AIMessage, UserMessage, UserInput, NavBar, TransparentButton },
  mounted() {
    this.scrollToBottom();
  },
  data() {
    return {
      selectedChat: 0,
      chats: ["", ""],
      isUploadTooltipShowed: false,
    };
  },
  computed: {
    ...mapGetters(AUDIO_EDITOR_SUBMODULES.AI_CHAT, ["textOfLastMessageInHistory"]),
    ...mapState(AUDIO_EDITOR_SUBMODULES.AI_CHAT, {
      chatHistory: (state) => state.history,
      chatHistoryLength: (state) => state.history?.length || 0,
    }),
    ...mapState(storeModules.APPLICATION, {
      activePage: (state) => {
        return state.activePage;
      },
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
  methods: {
    newChatHandle() {
      this.chats.push('');
      this.$nextTick(() => {
        const container = this.$refs.chatsContainer;
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth",
        });
        this.selectedChat = this.chats.length - 1;
      })
    },
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
    addTrackButtonHandler() {
      const input = document.createElement("input");
      input.multiple = true;
      input.type = "file";
      input.accept = "audio/*";
      const changeCallback = () => {
        this.$modal.close();
        this.$modal.openModalWithName(
          DialogTemplateNames.IMPORTING_SEGMENT,
          input.files,
          { isNonClosableByClickOnPeriphery: true }
        );
      };
      input.addEventListener("change", changeCallback);
      input.click();
    },
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

.chat-sidebar {
  position: absolute;
  min-width: 286px;
  height: 100%;
  padding: 44px 17px 0 94px;
  border: 1px solid #FFFFFF26;
  display: flex;
  flex-direction: column;
  gap: 25px;
  overflow-y: auto;
}

.ai-chat-page-control-panel {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 6px;
}

.ai-chat-page-chats-list-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.ai-chat-page-chats-side-title {
  font-size: 14px;
  font-family: "Wix Madefor Display", sans-serif;
  font-weight: 500;
  color: #ffffff;
}

.ai-chat-page-chats-list {
  border: 1px solid green;
  width: 150px;
  height: 50px;
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

.ai-chat-page-chat {
  width: 190px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  flex-wrap: nowrap;
  white-space: nowrap;
  z-index: 1;

  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  transition: all 0.2s ease-in-out;
}

.selected-chat,
.ai-chat-page-chat:hover {
  background-color: #FFFFFF1A;
  cursor: pointer;
}

.tooltip-wrapper {
  position: absolute;
  padding-top: 40px;
  z-index: 2000;
}

</style>
