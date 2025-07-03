<template>
  <div class="text-editor">
    <textarea id="post-replay-textarea" ref="textarea" v-model="content" :class="{ error: isWithVisualErrors }" name="" rows="1" :placeholder="placeHolder" @focus="textEditorGotFocusHandler" />
    <div class="text-area-tool-bar-wrapper">
      <TextAreaToolBar :label-prefix="exemplarEventBusPrefix" :files-to-upload-count="filesToUploadLength" @text-area-tool-bar-append-images="textAreaToolBarAppendImagesHandler" />
    </div>
  </div>
</template>

<script>
import { nextTick } from "vue";
import TextAreaToolBar from "./TextEditor/TextAreaToolBar.vue";

export function getFileIndexesNeedToBeAttached(postContent) {
  const regexToGetFilesIndexes = new RegExp("\\!\\[.*?\\|image\\]\\(upload\\:\\/\\/(?<testGroup>.+?)\\)", "g");
  const indexesRegexResult = [...postContent.matchAll(regexToGetFilesIndexes)]; //indexesRegexResult array of arrays.
  const indexesArray = indexesRegexResult.map((regexResult) => regexResult[1]);
  return indexesArray;
}
export function getValidLinksArrayFromContent(content) {
  const validFileLinkRegExp = new RegExp("\\!\\[.*?\\|image\\]\\(.*?\\)", "g");
  const fileLinkUploadIDRegExp = new RegExp("\\!\\[.*?\\|image\\]\\(upload\\://.*?\\)", "g");
  const allImageLinksInContent = content.match(validFileLinkRegExp);
  const allValidLinksInContent = allImageLinksInContent?.filter((item) => !item.match(fileLinkUploadIDRegExp));
  return allValidLinksInContent || [];
}
export function parseURLFromValidLink(validLink) {
  const validLinkURLRegExp = new RegExp(
    // eslint-disable-next-line
    /\!\[.*?\|image\]\((?<testGroup>.+?)\)/
  );
  const result = validLink.match(validLinkURLRegExp)[1]; //found group content

  return result;
}
export default {
  name: "TextEditor",
  components: {
    TextAreaToolBar,
  },
  props: {
    filesToUploadLength: {
      type: Number,
      required: true,
    },
    exemplarEventBusPrefix: {
      //influence to eventBusEvents events names
      type: String,
      required: true,
    },
    placeHolder: {
      type: String,
      required: false,
      default: "",
    },
    isWithVisualErrors: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["content-changed", "text-area-focus", "text-editor-append-images"],
  data() {
    return {
      content: "",
    };
  },
  watch: {
    content: {
      handler(newContent) {
        this.$emit("content-changed", newContent);
      },
      immediate: true,
    },
  },
  mounted() {
    this.$eventBus.on(this.$props.exemplarEventBusPrefix + "initial-content-updated", this.initialContentUpdatedHandler);
    this.$eventBus.on(this.$props.exemplarEventBusPrefix + "text-editor-set-focus", this.textEditorSetFocusHandler);
  },
  unmounted() {
    this.$eventBus.off(this.$props.exemplarEventBusPrefix + "initial-content-updated", this.initialContentUpdatedHandler);
    this.$eventBus.off(this.$props.exemplarEventBusPrefix + "text-editor-set-focus", this.textEditorSetFocusHandler);
  },
  methods: {
    initialContentUpdatedHandler(initialContent) {
      this.content = initialContent;
    },
    textEditorGotFocusHandler() {
      this.$emit("text-area-focus");
    },
    textEditorSetFocusHandler(focusToSet = true) {
      focusToSet ? this.$refs.textarea.focus() : this.$refs.textarea.blur();
    },
    insertMarkdownStringsIntoContent(content, filesToUploadMarkdownStrings, oldSelectionStart) {
      return filesToUploadMarkdownStrings.reduce(
        ([contentWithMarkdownStrings, cursorPosition], markdownString) => {
          return [contentWithMarkdownStrings.substring(0, cursorPosition) + markdownString + contentWithMarkdownStrings.substring(cursorPosition), cursorPosition + markdownString.length];
        },
        [content, oldSelectionStart]
      )[0];
    },
    textAreaToolBarAppendImagesHandler({ appendedFiles, filesToUploadMarkdownStrings }) {
      const oldSelectionStart = this.$refs.textarea.selectionStart;
      this.content = this.insertMarkdownStringsIntoContent(this.content, filesToUploadMarkdownStrings, oldSelectionStart);
      nextTick(() => {
        this.$refs.textarea.focus();
        const cursorPositionToSet = oldSelectionStart + filesToUploadMarkdownStrings.reduce((sum, string) => sum + string.length, 0);
        this.$refs.textarea.setSelectionRange(cursorPositionToSet, cursorPositionToSet);
      });
      this.$emit("text-editor-append-images", appendedFiles);
    },
  },
};
</script>
<style scoped>
.text-editor {
  position: relative;
  margin-bottom: 1.25rem;
  width: 100%;
  height: 100%;
  font-size: var(--forum-post-content-font-size);
  font-weight: var(--regular-font-weight);
  color: var(--color-gray);
}

.text-editor > textarea {
  background: var(--forum-overlay-background-color);
  resize: none;
  height: 100%;
  min-height: 90px;
  border: var(--thin-border-width) solid var(--color-accent-primary);
  border-radius: var(--regular-border-radius);

  padding: 1.125rem 1.3875rem;
  font-size: var(--forum-post-content-font-size);
  font-weight: var(--regular-font-weight);
  color: var(--color-light);
  transition: var(--default-transition);
}
textarea.error {
  border: var(--thin-border-width) solid var(--color-error);
  transition: var(--default-transition);
}

.text-area-tool-bar-wrapper {
  position: absolute;
  right: 10px;
  bottom: 10px;
  display: flex;
}

.text-editor > textarea::placeholder {
  font-size: var(--medium-font-size-2);
  font-weight: var(--large-font-weight);
}
</style>
