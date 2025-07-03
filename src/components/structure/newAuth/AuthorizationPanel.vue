<template>
    <div class="authorization-panel">
        <div class="logo-icon-wrapper">
            <LogoIcon width="156px" />
        </div>
        <h3 v-if="title" class="title">{{ title }}</h3>
        <h4 v-if="description" class="description">{{ description }}</h4>
        <component :is="authorizationForm"></component>
        <div v-if="changeAuthType && changeAuthLabel" class="actions">
            <InlineAction :onClick="changeAuthType" :label="changeAuthLabel" :description="changeAuthDescription" />
        </div>
    </div>
</template>

<script>
import LogoIcon from '@/components/common/logo/LogoIcon.vue';
import InlineAction from "@/components/common/action/InlineAction.vue";

export default {
    name: "AuthorizationPanel",
    components: { LogoIcon, InlineAction },
    props: {
        authorizationForm: {
            type: Object,
            required: true,
        },
        changeAuthType: {
            type: Function,
            required: false,
        },
        changeAuthDescription: {
            type: String,
            required: false,
        },
        changeAuthLabel: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
    },
}
</script>

<style scoped>
.authorization-panel {
    width: 250px;
    padding-top: 16px;
    padding-bottom: 20px;
    padding-left: 24px;
    padding-right: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid var(--ui-highlight-bg, rgba(255, 255, 255, 0.1));
    border-radius: 18px;
    gap: 16px;
    background: linear-gradient(to bottom right, rgba(0, 0, 0, 0.07), rgba(255, 255, 255, 0.07));
}

.authorization-panel .logo-icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.authorization-panel .title {
    font-size: 16px;
    text-align: center;
}

.authorization-panel .description {
    font-size: 11px;
}

.authorization-panel .actions {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>