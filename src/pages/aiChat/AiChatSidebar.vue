<template>
    <div class="chat-sidebar">
        <div class="ai-chat-page-control-panel">
            <TransparentButton label="New Chat" iconPath="/assets/aichat/createChat.svg" @click="createNewChat" />
            <div class="upload-files-button-container">
                <TransparentButton iconPath="/assets/modal/upload.svg" @click="addTrackButtonHandler"
                    @mouseenter="isUploadTooltipShowed = true" @mouseleave="isUploadTooltipShowed = false" />
                <DefaultTooltip :isTooltipShowed="isUploadTooltipShowed" text="Upload your sound" :offsetX="100"
                    forwardTo="left" />
            </div>
        </div>
        <div class="ai-chat-user-projects">
            <div class="ai-chat-page-items-list-container">
                <div class="control-header">
                    <span class="ai-chat-page-list-title">Projects</span>
                    <TransparentButton label="New Project" iconPath="/assets/aichat/createChat.svg"
                        @click.stop="handleCreateNewProject" />
                </div>
                <div class="list">
                    <AiChatProject v-for="(projectData) in chatsData.projectsData" :key="projectData.id"
                        :isChatsListOpen="getIsOpenById(projectData.id)" :selectedChatId="selectedChatId"
                        :projectData="projectData" :updateSelectedChatId="handleUpdateSelectedChat"
                        :projectActionsDataList="this.projectActionsData"
                        :chatActionsDataList="this.inProjectChatActionsData" />
                </div>
            </div>
            <div class="ai-chat-page-items-list-container">
                <span class="ai-chat-page-list-title">Chats</span>
                <div class="list">
                    <AiChatListItem v-for="(chatData) in chatsData.separateChatsData" :key="chatData.id"
                        :class="{ selected: chatData.id === selectedChatId }" :chatData="chatData"
                        @click="handleUpdateSelectedSingleChat(chatData.id)"
                        :actionsDataList="this.separateChatActionsData" />
                </div>
            </div>
        </div>
    </div>
    <ModalWindow />
</template>

<script>
import IdService from '@/services/IdService';
import AiChatProject from './AiChatProject.vue';
import AiChatListItem from './AiChatListItem.vue';
import storeModules from "@/data/store/storeModules.json";
import RenameAiChatItemForm from "./RenameAiChatItemForm.vue";
import modalActions from "@/data/store/modal/modalActions.json";
import ModalWindow from '@/components/common/modal/ModalWindow.vue';
import DefaultTooltip from '@/components/common/tooltip/DefaultTooltip.vue';
import TransparentButton from '@/audioeditor/components/modals/aichat/transparentbutton/TransparentButton.vue';
import { DialogTemplateNames } from "@/data/modal/constants";
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { mapMutations, mapActions, mapState } from 'vuex';

export const DEFAULT_PROJECT_NAME = "New Project";

export default {
    name: "AiChatSidebar",
    components: { AiChatListItem, RenameAiChatItemForm, AiChatProject, ModalWindow, DefaultTooltip, TransparentButton },
    data() {
        return {
            isUploadTooltipShowed: false,
            separateChatActionsData: [],
            inProjectChatActionsData: [],
            projectActionsData: [],
            itemsControlData: {
                projectsData: [],
            },
            IdService,
        }
    },
    methods: {
        ...mapMutations(AUDIO_EDITOR_SUBMODULES.AI_CHAT, [
            'addSingleChatToProject',
            "removeChatFromProject",
            'deleteChat',
            'deleteProject',
            "createNewProject",
            "createNewChat",
            "createChatInProject",
            "setEditableChatItemData",
            "setSelectedProjectId",
        ]),
        ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
        ...mapActions(AUDIO_EDITOR_SUBMODULES.AI_CHAT, ["updateSelectedChat"]),
        getIsOpenById(itemId) {
            return this.itemsControlData.projectsData.find((controlData) => controlData.id === itemId).isChatsListOpen;
        },
        updateItemsControlData(projectId, isChatsListOpen) {
            const updatedProjectIndex = this.itemsControlData.projectsData.findIndex((controlData) => controlData.id === projectId);

            if (updatedProjectIndex === -1) {
                this.itemsControlData.projectsData.unshift({
                    id: projectId,
                    isChatsListOpen,
                });

                return;
            };

            this.itemsControlData.projectsData = this.itemsControlData.projectsData.map((controlData) => {
                if (controlData.id !== projectId) {
                    return controlData;
                };

                return {
                    ...controlData,
                    isChatsListOpen: isChatsListOpen,
                };
            });
        },
        getChatDataById(id) {
            return this.$store.getters[`${AUDIO_EDITOR_SUBMODULES.AI_CHAT}/getChatDataById`](id);
        },
        getItemDataById(id) {
            return this.$store.getters[`${AUDIO_EDITOR_SUBMODULES.AI_CHAT}/getChatItemById`](id);
        },
        closeAllAiChatsProjects() {
            this.itemsControlData.projectsData = this.itemsControlData.projectsData.map((controlData) => ({
                ...controlData,
                isChatsListOpen: false,
            }));
        },
        closeChatsListByActiveProjectId(activeProjectId) {
            this.itemsControlData.projectsData = this.itemsControlData.projectsData.map((controlData) => {
                if (controlData.id === activeProjectId) {
                    return controlData;
                };

                return {
                    ...controlData,
                    isChatsListOpen: false,
                };
            })
        },
        handleUpdateSelectedChat(id) {
            const selectedChatData = this.getChatDataById(id);

            if (!selectedChatData) {
                console.error("You incorrect use chat id on handleUpdateSelectedChat");

                return;
            };

            this.setSelectedProjectId(null);

            this.updateSelectedChat(selectedChatData)

            this.$eventBus.emit("close-all-ai-chat-items-menus");
        },
        handleUpdateSelectedSingleChat(singleChatId) {
            this.closeAllAiChatsProjects();

            this.handleUpdateSelectedChat(singleChatId);
        },
        openItemModalEditor(itemId) {
            const editableChatItemData = this.getItemDataById(itemId);

            if (!editableChatItemData) {
                console.error("You incorrect use projects and chats id to openItemModalEditor!");

                return;
            };

            this.setEditableChatItemData(editableChatItemData);

            this[modalActions.SET_MODAL]({ displayedComponent: RenameAiChatItemForm });
            this[modalActions.SET_MODAL_VISIBILITY](true);
        },
        handleCreateNewProject() {
            const newProjectData = {
                id: IdService.generateUniqueId(),
                title: DEFAULT_PROJECT_NAME,
                chatsDataList: [],
            };

            this.closeAllAiChatsProjects();

            this.updateItemsControlData(newProjectData.id, true);
            this.createNewProject(newProjectData);

            this.openItemModalEditor(newProjectData.id);
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
    created() {
        this.itemsControlData = {
            projectsData: this.chatsData.projectsData.map((projectData) => ({ id: projectData.id, isChatsListOpen: false }))
        },

            this.separateChatActionsData = [
                {
                    label: "Add to project",
                    subActions: this.addToProjectActionConfig,
                },
                {
                    label: "Delete chat",
                    action: this.deleteChat,
                },
            ];
        this.inProjectChatActionsData = [
            {
                label: "Rename chat",
                action: this.openItemModalEditor,
            },
            {
                label: "Remove from project",
                action: this.removeChatFromProject,
            },
            {
                label: "Delete chat",
                action: this.deleteChat,
            },
        ];
        this.projectActionsData = [
            {
                label: "Rename project",
                action: this.openItemModalEditor,
            },
            {
                label: "Delete project",
                action: this.deleteProject,
            },
        ];
    },
    mounted() {
        this.$eventBus.on("update-items-control-data", ({ itemId, isOpen }) => { this.updateItemsControlData(itemId, isOpen) });
        this.$eventBus.on("close-inactive-ai-chat-projects", (activeProjectId) => { this.closeChatsListByActiveProjectId(activeProjectId) });
    },
    computed: {
        ...mapState(AUDIO_EDITOR_SUBMODULES.AI_CHAT, {
            selectedChatId: (state) => state.selectedChatId,
            chatsData: (state) => state.chatsData,
            selectedProjectId: (state) => state.selectedProjectId,
        }),
        addToProjectActionConfig() {
            return this.chatsData.projectsData.map((projectData) => ({
                label: projectData.title,
                action: (chatId) => {
                    this.addSingleChatToProject({ projectId: projectData.id, chatId });
                },
            }));
        },
    },
    watch: {
        chatsData: {
            handler() {
                this.separateChatActionsData = [
                    {
                        label: "Add to project",
                        subActions: this.addToProjectActionConfig,
                    },
                    {
                        label: "Delete chat",
                        action: this.deleteChat,
                    },
                ];
            },
            deep: true
        },
        itemsControlData: {
            handler(newData) {
                console.log("UPDATED ITEMS CONTROL DATA: ", newData);
            },
            deep: true,
        },
    },
    beforeUnmount() {
        this.$eventBus.off("update-items-control-data", (itemId, isOpen) => { this.updateItemsControlData(itemId, isOpen) });
        this.$eventBus.off("close-inactive-ai-chat-projects", (activeProjectId) => { this.closeChatsListByActiveProjectId(activeProjectId) });
    }
}
</script>

<style scoped>
.chat-sidebar {
    position: absolute;
    min-width: 286px;
    padding: 44px 12px 0 94px;
    border-right: 1px solid #FFFFFF26;
    display: flex;
    flex-direction: column;
    gap: 25px;
    height: 100vh;
}

.ai-chat-user-projects {
    display: flex;
    flex-direction: column;
    gap: 25px;
    /* flex: auto; */
    max-height: 90%;
}

.ai-chat-page-list-title {
    font-size: 14px;
    font-family: "Wix Madefor Display", sans-serif;
    font-weight: 500;
    color: #ffffff;
}

.ai-chat-page-control-panel {
    position: relative;
    display: flex;
    justify-content: space-between;
    gap: 6px;
}

.ai-chat-page-items-list-container {
    max-height: 50%;
    /* flex: 0 1 50%; */
    overflow: auto;

    display: flex;
    flex-direction: column;
}

.ai-chat-page-items-list-container .control-header {
    width: 100%;
    padding-right: 10px;
    margin-bottom: 7px;

    display: flex;
    flex-direction: column;
    gap: 7px;

    flex-shrink: 0;
}

.ai-chat-page-items-list-container .list {
    padding-right: 10px;

    /* max-height: 100%; */

    /* overflow: auto; */
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
    right: 100px;
    z-index: 2000;
}
</style>