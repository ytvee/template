<template>
    <button class="inline-action" :style="{ color: fontColor }" :autofocus="autoFocus" @click.stop="onClick">
        <div v-if="iconSrc">
            <img :src="iconSrc" alt="inline action icon" class="icon-image">
        </div>
        <div class="description" v-if="description">
            {{ description }}
        </div>
        <div class="label">{{ label }}</div>
    </button>
</template>

<script>
export default {
    name: "InlineAction",
    props: {
        label: {
            type: String,
            required: true,
        },
        onClick: {
            type: Function,
            required: true,
        },
        autoFocus: {
            type: Boolean,
            required: false,
        },
        iconSrc: {
            type: String,
            required: false,
        },
        fontColor: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
    },
    computed: {
        fontColorClassname() {
            return !this.fontColor
                ? ""
                : this.fontColor;
        }
    },
}
</script>

<style scoped>
.inline-action {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    color: var(--ui-accent-bg, #36ABBB);

    border: none;
    outline: none;
    font-size: 13px;
    background: none;
    padding: 0;
}

.inline-action:hover {
    cursor: pointer;
    filter: brightness(1);
    transform: scale(1);
}

.inline-action:focus {
    color: var(--ui-accent-hover-bg, #43d2e5);
    outline: none;
}

.inline-action div .icon-image {
    filter: brightness(100%);
}

.inline-action:hover div .icon-image {
    filter: brightness(125%);
}

.inline-action:focus div .icon-image {
    filter: brightness(125%);
}

.inline-action .description {
    color: rgba(255, 255, 255, 0.7);
    margin-right: 5px;
}

.inline-action:hover .description {
    -webkit-text-fill-color: rgba(255, 255, 255, 0.7);
}

.inline-action:hover .label {
    -webkit-text-fill-color: var(--ui-accent-hover-bg, #43d2e5);
    color: var(--ui-accent-hover-bg, #43d2e5);
}

.inline-action:focus .label {
    -webkit-text-fill-color: var(--ui-accent-hover-bg, #43d2e5);
    color: var(--ui-accent-hover-bg, #43d2e5);
}
</style>