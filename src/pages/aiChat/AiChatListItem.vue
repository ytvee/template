<template>
    <div :title="chatData.title" class="ai-chat-list-item" @click.stop>
        <span class="title">{{ chatData.title }}</span>
        <ItemActionsMenu :itemId="chatData.id" :menuConfig="aiChatItemMenuConfig" />
    </div>
</template>

<script>
import ItemActionsMenu from './ItemActionsMenu.vue';
import { getAnchoredMenuConfigWithItemId } from '@/utils/constants/constants';

export default {
    name: "AiChatListItem",
    components: { ItemActionsMenu },
    props: {
        chatData: {
            type: Object,
            required: true,
        },
        actionsDataList: {
            type: Array,
            required: true,
        },
    },
    computed: {
        aiChatItemMenuConfig() {
            return getAnchoredMenuConfigWithItemId(this.actionsDataList, this.chatData.id);
        },
    },
}
</script>

<style scoped>
.ai-chat-list-item {
    width: 250px;
    padding: 8px 12px 8px 45px;
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

.ai-chat-list-item .title {
    max-width: 75%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ai-chat-list-item.selected,
.ai-chat-list-item:hover {
    background-color: #FFFFFF1A;
    cursor: pointer;
}
</style>