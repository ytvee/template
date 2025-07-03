<template>
    <div class="item-actions-menu">
        <div class="open-menu-button" ref="button" @click="toggleIsMenuOpen" @click.stop>
            <img class="open-menu-button-image" :src="AiChatPageIconPaths.OPEN_MENU_ICON" alt="open menu icon src" />
        </div>
        <Teleport to="body">
            <AnchoredMenu v-if="isMenuOpen && openButtonRef" :anchorRef="openButtonRef" :menuConfig="menuConfig" />
        </Teleport>
    </div>
</template>

<script>
import AnchoredMenu from './AnchoredMenu.vue';
import { AiChatPageIconPaths } from '@/utils/constants/constants';

export default {
    name: "ItemActionsMenu",
    components: {
        AnchoredMenu
    },
    props: {
        menuConfig: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isMenuOpen: false,
            AiChatPageIconPaths,
        };
    },
    methods: {
        toggleIsMenuOpen() {
            if (!this.isMenuOpen) {
                this.$eventBus.emit("close-all-ai-chat-items-menus");
            };

            this.isMenuOpen = !this.isMenuOpen;
        },
        closeMenu() {
            this.isMenuOpen = false;
        }
    },
    mounted() {
        this.$eventBus.on("close-all-ai-chat-items-menus", this.closeMenu);

        document.addEventListener("click", this.closeMenu);
    },
    computed: {
        openButtonRef() {
            return this.$refs.button;
        }
    },
    beforeUnmount() {
        this.$eventBus.off("close-all-ai-chat-items-menus", this.closeMenu);

        document.removeEventListener("click", this.closeMenu);
    },
};
</script>

<style scoped>
.item-actions-menu {
    position: relative;
}

.open-menu-button {
    padding: 4px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;

    user-select: none;
}

.open-menu-button:hover {
    cursor: pointer;
    background-color: #ffffff93;
}
</style>
