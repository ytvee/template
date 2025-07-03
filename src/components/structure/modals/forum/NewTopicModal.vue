<template>
  <div class="new-topic-modal">
    <div class="topic-name-row">
      <div class="input-topic-name-holder" :class="{ error: !isNameValidVisual }">
        <input v-model="editedTopic.topicTitle" type="text" placeholder="Enter topic name" />
        <div v-show="titleSymbolsCount > 40" class="title-characters-counter-holder">{{ titleSymbolsCount }}/50</div>
      </div>
      <CloseModalButton />
    </div>
    <div class="artist-section">
      <div class="h4-wrapper">
        <h4>Tags</h4>
      </div>
      <TagsInput :exemplar-event-bus-prefix="EVENT_BUS_PREFIX" @tags-edited="tagsEditedHandler" />
    </div>

    <div class="description-section">
      <div class="h4-wrapper">
        <h4>Description</h4>
      </div>

      <div class="text-editor-wrapper">
        <TextEditor ref="textEditor" :exemplar-event-bus-prefix="EVENT_BUS_PREFIX" :files-to-upload-length="filesToUpload.length" :is-with-visual-errors="!isDescriptionValidVisual" @content-changed="contentChangedHandler" @text-editor-append-images="textEditorAppendImagesHandler" />
      </div>
    </div>

    <div class="buttons-holder">
      <button v-if="isNewTopic" :disabled="!isCreateTopicButtonEnabled" class="large" @click="createTopicHandler">Create topic</button>
      <button v-else :disabled="!isSaveAvailable" class="large" @click="editTopicHandler">Save changes</button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";
import TagsInput from "@/components/common/navigation/inputs/TagsInput.vue";
import TextEditor from "@/components/structure/forum/Topic/PostReply/TextEditor.vue";
import { getFileIndexesNeedToBeAttached, getValidLinksArrayFromContent, parseURLFromValidLink } from "@/components/structure/forum/Topic/PostReply/TextEditor.vue";
import storeModules from "@/data/store/storeModules.json";
import { mapState, mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import routerPaths from "@/data/router/path/routerPaths.json";

const MAX_TOPIC_DESCRIPTION_SYMBOLS_COUNT = 2500;
const MAX_TOPIC_TITLE_SYMBOLS_COUNT = 50;

const EVENT_BUS_PREFIX = "new-topic-modal-";
export default {
  name: "NewTopicModal",
  components: {
    CloseModalButton,
    TagsInput,
    TextEditor,
  },
  data() {
    return {
      originalTopic: {
        topicTitle: "",
        topicDescription: "",
        topicTags: [],
      },
      editedTopic: {
        topicTitle: "",
        topicDescription: "",
        topicTags: [],
      },
      isTopicDescriptionChangedFirstTime: false,
      topicSlug: "",
      topicId: "",
      categoryId: "",

      editPostUuid: undefined, //uuid for topic description
      filesToUpload: [],
      EVENT_BUS_PREFIX,
    };
  },
  computed: {
    ...mapState(storeModules.MODAL, {
      modalProps: (state) => state.modal.displayedComponentProps,
      isVisible: (state) => state.isVisible,
    }),
    isNewTopic() {
      return this.modalProps.isNewTopic;
    },
    isNameValid() {
      return this.titleSymbolsCount > 0 && this.titleSymbolsCount <= MAX_TOPIC_TITLE_SYMBOLS_COUNT;
    },
    isEditedTopicValid() {
      return this.isNameValid && this.isDescriptionValid;
    },
    isDescriptionValid() {
      return this.descriptionSymbolsCount > 0 && this.descriptionSymbolsCount <= MAX_TOPIC_DESCRIPTION_SYMBOLS_COUNT;
    },
    isNameValidVisual() {
      return this.titleSymbolsCount <= MAX_TOPIC_TITLE_SYMBOLS_COUNT;
    },
    isDescriptionValidVisual() {
      return this.isTopicDescriptionChangedFirstTime ? this.isDescriptionValid : true;
    },
    titleSymbolsCount() {
      return this.editedTopic.topicTitle.length;
    },
    descriptionSymbolsCount() {
      //TODO: move to textEditor component
      return this.editedTopic.topicDescription.length;
    },
    isCreateTopicButtonEnabled() {
      return this.isEditedTopicValid;
    },
    isDescriptionChanged() {
      return this.editedTopic.topicDescription !== this.originalTopic.topicDescription;
    },
    isTopicTitleChanged() {
      return this.editedTopic.topicTitle !== this.originalTopic.topicTitle;
    },
    isTopicTagsEdited() {
      return !_.isEqual(this.originalTopic.topicTags, this.editedTopic.topicTags);
    },
    isTopicTitleOrTagsChanged() {
      return this.isTopicTitleChanged || this.isTopicTagsEdited;
    },
    isTopicChanged() {
      return !_.isEqual(this.originalTopic, this.editedTopic);
    },
    isSaveAvailable() {
      return this.isEditedTopicValid && this.isTopicChanged;
    },
  },
  watch: {
    "originalTopic.topicDescription": {
      handler(newTopicDescripton) {
        this.$eventBus.emit(EVENT_BUS_PREFIX + "initial-content-updated", newTopicDescripton);
      },
      immediate: true,
    },
    "editedTopic.topicDescription"() {
      this.isTopicDescriptionChangedFirstTime = true;
    },
    isVisible: {
      //instead of mounted Due to the fact that the component is not mounted every time it is shown
      async handler(newIsVisible) {
        if (newIsVisible) {
          this[modalActions.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY](true);
          this.categoryId = this.modalProps.categoryId;
          if (!this.modalProps.isNewTopic) {
            await this.loadTopicToEdit();
          }
          this.isTopicDescriptionChangedFirstTime = false;
          this.$eventBus.emit(EVENT_BUS_PREFIX + "initialize-tags", this.editedTopic.topicTags);
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY]),
    contentChangedHandler(content) {
      this.editedTopic.topicDescription = content;
    },
    textEditorAppendImagesHandler(appendedFiles) {
      this.filesToUpload = [...this.filesToUpload, ...appendedFiles];
    },
    async loadTopicToEdit() {
      await this.$load(async () => {
        this.topicSlug = this.modalProps.slug;
        this.topicId = this.modalProps.topicId;
        this.originalTopic.topicTitle = this.modalProps.topicTitle || "";
        const {
          data: { data },
        } = await this.$api.forum.getMessage(this.modalProps.topicFirstPostId);
        this.originalTopic.topicDescription = data.raw || "";
        this.editPostUuid = data.uuid;
        this.originalTopic.topicTags = this.modalProps.topicTags || [];

        Object.assign(this.editedTopic, this.originalTopic);
      });
    },
    tagsEditedHandler(editedTags) {
      this.editedTopic.topicTags = [...editedTags];
    },

    /* upload images functions. Need to move to module */
    obtainFormData(filesWithMetadata, presignedLink) {
      const formData = new FormData();
      formData.append("key", presignedLink.fields.key);
      formData.append("AWSAccessKeyId", presignedLink.fields.AWSAccessKeyId);
      formData.append("x-amz-security-token", presignedLink.fields["x-amz-security-token"]);
      formData.append("policy", presignedLink.fields.policy);
      formData.append("signature", presignedLink.fields.signature);
      formData.append("file", filesWithMetadata.file);
      return formData;
    },
    async uploadFileViaPresignedLink(fileWithMetadata, presignedLinks) {
      const presignedLink = presignedLinks.find((item) => {
        return item.id === fileWithMetadata.id;
      });
      const formData = this.obtainFormData(fileWithMetadata, presignedLink);
      await this.$api.artist.uploadImageViaPresignedURL(presignedLink.url, formData);
    },
    async uploadFilesViaPresignedLinks(filesWithMetadata, presignedLinks) {
      for (let i = 0; i < filesWithMetadata.length; i++) {
        await this.uploadFileViaPresignedLink(filesWithMetadata[i], presignedLinks);
      }
    },
    changePostHeadersForAmazonStorage() {
      this.$api.removeHeader("authorization");
      this.$api.setHeader("content-type", "multipart/form-data");
      // this.$api.setHeader("cache-control", "no-cache");
    },
    restorePostHeaders() {
      this.$api.setHeader("content-type", "application/json");
      // this.$api.removeHeader("cache-control");
      this.$api.autoConfigure();
    },
    getFileFormat(fileName) {
      return fileName?.split(".").pop();
    },
    async getPresignedLinksAndUuidFromBackend(filteredFilesWithMetadataToUpload) {
      const filesMetadataForPayload = filteredFilesWithMetadataToUpload.map((fileWithMetadata) => {
        return {
          alt: fileWithMetadata.file.name,
          format: this.getFileFormat(fileWithMetadata.file.name),
          id: fileWithMetadata.id,
        };
      });
      const payload = {
        topic_id: this.topicId,
        files: filesMetadataForPayload,
      };
      const {
        data: { data: resdata },
      } = await this.$api.forum.sendAttachedFilesMetadata(payload);
      return resdata;
    },
    getFilteredFilesWithMetadataToUpload(fileIndexesNeedToBeAttached, filesToUpload) {
      //Only presented in textarea files will be uploaded. Not all files added by file input.
      const filteredFilesWithMetadataToUpload = [];
      for (let i = 0; i < fileIndexesNeedToBeAttached.length; i++) {
        if (fileIndexesNeedToBeAttached[i] >= 0 && fileIndexesNeedToBeAttached[i] < filesToUpload.length) {
          const fileWithMetadata = {
            id: fileIndexesNeedToBeAttached[i],
            file: filesToUpload[fileIndexesNeedToBeAttached[i]],
          };
          filteredFilesWithMetadataToUpload.push(fileWithMetadata);
        }
      }
      return filteredFilesWithMetadataToUpload;
    },
    async uploadAttachedFiles(fileIndexesNeedToBeAttached, filesToUpload, existingUuid) {
      const filteredFilesWithMetadataToUpload = this.getFilteredFilesWithMetadataToUpload(fileIndexesNeedToBeAttached, filesToUpload);
      const presignedLinksAndUuid = await this.getPresignedLinksAndUuidFromBackend(filteredFilesWithMetadataToUpload, existingUuid);
      try {
        this.changePostHeadersForAmazonStorage();
        await this.uploadFilesViaPresignedLinks(filteredFilesWithMetadataToUpload, presignedLinksAndUuid.presigned_links);
        this.restorePostHeaders();
      } catch {
        this.restorePostHeaders();
      }
      return {
        uuid: presignedLinksAndUuid.uuid,
        fileLinksWithIds: presignedLinksAndUuid.presigned_links.map((presignedLink) => {
          return {
            id: presignedLink.id,
            fileLink: presignedLink.url + presignedLink.fields.key,
          };
        }),
      };
    },
    isNeedToUploadAttachedFiles(fileIndexesNeedToBeAttached) {
      return fileIndexesNeedToBeAttached?.length;
    },
    replaceUploadMarkdownWithValidLinks(postContent, fileLinksWithIds) {
      const regexToGetFilesIndexes = new RegExp("(\\!\\[)(?<filename>.*?)(\\|image\\])(?<uri>\\(upload\\:\\/\\/(?<testGroup>.+?)\\))", "g");
      const replacer = (match, p1, filename, p3, uri, id) => {
        const fileValidUri = fileLinksWithIds.find((fileWithId) => fileWithId.id === id)?.fileLink;
        return p1 + filename + p3 + "(" + fileValidUri + ")";
      };
      return postContent.replace(regexToGetFilesIndexes, replacer);
    },
    async uploadAttachedImagesAndManageUuid(postContent, filesToUpload) {
      const fileIndexesNeedToBeAttached = getFileIndexesNeedToBeAttached(postContent);
      let contentForPayload = postContent;
      let uuidAndFileLinksWithIds = {};
      if (this.isNeedToUploadAttachedFiles(fileIndexesNeedToBeAttached)) {
        uuidAndFileLinksWithIds = await this.uploadAttachedFiles(fileIndexesNeedToBeAttached, filesToUpload, this.editPostUuid);
        contentForPayload = this.replaceUploadMarkdownWithValidLinks(postContent, uuidAndFileLinksWithIds.fileLinksWithIds);
      }
      return { contentForPayload, uuid: uuidAndFileLinksWithIds.uuid };
    },
    createTopicHandler() {
      this.$load(async () => {
        const { contentForPayload, uuid } = await this.uploadAttachedImagesAndManageUuid(this.editedTopic.topicDescription, this.filesToUpload);
        const payload = {
          title: this.editedTopic.topicTitle,
          description: contentForPayload,
          category_id: this.categoryId,
        };
        if (uuid) {
          payload.uuid = uuid;
        }
        if (this.editedTopic.topicTags.length) {
          payload.tags = [...this.editedTopic.topicTags];
        }
        const {
          data: { data: resdata },
        } = await this.$api.forum.createTopic(payload);
        this.$router.push({
          path: routerPaths.FORUM + routerPaths["/"] + resdata.id,
        });
        await this.$eventBus.emit("new-topic-modal-topic-created");
        this.closeModal();
      });
    },
    async editTopicTitleAndTags() {
      await this.$load(async () => {
        const payload = {
          slug: this.topicSlug,
          topic_id: this.topicId,
          old_category_id: this.categoryId,
          // "catetgory_id": 3, //optional //will change the topic category
        };
        if (this.isTopicTitleChanged) {
          payload.title = this.editedTopic.topicTitle; //optional //will change topic title
        }
        if (this.isTopicTagsEdited) {
          payload.tags = [...this.editedTopic.topicTags]; //optional //will replace all tags by this array
        }
        await this.$api.forum.editTopic(payload);
      });
    },

    getFilesToRemove() {
      const validLinksInOldPostContent = getValidLinksArrayFromContent(this.originalTopic.topicDescription);
      const validLinksInPostContent = getValidLinksArrayFromContent(this.editedTopic.topicDescription);

      const validLinksForRemove = validLinksInOldPostContent.filter((linkInOldPostContent) => {
        return !validLinksInPostContent.includes(linkInOldPostContent);
      });
      return validLinksForRemove.map((validLink) => parseURLFromValidLink(validLink));
    },
    obtainEditTopicDescriptionPayload(contentForPayload, uuid) {
      const payload = {
        message: contentForPayload,
        category_id: this.categoryId,
        post_id: this.modalProps.topicFirstPostId,
      };
      const uuidToPayload = this.editPostUuid || uuid; //uuid from post if it has already taken it or generated uuid for this post or null if no images with this post.
      if (uuidToPayload) {
        payload.uuid = uuidToPayload;
      }
      const filesToRemove = this.getFilesToRemove();
      if (filesToRemove.length) {
        //TODO: files to remove
        payload.files_to_remove = [...filesToRemove];
      }
      return payload;
    },
    async editTopicDescription() {
      await this.$load(async () => {
        const { contentForPayload, uuid } = await this.uploadAttachedImagesAndManageUuid(this.editedTopic.topicDescription, this.filesToUpload);
        const payload = this.obtainEditTopicDescriptionPayload(contentForPayload, uuid);

        await this.$api.forum.editMessage(payload);
      });
    },
    async editTopicHandler() {
      if (this.isDescriptionChanged) {
        await this.editTopicDescription();
      }
      if (this.isTopicTitleOrTagsChanged) {
        await this.editTopicTitleAndTags();
      }
      await this.$eventBus.emit("new-topic-modal-topic-edited");
      this.closeModal();
    },
    closeModal() {
      this[modalActions.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY](false);
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
  },
};
</script>

<style scoped>
.new-topic-modal {
  width: 1000px;
  max-width: 70vw;
  border-radius: var(--medium-border-radius);
  background: var(--color-dark);
  padding: 50px;

  color: var(--color-gray);
}

.topic-name-row {
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--medium-block-gap);
}

.artist-section {
  margin-bottom: 1.875rem;
}
.h4-wrapper {
  margin-bottom: 0.625rem;
}
.h4-wrapper > h4 {
  color: var(--color-gray);
}

.description-section {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
}

.text-editor-wrapper {
  height: 150px;
}
/* .text-editor-wrapper.error > textarea {
  border: var(--input-border-width) solid var(--color-error);
  transition: var(--default-transition);
} */

/* .description-characters-counter-holder {
  bottom: 0.625rem;
  right: 0.9375rem;
} */
/* .description-characters-counter-holder, */
.title-characters-counter-holder {
  position: absolute;
  color: var(--color-accent-primary);

  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* .text-editor-wrapper.error .description-characters-counter-holder, */
.input-topic-name-holder.error .title-characters-counter-holder {
  color: var(--color-error);
  background: var(--color-error);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.input-topic-name-holder.error > input {
  color: var(--color-error);
}

/* .icon-holder {
  margin-left: auto;
  cursor: pointer;
} */

/* .icon-holder svg {
  fill: var(--color-gray);
  transition: var(--default-transition);
} */

/* .icon-holder:hover svg {
  fill: url(#theme-gradient-accent);
  transition: var(--default-transition);
} */

/* .icon-holder:active svg {
  fill: url(#theme-gradient-accent);
  opacity: 50%;
  transition: var(--default-transition);
} */

.buttons-holder {
  display: flex;
  justify-content: flex-end;
}

.buttons-holder > button.large {
  width: unset;
}

.input-topic-name-holder {
  flex-grow: 1;
  position: relative;
}

.input-topic-name-holder > input {
  border: none;
  height: unset;
  padding: 0;
  font-size: var(--h2-font-size);
  font-weight: var(--h2-font-weight);
}

.input-topic-name-holder > input::placeholder {
  color: var(--color-gray-medium);
}
</style>
