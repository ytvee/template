<template>
  <div class="ai-chat-input-wrapper" :class="{ started: isChatActivated }">
    <HelloUserContainer v-if="!isChatActivated" :isFullPage="isFullPage" />

    <div class="user-input">
      <SupportButtons
        v-if="isSupportButtonsShowed"
        :messageTips="messageTips"
        @select-tip="addTipToMessage"
      />

      <div class="user-input-background-wrapper">
        <div class="user-input-container">
          <div
              class="user-input-wrapper"
              :class="messageMetaData.instrument || messageMetaData.genre || messageMetaData.swing ? 'areTags' : ''"
          >
            <div class="user-input-container">
              <div
                v-if="!!messageMetaData.tag"
                class="user-input-tag-in-message"
                :style="{ color: messageTagColor }"
              >
                {{ messageMetaData.tag.toUpperCase() }}
              </div>
              <div class="user-input-message">
                <input
                  ref="userChatInput"
                  v-model="inputMessage"
                  type="text"
                  @keyup.enter="sendMessage"
                  autocomplete="off"
                  :placeholder="
                    isSupportButtonsShowed
                      ? 'Refresh or type...'
                      : 'Create anything...'
                  "
                />
              </div>
            </div>
            <div class="instruments-tags-container">
              <transition name="fade">
                <div v-if="messageMetaData.instrument" class="input-tag"
                     :class="messageMetaData.instrument && !visibleTags.instrument ? 'fading-state' : ''"
                >
                  <span>{{ messageMetaData.instrument }}</span>
                  <div class="close-button" @click="removeSubTag('instrument')">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.98896 8.81436L6.16541 10.6429C6.04996 10.7575 5.90326 10.8148 5.7253 10.8148C5.54734 10.8148 5.40064 10.7575 5.2852 10.6429C5.17059 10.5283 5.11328 10.3824 5.11328 10.2053C5.11328 10.0282 5.17059 9.88233 5.2852 9.76772L7.11376 7.93916L5.2852 6.13123C5.17059 6.01578 5.11328 5.86908 5.11328 5.69112C5.11328 5.51316 5.17059 5.36646 5.2852 5.25102C5.39981 5.13641 5.54568 5.0791 5.7228 5.0791C5.89993 5.0791 6.04579 5.13641 6.16041 5.25102L7.98896 7.07958L9.79689 5.25102C9.91234 5.13641 10.059 5.0791 10.237 5.0791C10.415 5.0791 10.5617 5.13641 10.6771 5.25102C10.8021 5.37605 10.8646 5.52462 10.8646 5.69675C10.8646 5.86887 10.8021 6.01203 10.6771 6.12623L8.84854 7.93916L10.6771 9.76272C10.7917 9.87816 10.849 10.0249 10.849 10.2028C10.849 10.3808 10.7917 10.5275 10.6771 10.6429C10.5521 10.768 10.4037 10.8305 10.232 10.8305C10.0603 10.8305 9.91692 10.768 9.8019 10.6429L7.98896 8.81436Z" fill="white" fill-opacity="0.4"/>
                    </svg>
                  </div>
                </div>
              </transition>
              <transition name="fade">
                <div v-if="messageMetaData.genre" class="input-tag"
                     :class="messageMetaData.genre && !visibleTags.genre ? 'fading-state' : ''"
                >
                  <span>{{ messageMetaData.genre }}</span>
                  <div class="close-button" @click="removeSubTag('genre')">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.98896 8.81436L6.16541 10.6429C6.04996 10.7575 5.90326 10.8148 5.7253 10.8148C5.54734 10.8148 5.40064 10.7575 5.2852 10.6429C5.17059 10.5283 5.11328 10.3824 5.11328 10.2053C5.11328 10.0282 5.17059 9.88233 5.2852 9.76772L7.11376 7.93916L5.2852 6.13123C5.17059 6.01578 5.11328 5.86908 5.11328 5.69112C5.11328 5.51316 5.17059 5.36646 5.2852 5.25102C5.39981 5.13641 5.54568 5.0791 5.7228 5.0791C5.89993 5.0791 6.04579 5.13641 6.16041 5.25102L7.98896 7.07958L9.79689 5.25102C9.91234 5.13641 10.059 5.0791 10.237 5.0791C10.415 5.0791 10.5617 5.13641 10.6771 5.25102C10.8021 5.37605 10.8646 5.52462 10.8646 5.69675C10.8646 5.86887 10.8021 6.01203 10.6771 6.12623L8.84854 7.93916L10.6771 9.76272C10.7917 9.87816 10.849 10.0249 10.849 10.2028C10.849 10.3808 10.7917 10.5275 10.6771 10.6429C10.5521 10.768 10.4037 10.8305 10.232 10.8305C10.0603 10.8305 9.91692 10.768 9.8019 10.6429L7.98896 8.81436Z" fill="white" fill-opacity="0.4"/>
                    </svg>
                  </div>
                </div>
              </transition>
              <transition name="fade">
                <div v-if="messageMetaData.swing" class="input-tag"
                     :class="messageMetaData.swing && !visibleTags.swing ? 'fading-state' : ''"
                >
                  <span>{{ messageMetaData.swing }}</span>
                  <div class="close-button" @click="removeSubTag('swing')">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.98896 8.81436L6.16541 10.6429C6.04996 10.7575 5.90326 10.8148 5.7253 10.8148C5.54734 10.8148 5.40064 10.7575 5.2852 10.6429C5.17059 10.5283 5.11328 10.3824 5.11328 10.2053C5.11328 10.0282 5.17059 9.88233 5.2852 9.76772L7.11376 7.93916L5.2852 6.13123C5.17059 6.01578 5.11328 5.86908 5.11328 5.69112C5.11328 5.51316 5.17059 5.36646 5.2852 5.25102C5.39981 5.13641 5.54568 5.0791 5.7228 5.0791C5.89993 5.0791 6.04579 5.13641 6.16041 5.25102L7.98896 7.07958L9.79689 5.25102C9.91234 5.13641 10.059 5.0791 10.237 5.0791C10.415 5.0791 10.5617 5.13641 10.6771 5.25102C10.8021 5.37605 10.8646 5.52462 10.8646 5.69675C10.8646 5.86887 10.8021 6.01203 10.6771 6.12623L8.84854 7.93916L10.6771 9.76272C10.7917 9.87816 10.849 10.0249 10.849 10.2028C10.849 10.3808 10.7917 10.5275 10.6771 10.6429C10.5521 10.768 10.4037 10.8305 10.232 10.8305C10.0603 10.8305 9.91692 10.768 9.8019 10.6429L7.98896 8.81436Z" fill="white" fill-opacity="0.4"/>
                    </svg>
                  </div>
                </div>
              </transition>
            </div>
            <div class="user-input-buttons">
              <DefaultTooltip
                :isTooltipShowed="isUploadTooltipShowed"
                text="Upload your sound"
              />
              <div
                class="user-input-button-upload"
                :style="{ backgroundColor: isUploadTooltipShowed ? '#FFFFFF1A' : '' }"
                @mouseenter="userInputButtonHovered(true)"
                @mouseleave="userInputButtonHovered(false)"
                @click="addTrackButtonHandler"
              >
                <img src="/assets/modal/upload.svg" alt="upload" />
              </div>
              <div v-for="tag in instrumentsButtons" :key="tag.id">
                <div
                  v-if="!messageMetaData.tag || tag.label === messageMetaData.tag"
                  class="user-input-button-instrument"
                  @click="setMessageTag(tag)"
                  @mouseenter="hoveredButton = tag.label"
                  @mouseleave="hoveredButton = ''"
                  :style="{
                    backgroundColor:
                      tag.label === messageMetaData.tag || hoveredButton === tag.label
                        ? tag.backgroundColor
                        : '',
                    marginRight: '8px'
                  }"
                >
                  <img :src="tag.iconPath" :alt="tag.label" />
                  <span class="user-input-button-label">{{ tag.label }}</span>
                </div>
              </div>

              <div
                v-if="!!messageMetaData.tag"
                class="instrument-settings-panel"
                @click="optionsHandle"
              >
                <LargeInputSelect
                  variant="single"
                  triggerLabel="Instrument"
                  :isChatActive="isChatActive"
                  :options="chatOptions.instruments"
                  :selected-option="messageMetaData.instrument"
                  @add-message-meta-data="addMessageMetaData"
                />
                <LargeInputSelect
                  variant="single"
                  triggerLabel="Genre"
                  :isChatActive="isChatActive"
                  :options="chatOptions.genres"
                  :selected-option="messageMetaData.genre"
                  @add-message-meta-data="addMessageMetaData"
                />
<!--                <DefaultInputSelect-->
<!--                  variant="dropdown"-->
<!--                  triggerLabel="Swing"-->
<!--                  :isChatActive="isChatActive"-->
<!--                  :options="chatOptions.swing"-->
<!--                  :selected-option="messageMetaData.swing"-->
<!--                  :disabled="messageMetaData.tag !== 'Drums'"-->
<!--                  @add-message-meta-data="addMessageMetaData"-->
<!--                />-->
                <SwitchPanel
                  :tabs="chatOptions.sampleTypes"
                  @add-message-meta-data="addMessageMetaData"
                />
              </div>
              <div
                class="user-input-button-sending-message"
                :class="{
                  disabled:
                    chatHistory[chatHistory.length - 1]?.text ===
                    'segments generating'
                }"
                @click="sendMessage"
              >
                <img src="/assets/modal/rightArrow.svg" alt="send" />
              </div>
            </div>
          </div>
          <transition name="fade">
            <div
              v-if="!isChatActivated && isFullPage && inputMessage"
              class="user-input-tips-container"
            >
              <UserInputTips
                :inputMessage="inputMessage"
                @add-tip-to-message="addTipToMessage"
              />
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import HelloUserContainer from "@audioeditor/components/modals/aichat/hellousercontainer/HelloUserContainer.vue";
import SupportButtons from "@audioeditor/components/modals/aichat/supportbuttons/SupportButtons.vue";
import DefaultInputSelect from "@audioeditor/components/modals/aichat/defaultinputselect/DefaultInputSelect.vue";
import SwitchPanel from "@audioeditor/components/modals/aichat/switch/SwitchPanel.vue";
import LargeInputSelect from "@audioeditor/components/modals/aichat/largeinputselect/LargeInputSelect.vue";
import UserInputTips from "@audioeditor/components/modals/aichat/userinputtips/UserInputTips.vue";
import { DialogTemplateNames } from "@/data/modal/constants";
import aiChatOptions from "@/data/aichat/aiChatOptions.json";
import instrumentsButtons from "@/data/store/modal/instrumentsButtons.json";
import chatTips from "@/data/aichat/chatTips.json";
import audioWav from "../../../../assets/audio/mixkit-ocean-game-movement-water-air-tank-bubbles-huge-long-3017.wav";
import audioMp3 from "../../../../assets/audio/Sami Yusuf - Al-Mu'allim.mp3";
import DefaultTooltip from "@/components/common/tooltip/DefaultTooltip.vue";
import { generateNoteSamples } from "@/plugins/api/instance/instance";

const { AUDIO_EDITOR_SUBMODULES } = require("@/audioeditor/data/store/storeModules");

export default {
  name: "AiChatInput",
  components: {
    DefaultTooltip,
    HelloUserContainer,
    SupportButtons,
    UserInputTips,
    DefaultInputSelect,
    SwitchPanel,
    LargeInputSelect,
  },
  computed: {
    ...mapState(AUDIO_EDITOR_SUBMODULES.AI_CHAT, {
      chatHistory: (state) => state.history,
    }),
  },
  props: {
    isChatActive: { type: Boolean, required: true },
    isSupportButtonsShowed: { type: Boolean, default: false },
    isFullPage: { type: Boolean, default: false },
  },
  data() {
    return {
      chatOptions: aiChatOptions,
      isChatActivated: this.isChatActive,
      isUploadTooltipShowed: false,
      hoveredButton: "",
      messageTagColor: "",
      inputMessage: "",
      messageMetaData: {
        tag: "",
        instrument: "",
        genre: "",
        swing: "",
        sampleType: "",
      },
      audioToSend: [],
      instrumentsButtons: instrumentsButtons,
      messageTips: chatTips.baseTips,
      visibleTags: {
        instrument: false,
        genre: false,
        swing: false,
      },
    };
  },
  methods: {
    ...mapActions(AUDIO_EDITOR_SUBMODULES.AI_CHAT, [
      "pushToHistory",
      "removeFromHistory",
    ]),
    addMessageMetaData({ key, value }) {
      this.messageMetaData[key] = value;
      this.visibleTags[key] = true;
    },
    optionsHandle(event) {
      event.preventDefault();
      event.returnValue = true;
    },
    addTipToMessage(tip) {
      this.inputMessage = tip;
    },
    userInputButtonHovered(state) {
      this.isUploadTooltipShowed = state;
    },
    setMessageTag(tag) {
      if (this.messageMetaData.tag === tag.label) {
        this.messageMetaData.tag = "";
        this.messageTagColor = "";
        return;
      }
      this.messageMetaData.tag = tag.label;
      this.messageTagColor = tag.color;
    },
    removeSubTag(subTag) {
      this.visibleTags[subTag] = false;

      setTimeout(() => {
        this.messageMetaData[subTag] = ""
      }, 200)
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
    createMessageObject(
      messageId,
      isUser,
      text,
      messageTag = "",
      areSegmentsGenerated = true
    ) {
      return { messageId, isUser, messageTag, text, areSegmentsGenerated };
    },
    createAiMessageObject(
      messageId,
      messageTag,
      tagList,
      messageTitle,
      text,
      areSegmentsGenerated
    ) {
      return {
        messageId,
        isUser: false,
        messageTag,
        text,
        areSegmentsGenerated,
        foundedAudios: [],
        generationTime: 0,
        wavesurferContainerRefs: [],
        messageTitle,
        tagList,
      };
    },
    generateAudiosTemplate() {
      [audioWav, audioMp3].forEach((audioTemplate) => {
        this.audioToSend.push({
          name: audioTemplate.split("/").pop(),
          url: audioTemplate,
        });
      });
    },
    async sendMessage() {
      if (
        !this.inputMessage ||
        this.chatHistory[this.chatHistory.length - 1]?.text ===
        "Segments generating..."
      ) {
        return;
      }
      this.isChatActivated = true;
      const nextMessageIndex =
        this.chatHistory.length > 0
          ? this.chatHistory[this.chatHistory.length - 1].messageId + 1
          : 0;
      const userMsg = this.createMessageObject(
        nextMessageIndex,
        true,
        this.inputMessage,
        this.messageMetaData.tag
      );
      this.pushToHistory(userMsg);
      this.inputMessage = "";
      if (this.inputMessage.includes(this.messageTips[0])) {
        this.generateAudiosTemplate();
        const stubIndex = nextMessageIndex + 1;
        const stub = this.createMessageObject(
          stubIndex,
          false,
          "Segments generating...",
          this.messageMetaData.tag,
          false
        );
        this.pushToHistory(stub);
        const aiMsg = this.createAiMessageObject(
          stubIndex,
          this.messageMetaData.tag,
          [
            "Hard punch + deep 808 sub",
            "Tight attack + slight saturation",
            "Clean low-end, no muddiness",
          ],
          "Trap Kick",
          "Your trap kick is locked and loaded! Want more thump, crunch, or a longer sub tail?",
          true
        );
        this.audioToSend.forEach((audio, i) => {
          const contRef = `waveformContainer-msg-${stubIndex}-audio-${i}`;
          aiMsg.wavesurferContainerRefs.push(contRef);
          aiMsg.foundedAudios.push({
            waveSurfer: {},
            information: {
              name: audio.name,
              currentTime: "00:00",
              duration: 0,
              rating: 0,
              isLoading: true,
              isPlaying: false,
              url: audio.url,
            },
            refContainer: contRef,
          });
        });
        setTimeout(() => {
          this.removeFromHistory(this.chatHistory.length - 1);
          this.pushToHistory(aiMsg);
        }, 3000);
        this.audioToSend = [];
        this.messageMetaData.tag = "";
        return;
      }
      const loadingIndex = nextMessageIndex + 1;
      const loadingStub = this.createMessageObject(
        loadingIndex,
        false,
        "segments generating",
        this.messageMetaData.tag,
        false
      );
      this.pushToHistory(loadingStub);
      const stylesForBackend = [];
      if (this.messageMetaData.tag) {
        stylesForBackend.push(this.messageMetaData.tag);
      }
      if (this.messageMetaData.instrument) {
        stylesForBackend.push(this.messageMetaData.instrument);
      }
      if (this.messageMetaData.genre) {
        stylesForBackend.push(this.messageMetaData.genre);
      }
      if (this.messageMetaData.swing) {
        stylesForBackend.push(this.messageMetaData.swing);
      }
      if (this.messageMetaData.sampleType) {
        stylesForBackend.push(this.messageMetaData.sampleType);
      }
      try {
        const result = await generateNoteSamples(
          this.inputMessage,
          stylesForBackend,
          process.env.VUE_APP_API_TOKEN
        );
        if (!result) {
          this.removeFromHistory(this.chatHistory.length - 1);
          const friendlyError = this.createMessageObject(
            loadingIndex,
            false,
            "Sorry, something went wrong. Please try again.",
            this.messageMetaData.tag,
            true
          );
          friendlyError.isError = true;
          this.pushToHistory(friendlyError);
          this.messageMetaData.tag = "";
          this.messageMetaData.instrument = "";
          this.messageMetaData.genre = "";
          this.messageMetaData.swing = "";
          this.messageMetaData.sampleType = "";
          return;
        }
        const { settings, notes } = result;
        const aiMsg = this.createAiMessageObject(
          loadingIndex,
          this.messageMetaData.tag,
          stylesForBackend,
          "Generated Phrase",
          "Here is your track:",
          true
        );
        let audioCounter = 0;
        for (const [noteName, arrayBuffer] of notes.entries()) {
          const contRef = `waveformContainer-msg-${loadingIndex}-audio-${audioCounter}`;
          aiMsg.wavesurferContainerRefs.push(contRef);
          aiMsg.foundedAudios.push({
            waveSurfer: {},
            information: {
              name: noteName,
              currentTime: "00:00",
              duration: 0,
              rating: 0,
              isLoading: false,
              isPlaying: false,
              url: URL.createObjectURL(new Blob([arrayBuffer])),
            },
            refContainer: contRef,
          });
          audioCounter++;
        }
        this.removeFromHistory(this.chatHistory.length - 1);
        this.pushToHistory(aiMsg);
      } catch (err) {
        this.removeFromHistory(this.chatHistory.length - 1);
        const friendlyError = this.createMessageObject(
          loadingIndex,
          false,
          "Unable to connect to server. Please check your connection and try again.",
          this.messageMetaData.tag,
          true
        );
        friendlyError.isError = true;
        this.pushToHistory(friendlyError);
      } finally {
        this.messageMetaData.tag = "";
        this.messageMetaData.instrument = "";
        this.messageMetaData.genre = "";
        this.messageMetaData.swing = "";
        this.messageMetaData.sampleType = "";
      }
    },
  },
};
</script>

<style scoped>
.ai-chat-input-wrapper {
  position: absolute;
  bottom: 40%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.ai-chat-input-wrapper.started {
  bottom: 0;
  transition: bottom 0.5s ease-out;
}

.user-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--medium-block-gap);
  z-index: 50;
  padding-bottom: 32px;
  background-color: rgba(55, 55, 55, 1);
}

.user-input-background-wrapper {
  position: relative;
  width: 768px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(55, 55, 55, 1);
}

.user-input-container,
.user-input-buttons {
  width: 100%;
  display: flex;
  min-height: 38px;
  user-select: none;
}

.user-input-container {
  width: 100%;
  margin-right: auto;
  font-size: var(--regular-font-size);
}

.instruments-tags-container {
  width: 100%;
  max-height: 32px;
  display: flex;
  gap: 10px;
}

.input-tag {
  padding: 8px 8px 8px 12px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border: 1px solid #FFFFFF0D;
  border-radius: 50px;
  transition: all 1.2s;
}

.input-tag > span {
  font-family: "Wix Madefor Text";
  font-weight: 400;
  font-size: 12px;
}

.close-button {
  display: flex;
  justify-content: center;
  align-items: center;
  transition: translateY 0.2s;
}

.input-tag:hover {
  border-color: rgba(255, 255, 255, 0.25);
  transition: border-color 0.2s ease-in;
}

.close-button:hover {
  cursor: pointer;
  transform: translateY(0.5px);
  transition: translateY 0.2s ease-in;
}

.user-input-tag-in-message {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-input-message {
  width: 100%;
  display: flex;
  align-items: center;
}

.user-input-message input {
  border: none;
  font-family: var(--ai-chat-font-family);
  font-size: var(--chat-font-size-text);
  font-weight: var(--chat-font-weight-text);
}

.user-input-buttons {
  min-height: 32px;
}

.user-input-buttons:hover > * {
  cursor: pointer;
  user-select: none;
}

.user-input-button-upload,
.user-input-button-instrument,
.user-input-button-sending-message {
  margin-right: 10px;
  height: 32px;
  padding: 10px 12px;
  display: flex;
  gap: var(--small-block-gap);
  justify-content: center;
  border-radius: var(--border-radius-50);
  align-items: center;
  font-weight: var(--chat-font-weight-text);
  transition: all var(--default-transition);
}

.user-input-button-upload,
.user-input-button-instrument {
  border: 1px solid var(--transparent-light-10);
  color: var(--ai-chat-color-white);
}

.user-input-button-instrument {
  margin-right: 8px;
}

.instrument-settings-panel {
  display: flex;
  height: 32px;
  gap: 8px;
}

.user-input-button-label {
  font-size: var(--chat-font-size-button-tip);
  font-weight: var(--chat-font-weight-text);
}

.user-input-button-instrument.expand-button {
  width: 32px;
  height: 32px;
  padding: 0;
  margin-left: -16px;
  border-radius: var(--border-raduis-circle);
}

.user-input-button-sending-message {
  justify-self: flex-end;
  margin-left: auto;
  background-color: #393a38;
}

.user-input-button-sending-message.disabled {
  background-color: #6c6c6c;
  pointer-events: none;
  cursor: auto;
}

.user-input-button-sending-message:hover {
  background-color: var(--color-success);
  transition: all var(--default-transition);
}

.user-input-wrapper {
  width: 100%;
  min-height: 110px;
  padding: var(--small-padding);
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #212121;
  border-radius: var(--audio-editor-frame-border-radius);
  transition: gap 0.3s ease-in-out;
}

.user-input-wrapper.areTags {
  gap: 16px;
  transition: gap 0.3s ease-in-out;
}

.user-input-tips-container {
  position: absolute;
  top: 160px;
  padding-top: 4px;
  align-items: flex-end;
  width: 100%;
  max-height: 156px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

@keyframes fading {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
}

.fading-state {
  animation: fading 0.2s ease-out forwards;
}
</style>
