import WaveSurfer from "wavesurfer.js";
import IdService from "@/services/IdService";
import chatsData from "@/pages/aiChat/AiChatPage/meta";
import type { ActionContext } from "vuex";
import { ShallowRef } from "vue";

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

export interface IChatData {
  id: string;
  title: string;
  history: TChatMessage[];
}

export interface IProjectData {
  id: string;
  title: string;
  chatsDataList: IChatData[];
}

export interface IChatsData {
  projectsData: IProjectData[];
  separateChatsData: IChatData[];
}

export interface IAiChatModule {
  selectedChatId: string | null;
  selectedProjectId: string | null;
  selectedChatHistory: Array<TChatMessage>;
  editableChatItemData: IProjectData | IChatData | null;
  chatsData: IChatsData;
}

const formatTime = (time: number): string => {
  return [Math.floor((time % 3600) / 60), ("00" + Math.floor(time % 60)).slice(-2)].join(":");
};

const DEFAULT_CHAT_NAME: string = "New Chat";

const aiChatModule = {
  namespaced: true,
  state: (): IAiChatModule => ({
    selectedChatId: null,
    selectedProjectId: null,
    selectedChatHistory: [],
    editableChatItemData: null,
    chatsData,
  }),
  getters: {
    chatHistory: (state: IAiChatModule) => state.selectedChatHistory,
    isLastMessageFromAi: (state: IAiChatModule): boolean => state.selectedChatHistory[state.selectedChatHistory?.length - 1]?.isUser === false,
    textOfLastMessageInHistory: (state: IAiChatModule): string => (state.selectedChatHistory.length > 0 ? state.selectedChatHistory[state.selectedChatHistory.length - 1]?.text : ""),
    getChatDataById:
      (state: IAiChatModule) =>
      (chatId: string): IChatData | undefined => {
        const { projectsData: projects, separateChatsData: singleChats } = state.chatsData;

        const projectChats = projects.flatMap((project) => project.chatsDataList);
        const allChats = [...projectChats, ...singleChats];

        return allChats.find((chatData) => chatData.id === chatId);
      },
    getChatItemById:
      (state: IAiChatModule) =>
      (itemId: string): IChatData | IProjectData | undefined => {
        const { projectsData: projects, separateChatsData: singleChats } = state.chatsData;

        const projectChats = projects.flatMap((project) => project.chatsDataList);
        const allItemsData = [...projectChats, ...singleChats, ...projects];

        return allItemsData.find((itemData: IChatData | IProjectData) => itemData.id === itemId);
      },
       getChatProjectById:
      (state: IAiChatModule) =>
      (projectId: string): IProjectData | undefined => {
        const { projectsData: projects } = state.chatsData;

        return projects.find((projectData: IProjectData) => projectData.id === projectId);
      },
  },
  mutations: {
    pushMessage(state: IAiChatModule, message: TChatMessage): void {
      state.selectedChatHistory.push(message);
    },
    removeFromHistory(state: IAiChatModule, index: number): void {
      state.selectedChatHistory.splice(index, 1);
    },
    clearHistory(state: IAiChatModule): void {
      state.selectedChatHistory = [];
    },
    editMessage(state: IAiChatModule, editingMessageData: IEditingMessageData) {
      //   todo: todo
    },
    initializeWaveSurfer(state: IAiChatModule, audioSegment: IAudioSegment): void {
      const waveSurferInstance: WaveSurfer = audioSegment.waveSurfer;
      const messageIndex: number = audioSegment.messageIndex;
      const audioIndex: number = audioSegment.audioIndex;
      const audioInstance: IChatAudioSegment = state.selectedChatHistory[messageIndex]?.foundedAudios[audioIndex];

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
      const audioInstance: IChatAudioSegment = state.selectedChatHistory[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex];

      if (audioInstance.waveSurfer.value.isPlaying()) {
        audioInstance.waveSurfer.value.pause();
        audioInstance.information.isPlaying = false;
        return;
      }
      audioInstance.waveSurfer.value.play();
      audioInstance.information.isPlaying = true;
    },
    likeSegment(state: IAiChatModule, audioSegment: IAudioSegment): void {
      const oldRating = state.selectedChatHistory[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating;
      if (oldRating === 1) {
        state.selectedChatHistory[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating = 0;
        return;
      }
      state.selectedChatHistory[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating = 1;
    },
    dislikeSegment(state: IAiChatModule, audioSegment: IAudioSegment): void {
      const oldRating = state.selectedChatHistory[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating;
      if (oldRating === -1) {
        state.selectedChatHistory[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating = 0;
        return;
      }
      state.selectedChatHistory[audioSegment.messageIndex].foundedAudios[audioSegment.audioIndex].information.rating = -1;
    },
    setSelectedChatId(state: IAiChatModule, selectedId: string): void {
      state.selectedChatId = selectedId;
    },
    setSelectedChatHistory(state: IAiChatModule, selectedChatHistory: TChatMessage[]): void {
      state.selectedChatHistory = selectedChatHistory;
    },
    setSelectedProjectId(state: IAiChatModule, projectId: string): void {
      state.selectedProjectId = projectId;
    },
    setEditableChatItemData(state: IAiChatModule, itemData: IProjectData | IChatData): void {
      state.editableChatItemData = itemData;
    },
    clearSelectedChat(state: IAiChatModule): void {
      state.selectedChatId = null;
      state.selectedChatHistory = [];
    },
    addSingleChatToProject(state: IAiChatModule, payload: { projectId: string; chatId: string }) {
      const { projectId, chatId } = payload;

      const currentProjectData = state.chatsData.projectsData.find((projectData) => projectData.id === projectId);
      const currentChatData = state.chatsData.separateChatsData.find((separateChatData) => separateChatData.id === chatId);

      if (!currentProjectData || !currentChatData) {
        console.error("You incorrect give project id or chat id to addSingleChatToProject action!");

        return;
      }

      currentProjectData.chatsDataList.push(currentChatData);
      state.chatsData.separateChatsData = state.chatsData.separateChatsData.filter((separateChatsData) => separateChatsData.id !== chatId);
    },
    createChatInProject(state: IAiChatModule, payload: {projectId: string, chatData: IChatData}): void {
      const {projectId, chatData} = payload;

      const currentProjectData = state.chatsData.projectsData.find((projectData) => projectData.id === projectId);

      if (!currentProjectData) {
        console.error("You incorrect using id in projects to createChatInProject!");

        return;
      };

      currentProjectData.chatsDataList.push(chatData);
    },
    removeChatFromProject(state: IAiChatModule, chatId: string) {
      const currentProjectDataIndex = state.chatsData.projectsData.findIndex((projectData) => projectData.chatsDataList.some((chatData) => chatData.id === chatId));

      if (currentProjectDataIndex === -1) {
        console.error("You incorrect give project id to removeChatFromProject action!");

        return;
      }

      const currentChatData = state.chatsData.projectsData[currentProjectDataIndex].chatsDataList.find((chatData: IChatData) => chatData.id === chatId);

      if (!currentChatData) {
        console.error("You incorrect give chat id to removeChatFromProject action!");

        return;
      }

      state.chatsData.projectsData[currentProjectDataIndex].chatsDataList = state.chatsData.projectsData[currentProjectDataIndex].chatsDataList.filter((chatData) => chatData.id !== currentChatData.id);
      state.chatsData.separateChatsData.push(currentChatData);
    },
    deleteChat(state: IAiChatModule, chatId: string) {
      state.chatsData.projectsData = state.chatsData.projectsData.map((projectData) => {
        return {
          ...projectData,
          chatsDataList: projectData.chatsDataList.filter((chatData) => chatData.id !== chatId),
        };
      });

      state.chatsData.separateChatsData = state.chatsData.separateChatsData.filter((separateChatData) => separateChatData.id !== chatId);

      if (chatId !== state.selectedChatId) {
        return;
      }

      state.selectedChatId = "0";
      state.selectedChatHistory = [];
    },
    deleteProject(state: IAiChatModule, projectId: string) {
      state.chatsData.projectsData = state.chatsData.projectsData.filter((projectData) => projectData.id !== projectId);
    },
    changeItemTitle(state: IAiChatModule, payload: { itemId: string; newTitle: string }) {
      const { itemId, newTitle } = payload;

      const projects: IProjectData[] = state.chatsData.projectsData;

      const changedProjectDataIndex: number = projects.findIndex((projectData: IProjectData) => projectData.id === itemId);

      if (changedProjectDataIndex !== -1) {
        projects[changedProjectDataIndex].title = newTitle;

        return;
      }

      const projectWithChangedChatIndex: number = projects.findIndex((projectData: IProjectData) => projectData.chatsDataList.some((chatData: IChatData) => chatData.id === itemId));

      if (projectWithChangedChatIndex !== -1) {
        const changedChatIndex = projects[projectWithChangedChatIndex].chatsDataList.findIndex((chatData: IChatData) => chatData.id === itemId);

        projects[projectWithChangedChatIndex].chatsDataList[changedChatIndex].title = newTitle;

        return;
      };

      const singleChats: IChatData[] = state.chatsData.separateChatsData;

      const singleChangedChatIndex: number = singleChats.findIndex((chatData: IChatData) => chatData.id === itemId);

      if (singleChangedChatIndex === -1) {
        console.error("You incorrect give itemId in changeItemTitle!");

        return;
      };

      singleChats[singleChangedChatIndex].title = newTitle;
    },
    createNewProject(state: IAiChatModule, newProjectData: IProjectData) {
      const newChatData: IChatData = {
        id: IdService.generateUniqueId(),
        title: DEFAULT_CHAT_NAME,
        history: [],
      };

      newProjectData.chatsDataList.push(newChatData);
      
      state.chatsData.projectsData.unshift(newProjectData);

      state.selectedProjectId = newProjectData.id;
    },
    createNewChat(state: IAiChatModule) {
      const newChatData = {
        id: IdService.generateUniqueId(),
        title: "New chat",
        history: [],
      };

      state.chatsData.separateChatsData.unshift(newChatData);
      state.selectedChatId = newChatData.id;
      state.selectedChatHistory = newChatData.history;
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
    updateSelectedChat({ commit }: ActionContext<IAiChatModule, any>, selectedChatData: IChatData) {
      commit("setSelectedChatId", selectedChatData.id);
      commit("setSelectedChatHistory", selectedChatData.history);
    },
  },
};

export default aiChatModule;
