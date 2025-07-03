<template>
  <div ref="tagsInput" class="tags-input">
    <div v-for="(tag, index) in tagsList" :key="index" :style="{ 'z-index': tagsList.length - index }" class="tag-container">
      <div class="tag-text">{{ tag }}</div>
      <div class="tag-delete-cross" @click="deleteTagHandler(index)">
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.1286 15L30 26.8714V30H26.8714L15 18.1286L3.12857 30H0V26.8714L11.8714 15L0 3.12857V0H3.12857L15 11.8714L26.8714 0H30V3.12857L18.1286 15Z" />
        </svg>
      </div>
    </div>
    <input v-model="inputedValue" type="text" placeholder="Input topic tags" @keydown.enter="addNewTagsAndClearInput" />
  </div>
</template>

<script>
import { nextTick } from "vue";

const TAGS_SEPARATOR = /[\s,.]+/;

export default {
  name: "TagsInput",
  props: {
    exemplarEventBusPrefix: {
      type: String,
      required: false,
      default: "",
    },
  },
  emits: ["tags-edited"],
  data() {
    return {
      tagsList: [],
      inputedValue: "",
    };
  },
  computed: {
    isInputedValueSeparatable() {
      return this.inputedValue.match(TAGS_SEPARATOR);
    },
    isInputedValueEmpty() {
      return !this.inputedValue.trim();
    },
  },
  watch: {
    inputedValue() {
      if (!this.isInputedValueSeparatable) return;
      if (this.isInputedValueEmpty) return;
      this.addNewTagsAndClearInput();
    },
    tagsList: {
      handler(newTagsList) {
        this.$emit("tags-edited", newTagsList);
      },
      deep: true,
    },
  },
  mounted() {
    this.$eventBus.on(this.$props.exemplarEventBusPrefix + "initialize-tags", this.initializeTagsHandler);
  },
  unmounted() {
    this.$eventBus.off(this.$props.exemplarEventBusPrefix + "initialize-tags", this.initializeTagsHandler);
  },
  methods: {
    initializeTagsHandler(initialTags) {
      this.tagsList = [...initialTags];
    },
    scrollToEnd() {
      this.$refs.tagsInput.scrollLeft = this.$refs.tagsInput.scrollWidth;
    },
    addNewTagsAndClearInput() {
      const tags = this.inputedValue
        .split(TAGS_SEPARATOR)
        .filter((tag) => tag.trim())
        .filter((tag) => !this.tagsList.includes(tag));
      this.tagsList.push(...new Set(tags));

      this.inputedValue = "";

      nextTick(this.scrollToEnd);
    },

    deleteTagHandler(index) {
      this.tagsList.splice(index, 1);
    },
  },
};
</script>
<style scoped>
.tags-input {
  padding: 0px 0.9375rem;
  border: var(--thin-border-width) solid var(--color-gray-light);
  border-radius: var(--regular-border-radius);
  display: flex;
  align-items: center;
  gap: 0.9375rem;
  overflow-x: auto;
  overflow-y: hidden;
}
.tag-container {
  position: relative;
}
.tag-text {
  height: 24px;
  border-radius: var(--small-border-radius);
  background: var(--gradient-primary);
  padding: 0px 0.9375rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-dark);
  font-size: var(--medium-font-size-2);
  font-weight: var(--large-font-weight);
  position: relative;
  z-index: 2;
  white-space: nowrap;
}
.tag-delete-cross {
  position: absolute;
  top: 0;
  right: 0px;
  height: 24px;
  width: 24px;
  padding-left: 4px;
  box-sizing: content-box;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-medium);
  transform: translateX(0px);
  border-radius: 0 0.3125rem 0.3125rem 0;
  z-index: 1;
  visibility: hidden;

  opacity: 0;
  transition-property: transform, opacity, visibility;
  transition-duration: var(--default-transition), var(--default-transition), 0s;
  transition-delay: 0s, 0s, var(--default-transition);
}
.tag-container:hover .tag-delete-cross {
  opacity: 1;
  transform: translateX(24px);
  visibility: visible;
  transition-delay: 0s;
}

.tag-delete-cross > svg {
  width: 40%;
  height: 40%;
  fill: var(--color-light);
}
.tags-input > input {
  padding: 0;
  border: unset;
  min-width: 20rem;
}
</style>
