<template>
    <div class="project-title-container" :style="{ top: isFullPage ? '35%' : '30%' }">
        <img class="project-image" :src="AiChatPageIconPaths.PROJECT_ICON" alt="project-image">
        {{ projectTitle }}
    </div>
</template>

<script>
import { AiChatPageIconPaths } from "@/utils/constants/constants";

export default {
    name: "ProjectTitleContainer",
    props: {
        isFullPage: { type: Boolean, required: true },
        projectTitle: { type: String, require: true },
    },
    data() {
        return {
            AiChatPageIconPaths,
        }
    }
};
</script>

<style scoped>
.project-title-container {
    width: 768px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: var(--chat-font-family);
    font-weight: var(--small-font-weight);
    font-size: var(--very-large-font-size);
    color: var(--ai-chat-color-white);
}
</style>
