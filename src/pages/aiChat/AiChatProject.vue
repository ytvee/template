<template>
    <div class="ai-chat-project">
        <div :title="projectData.title" class="open-chats-button" @click="toggleIsChatListOpen()">
            <div class="title-container">
                <img class="project-image" :src="projectIconSrc" alt="project-image">
                <span class="title">{{ projectData.title }}</span>
            </div>
            <ItemActionsMenu :itemId="projectData.id" :menuConfig="aiChatProjectMenuConfig" />
        </div>
        <div class="chats-list" :class="{ open: isChatsListOpen }">
            <AiChatListItem v-for="(chatData) in projectData.chatsDataList"
                :class="{ selected: chatData.id === selectedChatId }" :key="chatData.id" :chatData="chatData"
                @click="updateSelectedChatId(chatData.id)" :actionsDataList="chatActionsDataList" />
        </div>
    </div>
</template>

<script>
import AiChatListItem from './AiChatListItem.vue';
import ItemActionsMenu from './ItemActionsMenu.vue';
import { AiChatPageIconPaths, getAnchoredMenuConfigWithItemId } from '@/utils/constants/constants';
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { mapMutations } from 'vuex';

export default {
    name: "AiChatProject",
    components: { AiChatListItem, ItemActionsMenu },
    props: {
        projectData: {
            type: Object,
            required: true,
        },
        isChatsListOpen: {
            type: Boolean,
            required: true,
        },
        selectedChatId: {
            type: [String, null],
            required: true,
        },
        updateSelectedChatId: {
            type: Function,
            required: true,
        },
        projectActionsDataList: {
            type: Array,
            required: true,
        },
        chatActionsDataList: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            projectIconSrc: AiChatPageIconPaths.PROJECT_ICON,
            AiChatPageIconPaths,
        }
    },
    methods: {
        ...mapMutations(AUDIO_EDITOR_SUBMODULES.AI_CHAT, [
            "setSelectedProjectId",
            "clearSelectedChat",
        ]),
        handleOpenCurrentProject(currentProjectId) {
            console.log(currentProjectId, this.projectData.id);

            if (currentProjectId !== this.projectData.id) {
                return;
            };
        },
        isSelectedChatInProject() {
            return this.projectData.chatsDataList.some((chatData) => chatData.id === this.selectedChatId);
        },
        toggleIsChatListOpen() {
            this.clearSelectedChat();

            if (!this.isChatsListOpen) {
                this.$eventBus.emit("close-inactive-ai-chat-projects", this.projectData.id);

                this.setSelectedProjectId(this.projectData.id);
            }

            this.$eventBus.emit("update-items-control-data", { itemId: this.projectData.id, isOpen: !this.isChatsListOpen });
        },
        closeChatsListByActiveProjectId(activeProjectId) {
            if (!activeProjectId) {
                this.$eventBus.emit("update-items-control-data", { itemId: this.projectData.id, isOpen: this.isSelectedChatInProject() });

                return;
            };

            if (activeProjectId === this.projectData.id) {
                return;
            };

            this.$eventBus.emit("update-items-control-data", { itemId: this.projectData.id, isOpen: false });
        },
        closeChatsList() {
            this.$eventBus.emit("update-items-control-data", { itemId: this.projectData.id, isOpen: false });
        },
        onChangeTitle() {
            this.changeProjectTitle(this.projectData.id, "changedTitle");
        },
        onDelete() {
            this.deleteProject(this.projectData.id);
        },
    },
    created() {
        this.aiChatProjectMenuConfig = getAnchoredMenuConfigWithItemId(this.projectActionsDataList, this.projectData.id);

        this.projectIconSrc = !this.isChatsListOpen ? AiChatPageIconPaths.PROJECT_ICON : AiChatPageIconPaths.OPENED_PROJECT_ICON;
    },
    mounted() {
        this.$eventBus.on("close-inactive-ai-chat-projects", (activeProjectId) => { this.closeChatsListByActiveProjectId(activeProjectId) });
    },
    watch: {
        isChatsListOpen(isChatsListOpen) {
            this.projectIconSrc = !isChatsListOpen ? AiChatPageIconPaths.PROJECT_ICON : AiChatPageIconPaths.OPENED_PROJECT_ICON;
        },
    },
    beforeUnmount() {
        this.$eventBus.off("close-inactive-ai-chat-projects", () => this.closeChatsListByActiveProjectId(null));
    },
}
</script>

<style scoped>
.open-chats-button {
    width: 250px;
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
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

.open-chats-button .title-container {
    width: 80%;
    display: flex;
    align-items: center;
}

.open-chats-button .title-container .title {
    max-width: 75%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.project-image {
    margin-right: 8px;
}

.open-chats-button:hover {
    background-color: #FFFFFF1A;
    cursor: pointer;
}

.chats-list {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  user-select: none;
  transition: max-height .35s ease-in-out, opacity .35s ease-in-out;
}

.chats-list.open {
  max-height: 1000px; /* should be bigger than your list ever is */
  opacity: 1;
  user-select: auto;
}

</style>