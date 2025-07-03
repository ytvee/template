<template>
    <div class="rename-ai-chat-item-form-container">
        <div class="header">
            <span>{{ title }}</span>
            <img class="close-icon" :src="AiChatPageIconPaths.CLOSE_ICON" alt="close form icon" @click.stop="closeForm">
        </div>
        <div class="form">
            <input autofocus :value="name" @input="handleChange" />
            <div class="control-container">
                <button @click.stop="closeForm">Cancel</button>
                <button @click.stop="onSubmit">{{ submitLabel }}</button>
            </div>
        </div>
    </div>
</template>

<script>
import storeModules from "@/data/store/storeModules.json";
import modalActions from "@/data/store/modal/modalActions.json"
import { AUDIO_EDITOR_SUBMODULES } from "@audioeditor/data/store/storeModules";
import { AiChatPageIconPaths } from '@/utils/constants/constants';
import { DEFAULT_PROJECT_NAME } from "./AiChatSidebar.vue";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
    name: "RenameAiChatItemForm",
    data() {
        return {
            name: "",
            title: "",
            submitLabel: "",
            submitAction: null,
            AiChatPageIconPaths,
            DEFAULT_PROJECT_NAME,
        }
    },
    methods: {
        ...mapMutations(AUDIO_EDITOR_SUBMODULES.AI_CHAT, [
            'changeItemTitle',
        ]),
        ...mapActions(storeModules.MODAL, [modalActions.CLOSE_MODAL]),
        handleChange(event) {
            this.name = event.target.value;
        },
        onSubmit() {
            this.changeItemTitle({ itemId: this.editableChatItemData.id, newTitle: this.name });

            this.closeForm();
        },
        closeForm() {
            this[modalActions.CLOSE_MODAL]();
        }
    },
    computed: {
        ...mapState(AUDIO_EDITOR_SUBMODULES.AI_CHAT, {
            editableChatItemData: (state) => state.editableChatItemData,
        }),
    },
    created() {
        const { title: editableItemTitle } = this.editableChatItemData;

        this.name = editableItemTitle;

        const isProjectEditableItem = !!this.editableChatItemData.chatsDataList;

        this.title = !isProjectEditableItem ? "Chat name" : "Project name";

        if (editableItemTitle === DEFAULT_PROJECT_NAME) {
            this.submitLabel = "Create project";

            return;
        };

        this.submitLabel = !isProjectEditableItem ? "Edit chat" : "Edit project";
    },
}
</script>

<style scoped>
.rename-ai-chat-item-form-container {
    padding: 15px;
    border-radius: 16px;
    background-color: rgba(148, 149, 147, 0.528);

    min-height: 200px;
}

.rename-ai-chat-item-form-container .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 20px;

    margin-bottom: 16px;
}

.rename-ai-chat-item-form-container .form {
    padding: 0 20px;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.rename-ai-chat-item-form-container .form input {
    width: 100%;
    border: 2px solid rgb(93, 90, 90);
    font-size: 20px;
    padding: 5px;
    border-radius: 8px;
}

.rename-ai-chat-item-form-container .form .control-container {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
}

.rename-ai-chat-item-form-container .form .control-container button {
    font-size: 18px;
}

.close-icon {
    width: 13px;
    cursor: pointer;
}
</style>