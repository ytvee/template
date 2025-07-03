<template>
    <div ref="menu" class="anchored-menu" :style="{
        position: 'fixed',
        top: `${menuCoords.top}px`,
        left: `${menuCoords.left}px`,
    }" @click.stop>
        <template v-for="(actionData, index) in menuConfig" :key="index">
            <div v-if="!actionData.subActions" :title="actionData.label" class="action"
                @click.stop="onAction(actionData.action)">
                {{ actionData.label }}
            </div>
            <template v-else>
                <div class="action" ref="subMenuOpenButton" @click.stop="toggleSubActionsIsOpen(actionData.label)">
                    {{ actionData.label }}
                </div>
                <div v-if="getSubActionsIsOpen(actionData.label)" :style="getSubActionsStyles(actionData.label)"
                    ref="subMenuContainer" class="anchored-menu">
                    <div v-for="(subActionData, subIndex) in actionData.subActions" :key="`${index}-${subIndex}`"
                        :title="subActionData.label" class="action" @click.stop="onAction(subActionData.action)">
                        {{ subActionData.label }}
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import { calculateAnchoredMenuPosition, AnchoredMenuDirections } from '@/utils/constants/constants';

export default {
    name: "AnchoredMenu",
    props: {
        anchorRef: {
            type: Object,
            required: true,
        },
        menuConfig: {
            type: Object,
            required: true,
        },
        direction: {
            type: String,
            required: false,
            default: AnchoredMenuDirections.BOTTOM,
        }
    },
    data() {
        return {
            menuCoords: {
                top: 0,
                left: 0,
            },
            subActionsConfig: [],
        }
    },
    methods: {
        initSubActionsConfig() {
            for (let actionIndex = 0; actionIndex < this.menuConfig.length; actionIndex++) {
                if (!this.menuConfig[actionIndex].subActions) {
                    continue;
                };

                this.subActionsConfig.push({
                    id: this.menuConfig[actionIndex].label,
                    isOpen: false,
                    styles: {
                        position: "fixed",
                        top: "",
                        left: "",
                    }
                });
            };
        },
        onAction(action) {
            action();

            this.$eventBus.emit("close-all-ai-chat-items-menus");
        },
        closeAllSubActionsMenus() {
            this.subActionsConfig = this.subActionsConfig.map((subActionData) => ({
                ...subActionData,
                isOpen: false,
            }));
        },
        getSubActionsIsOpen(actionId) {
            const findSubActionData = this.subActionsConfig.find((subActionData) => subActionData.id === actionId);

            if (!findSubActionData) {
                console.error("You incorrect set subAction id in getSubActionIsOpen!");

                return;
            };

            return findSubActionData.isOpen;
        },
        getSubActionsStyles(actionId) {
            const findSubActionData = this.subActionsConfig.find((subActionData) => subActionData.id === actionId);

            if (!findSubActionData) {
                console.error("You incorrect set subAction id in getSubActionIsOpen!");

                return;
            };

            return findSubActionData.styles;
        },
        toggleSubActionsIsOpen(actionId) {
            this.closeAllSubActionsMenus();

            const findSubActionDataIndex = this.subActionsConfig.findIndex((subActionData) => subActionData.id === actionId);

            if (findSubActionDataIndex === -1) {
                console.error("You incorrect set subAction id in toggleSubActionIsOpen!");

                return;
            };

            this.subActionsConfig[findSubActionDataIndex].isOpen = !this.subActionsConfig[findSubActionDataIndex].isOpen;

            this.$nextTick(() => {
                const subMenuOpenButtonRect = this.$refs.subMenuOpenButton[0]?.getBoundingClientRect();
                const subMenuContainerRect = this.$refs.subMenuContainer[0]?.getBoundingClientRect();

                const { top, left } = calculateAnchoredMenuPosition(AnchoredMenuDirections.RIGHT, subMenuOpenButtonRect, subMenuContainerRect);

                this.subActionsConfig[findSubActionDataIndex].styles.top = `${top}px`;
                this.subActionsConfig[findSubActionDataIndex].styles.left = `${left}px`;
            });
        },
    },
    created() {
        this.initSubActionsConfig();
    },
    mounted() {
        const anchorElementRect = this.anchorRef.getBoundingClientRect();
        const menuElementRect = this.$refs.menu?.getBoundingClientRect();

        if (!anchorElementRect || !menuElementRect) {
            console.error("You incorrect using anchor element or menu element ref in AnchoredMenu using!");

            return;
        };

        this.menuCoords = calculateAnchoredMenuPosition(this.direction, anchorElementRect, menuElementRect);
    },
}
</script>

<style scoped>
.anchored-menu {
    z-index: 100;
    padding: 8px 0px;
    border-radius: 8px;
    background-color: rgb(97, 96, 96);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: start;

    max-height: 150px;
    max-width: 200px;
    overflow-y: auto;
}

.anchored-sub-menu .action {
    padding-left: 16px;
}

.action {
    color: white;
    padding: 8px;
    text-align: start;
    width: 100%;

    flex-shrink: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    transition: all 0.2s ease-in-out;
}

.action:hover {
    cursor: pointer;
    background-color: #b6b2b293;
}

.sub-actions-hr {
    width: 100%;
}
</style>