import type { ActionContext } from "vuex";
import { ShallowRef } from "vue";
import WaveSurfer from "wavesurfer.js";

export type TChatMessage = IChatBaseMessage & IAiMessage;
export type TFoundedAudios = IChatAudioSegment[];
export type TGenerationTime = number;
export type TWavesurferContainerRefs = string[];
export type TMessageTitle = string;
export type TTagsList = string[];
export type TError = boolean;

export interface IChatAudioSegment {
  waveSurfer: ShallowRef<WaveSurfer>;
  information: IChatAudioSegmentInformation;
  refContainer: string;
}

export interface IChatAudioSegmentInformation {
  name: string;
  currentTime: string;
  duration: number;
  rating: number;
  isLoading: boolean;
  isPlaying: boolean;
  url: string;
}

export interface IChatBaseMessage {
  messageId: string | number;
  isUser: boolean;
  messageTag: string;
  text: string;
  areSegmentsGenerated?: boolean | undefined;
}

export interface IAiMessage extends IChatBaseMessage {
  foundedAudios: TFoundedAudios;
  generationTime: TGenerationTime;
  wavesurferContainerRefs: TWavesurferContainerRefs;
  messageTitle: TMessageTitle;
  tagsList: TTagsList;
  isError?: TError;
}

export interface IChatIndexes {
  messageIndex: number;
  audioIndex: number;
}

export interface IAudioSegment extends IChatIndexes {
  waveSurfer: WaveSurfer;
}

export interface IEditingMessageData {
  messageIndex: number;
  text: string;
}

export interface IAiChatModule {
  history: Array<TChatMessage>;
}

const formatTime = (time: number): string => {
  return [Math.floor((time % 3600) / 60), ("00" + Math.floor(time % 60)).slice(-2)].join(":");
};

const aiChatModule = {
  namespaced: true,
  state: (): IAiChatModule => ({
    history: [],
  }),
  getters: {
    chatHistory: (state: IAiChatModule) => state.history,
    isLastMessageFromAi: (state: IAiChatModule): boolean => state.history[state.history?.length - 1]?.isUser === false,
    textOfLastMessageInHistory: (state: IAiChatModule): string => (state.history.length > 0 ? state.history[state.history.length - 1]?.text : ""),
  },
  mutations: {
    pushMessage(state: IAiChatModule, message: TChatMessage): void {
      state.history.push(message);
    },
    removeFromHistory(state: IAiChatModule, index: number): void {
      state.history.splice(index, 1);
    },
    clearHistory(state: IAiChatModule): void {
      state.history = [];
    },
    editMessage(state: IAiChatModule, editingMessageData: IEditingMessageData) {
      //   todo: todo
    },
    initializeWaveSurfer(state: IAiChatModule, audioSegment: IAudioSegment): void {
      const waveSurferInstance: WaveSurfer = audioSegment.waveSurfer;
      const messageIndex: number = audioSegment.messageIndex;
      const audioIndex: number = audioSegment.audioIndex;
      const audioInstance: IChatAudioSegment = state.history[messageIndex]?.foundedAudios[audioIndex];

      if (!audioInstance) {
        return;
      }

      waveSurferInstance.load(audioInstance?.information.url);
      audioInstance.information.isLoading = true;
      waveSurferInstance.on("ready", () => {
        audioInstance.information.currentTime = formatTime(waveSurferInstance.getDuration());
        audioInstance.information.isLoading = false;
      });
      waveSurferInstance.on("audioprocess", () => {
        const duration: number = waveSurferInstance.getDuration();
        const currentTime: number = waveSurferInstance.getCurrentTime();
        audioInstance.information.currentTime = formatTime(duration - currentTime);
      });
      waveSurferInstance.on("finish", () => {
        audioInstance.information.isPlaying = false;
      });
      audioInstance.waveSurfer.value = waveSurferInstance;
    },
    playAudio(state: IAiChatModule, audioSegment: IAudioSegment): void {
      const audioInstance: IChatAudioSegment = state.history[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex];

      if (audioInstance.waveSurfer.value.isPlaying()) {
        audioInstance.waveSurfer.value.pause();
        audioInstance.information.isPlaying = false;
        return;
      }
      audioInstance.waveSurfer.value.play();
      audioInstance.information.isPlaying = true;
    },
    likeSegment(state: IAiChatModule, audioSegment: IAudioSegment): void {
      const oldRating = state.history[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating;
      if (oldRating === 1) {
        state.history[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating = 0;
        return;
      }
      state.history[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating = 1;
    },
    dislikeSegment(state: IAiChatModule, audioSegment: IAudioSegment): void {
      const oldRating = state.history[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating;
      if (oldRating === -1) {
        state.history[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating = 0;
        return;
      }
      state.history[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating = -1;
    },
  },
  actions: {
    pushToHistory(state: ActionContext<IAiChatModule, any>, message: TChatMessage): void {
      console.log("audio will be push:", message);
      state.commit("pushMessage", message);
    },
    removeFromHistory(state: ActionContext<IAiChatModule, any>, index: number): void {
      state.commit("removeFromHistory", index);
    },
    clearHistory(state: ActionContext<IAiChatModule, any>): void {
      state.commit("clearHistory");
    },
    editMessage(state: ActionContext<IAiChatModule, any>, editingMessageData: IEditingMessageData): void {
      state.commit("editMessage", editingMessageData);
    },
    initializeWaveSurfer(state: ActionContext<IAiChatModule, any>, indexes: IAudioSegment): void {
      state.commit("initializeWaveSurfer", indexes);
    },
    playAudio(state: ActionContext<IAiChatModule, any>, indexes: IChatIndexes): void {
      state.commit("playAudio", indexes);
    },
    likeSegment(state: ActionContext<IAiChatModule, any>, indexes: IChatIndexes): void {
      state.commit("likeSegment", indexes);
    },
    dislikeSegment(state: ActionContext<IAiChatModule, any>, indexes: IChatIndexes): void {
      state.commit("dislikeSegment", indexes);
    },
  },
};

export default aiChatModule;
