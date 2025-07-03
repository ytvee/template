<template>
  <div class="post-reply">
    <div v-if="isWithCookedQuote" class="left-column">
      <div class="reply-icon-wrapper">
        <svg class="reply-icon" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.601579 17.3332C0.583765 17.3333 0.565951 17.3319 0.548281 17.3291C0.396933 17.3058 0.276366 17.1882 0.247151 17.0352C-0.461138 13.3088 0.36501 9.86092 2.57027 7.32669C4.88868 4.66375 8.48167 3.26064 12.4744 3.44441L12.4745 0.367882C12.4744 0.219088 12.5625 0.0849398 12.6976 0.0279475C12.8327 -0.0289001 12.9882 0.00256833 13.0915 0.107854L19.8942 7.03039C20.0353 7.17411 20.0353 7.40689 19.8942 7.5506L13.0915 14.4731C12.9882 14.5784 12.8327 14.61 12.6976 14.5531C12.5625 14.4962 12.4744 14.3621 12.4745 14.2131V11.2528C7.49201 10.11 2.9108 13.3127 0.92063 17.138C0.858069 17.2581 0.735258 17.3332 0.601579 17.3332Z" />
        </svg>
      </div>
    </div>
    <div class="center-column">
      <PostToBeRepliedSummaryBlock v-if="isWithCookedQuote" :is-post-to-be-replied-quote-removable="isPostToBeRepliedQuoteRemovable" :current-post-to-be-replied="currentPostToBeReplied" @reply-to-summary-click="replyToSummaryClickHandler" @remove-reply-button-click="removeReplyButtonHandler" />
      <div class="text-editor-wrapper">
        <TextEditor ref="textEditor" :exemplar-event-bus-prefix="EVENT_BUS_PREFIX" :files-to-upload-length="filesToUpload.length" place-holder="Write what do you think about this..." @content-changed="contentChangedHandler" @text-area-focus="textareaFocusHandler" @text-editor-append-images="textEditorAppendImagesHandler" />
      </div>
      <div class="buttons-holder">
        <button class="large" :disabled="!isValidToSend" @click="sendButtonHandler">
          {{ sendButtonLabel }}
        </button>
        <button v-show="isPostReplyPositionFixed" class="large outlined" @click="cancelButtonHanlder">Cancel</button>
      </div>
    </div>
    <div v-if="isWithCookedQuote" class="right-column"></div>
  </div>
</template>

<script>
import { nextTick } from "vue";

import { mapActions } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import modalActions from "@/data/store/modal/modalActions.json";

import PostToBeRepliedSummaryBlock from "./PostReply/PostToBeRepliedSummaryBlock.vue";
import TextEditor from "@/components/structure/forum/Topic/PostReply/TextEditor.vue";
import { getFileIndexesNeedToBeAttached, getValidLinksArrayFromContent, parseURLFromValidLink } from "@/components/structure/forum/Topic/PostReply/TextEditor.vue";
import ConfirmDataLoseModal from "../../modals/forum/ConfirmDataLoseModal.vue";

const FORM_USAGE_CASES = {
  REPLY_TO_TOPIC: "REPLY_TO_TOPIC",
  REPLY_TO_POST: "REPLY_TO_POST",
  EDIT_POST: "EDIT_POST",
};
const EVENT_BUS_PREFIX = "post-reply-";
export default {
  name: "PostReply",
  components: {
    PostToBeRepliedSummaryBlock,
    TextEditor,
  },
  props: {
    categoryId: {
      type: String,
      required: true,
    },
    topicId: {
      type: String,
      required: true,
    },
    topicName: {
      type: String,
      required: true,
    },
    isPostReplyPositionFixed: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["new-post-sent", "post-edited", "update:is-post-reply-position-fixed", "transit-to-post-to-be-replied"],
  data() {
    return {
      currentFormUsageCase: FORM_USAGE_CASES.REPLY_TO_TOPIC,

      emptyPostToBeReplied: {
        replyPostId: "",
        replyPostIndexFromOne: "", //index from one in topic
        replyUser: "",
        replyCookedContent: "",
        replyRawQuote: "",
      },
      initialPostToBeReplied: {},
      currentPostToBeReplied: {},

      editPostId: "",
      editPostNumber: null,
      editPostUuid: null,
      oldPostContent: "",

      postContent: "",

      filesToUpload: [], //images or something
      EVENT_BUS_PREFIX,
    };
  },
  computed: {
    isWithCookedQuote() {
      return Boolean(this.currentPostToBeReplied.replyUser || this.currentPostToBeReplied.replyCookedContent || null);
    },
    isPostToBeRepliedQuoteRemovable() {
      switch (this.currentFormUsageCase) {
        case FORM_USAGE_CASES.REPLY_TO_TOPIC:
        case FORM_USAGE_CASES.REPLY_TO_POST:
          return true;
        case FORM_USAGE_CASES.EDIT_POST:
          return false;
        default:
          return null;
      }
    },
    isPostContentValid() {
      return this.postContent.length > 0;
    },
    isPostContentDiffersFromOldPostContent() {
      return this.oldPostContent.normalize() !== this.postContent.normalize();
    },
    isInitialPostToBeRepliedDiffersFromCurrent() {
      return this.initialPostToBeReplied.replyPostIndexFromOne !== this.currentPostToBeReplied.replyPostIndexFromOne || this.initialPostToBeReplied.replyCookedContent !== this.currentPostToBeReplied.replyCookedContent || this.initialPostToBeReplied.replyUser !== this.currentPostToBeReplied.replyUser;
    },
    isValidToSend() {
      switch (this.currentFormUsageCase) {
        case FORM_USAGE_CASES.REPLY_TO_TOPIC:
          return this.isPostContentValid;
        case FORM_USAGE_CASES.REPLY_TO_POST:
          return this.isPostContentValid;
        case FORM_USAGE_CASES.EDIT_POST:
          return this.isPostContentValid && (this.isPostContentDiffersFromOldPostContent || this.isInitialPostToBeRepliedDiffersFromCurrent);
        default:
          return null;
      }
    },
    isPostContentHaveData() {
      return Boolean(this.postContent.length);
    },
    isHaveUnsavedData() {
      switch (this.currentFormUsageCase) {
        case FORM_USAGE_CASES.REPLY_TO_TOPIC:
          return this.isPostContentHaveData;
        case FORM_USAGE_CASES.REPLY_TO_POST:
          return this.isPostContentHaveData;
        case FORM_USAGE_CASES.EDIT_POST:
          return this.isPostContentDiffersFromOldPostContent || this.isInitialPostToBeRepliedDiffersFromCurrent;
        default:
          return null;
      }
    },
    sendButtonLabel() {
      switch (this.currentFormUsageCase) {
        case FORM_USAGE_CASES.REPLY_TO_TOPIC:
          return "Send";
        case FORM_USAGE_CASES.REPLY_TO_POST:
          return "Reply";
        case FORM_USAGE_CASES.EDIT_POST:
          return "Save";
        default:
          return null;
      }
    },
  },
  mounted() {
    this.$eventBus.on("start-topic-replying", this.startTopicReplyingEventHandler);
    this.$eventBus.on("start-post-replying", this.startPostReplyingEventHandler);
    this.$eventBus.on("start-post-editing", this.startPostEditingEventHandler);
  },
  unmounted() {
    this.$eventBus.off("start-topic-replying", this.startTopicReplyingEventHandler);
    this.$eventBus.off("start-post-replying", this.startPostReplyingEventHandler);
    this.$eventBus.off("start-post-editing", this.startPostEditingEventHandler);
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL, modalActions.SET_MODAL_VISIBILITY]),
    updateOldPostContent(oldPostContent) {
      this.oldPostContent = oldPostContent;
      this.$eventBus.emit(EVENT_BUS_PREFIX + "initial-content-updated", oldPostContent);
    },
    contentChangedHandler(content) {
      this.postContent = content;
    },
    textEditorAppendImagesHandler(appendedFiles) {
      this.filesToUpload = [...this.filesToUpload, ...appendedFiles];
    },
    confirmDataLoseModalProps(callBackToRunOnConfirm) {
      return {
        displayedComponent: ConfirmDataLoseModal,
        displayedComponentProps: {
          callBackToRunOnConfirm: callBackToRunOnConfirm,
        },
      };
    },
    resetCurrentPostToBeReplied() {
      Object.assign(this.currentPostToBeReplied, this.emptyPostToBeReplied);
    },
    resetInitialAndCurrentPostToBeReplied() {
      Object.assign(this.initialPostToBeReplied, this.emptyPostToBeReplied);
      Object.assign(this.currentPostToBeReplied, this.emptyPostToBeReplied);
    },
    removeReplyButtonHandler() {
      switch (this.currentFormUsageCase) {
        case FORM_USAGE_CASES.REPLY_TO_POST:
          this.currentFormUsageCase = FORM_USAGE_CASES.REPLY_TO_TOPIC;
          this.resetInitialAndCurrentPostToBeReplied();
          break;
        case FORM_USAGE_CASES.EDIT_POST:
          this.resetCurrentPostToBeReplied();
          break;
      }
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
    getFileFormat(fileName) {
      return fileName?.split(".").pop();
    },
    async getPresignedLinksAndUuidFromBackend(filteredFilesWithMetadataToUpload, existingUuid) {
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
      if (existingUuid) {
        payload.uuid = existingUuid;
      }
      const {
        data: { data: resdata },
      } = await this.$api.forum.sendAttachedFilesMetadata(payload);
      return resdata;
    },
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
      const responseUploadImage = await this.$api.artist.uploadImageViaPresignedURL(presignedLink.url, formData);
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
    obtainReplyToTopicPayload(contentForPayload, uuid) {
      const payload = {
        message: contentForPayload,
        category_id: this.$props.categoryId,
        topic_id: this.$props.topicId,
      };
      if (uuid) {
        payload.uuid = uuid;
      }
      return payload;
    },
    obtainReplyToPostPayload(contentForPayload, uuid) {
      const payload = {
        message: this.currentPostToBeReplied.replyRawQuote + contentForPayload,
        category_id: this.$props.categoryId,
        topic_id: this.$props.topicId,
        reply_to_post_number: this.currentPostToBeReplied.replyPostIndexFromOne,
      };
      if (uuid) {
        payload.uuid = uuid;
      }
      return payload;
    },

    getFilesToRemove() {
      const validLinksInOldPostContent = getValidLinksArrayFromContent(this.oldPostContent);
      const validLinksInPostContent = getValidLinksArrayFromContent(this.postContent);

      const validLinksForRemove = validLinksInOldPostContent.filter((linkInOldPostContent) => {
        return !validLinksInPostContent.includes(linkInOldPostContent);
      });
      return validLinksForRemove.map((validLink) => parseURLFromValidLink(validLink));
    },
    obtainEditPostPayload(contentForPayload, uuid) {
      const payload = {
        message: this.currentPostToBeReplied.replyRawQuote + contentForPayload,
        category_id: this.$props.categoryId,
        post_id: this.editPostId,
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

    clearForm() {
      this.currentFormUsageCase = FORM_USAGE_CASES.REPLY_TO_TOPIC;
      this.resetInitialAndCurrentPostToBeReplied();
      this.editPostId = this.editPostNumber = "";
      this.editPostUuid = null;
      this.updateOldPostContent("");

      this.filesToUpload = [];
    },
    clearAndUnpinForm() {
      this.clearForm();
      this.$emit("update:is-post-reply-position-fixed", false);
    },
    removeQuoteFromPostRawContent(rawPostContent) {
      const quoteCloseTag = "[/quote]\n";
      const indexOfQuoteCloseTag = rawPostContent.lastIndexOf(quoteCloseTag);
      if (indexOfQuoteCloseTag === -1) {
        return rawPostContent;
      }
      const rawPostContentWithoutQuote = rawPostContent.slice(indexOfQuoteCloseTag + quoteCloseTag.length);
      return rawPostContentWithoutQuote;
    },
    async obtainAndSetReplyRawQuote() {
      if (this.currentPostToBeReplied.replyPostId) {
        const result = await this.$api.forum.getMessage(this.currentPostToBeReplied.replyPostId);
        const rawReplyPostContent = result?.data?.data?.raw;
        const rawReplyPostContentWithoutQoute = this.removeQuoteFromPostRawContent(rawReplyPostContent);
        //TODO: post:${this.currentPostToBeReplied.replyPostId} cause mess. Need to be remade with discourse. Should be: post:${this.currentPostToBeReplied.replyPostNumber} postid:${this.currentPostToBeReplied.replyPostId}
        this.currentPostToBeReplied.replyRawQuote = `[quote="${this.currentPostToBeReplied.replyUser}, post:${this.currentPostToBeReplied.replyPostId}, topic:${this.$props.topicId}, full:true"]${rawReplyPostContentWithoutQoute}[/quote]\n`;
      }
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
    sendButtonHandler() {
      switch (this.currentFormUsageCase) {
        case FORM_USAGE_CASES.REPLY_TO_TOPIC:
          this.$load(async () => {
            const { contentForPayload, uuid } = await this.uploadAttachedImagesAndManageUuid(this.postContent, this.filesToUpload);
            const payload = this.obtainReplyToTopicPayload(contentForPayload, uuid);
            const response = await this.$api.forum.createMessage(payload);
            const {
              data: {
                data: { post_id, stream }, //TODO
              },
            } = response;
            this.$emit("new-post-sent", { post_id, stream });
            this.clearAndUnpinForm();
          });
          break;
        case FORM_USAGE_CASES.REPLY_TO_POST:
          this.$load(async () => {
            const { contentForPayload, uuid } = await this.uploadAttachedImagesAndManageUuid(this.postContent, this.filesToUpload);
            await this.obtainAndSetReplyRawQuote();
            const payload = this.obtainReplyToPostPayload(contentForPayload, uuid);
            const response = await this.$api.forum.createMessage(payload);
            const {
              data: {
                data: { post_id, stream },
              },
            } = response;
            this.$emit("new-post-sent", { post_id, stream });
            this.clearAndUnpinForm();
          });
          break;
        case FORM_USAGE_CASES.EDIT_POST:
          this.$load(async () => {
            const { contentForPayload, uuid } = await this.uploadAttachedImagesAndManageUuid(this.postContent, this.filesToUpload);
            const payload = this.obtainEditPostPayload(contentForPayload, uuid);
            const response = await this.$api.forum.editMessage(payload);

            this.$emit("post-edited", this.editPostId);
            this.finishPostEditing(this.editPostId);
            this.clearAndUnpinForm();
          });
          break;
      }
    },
    pinFormAndFocusTextEditor() {
      this.$emit("update:is-post-reply-position-fixed", true);
      nextTick(() => this.$eventBus.emit(EVENT_BUS_PREFIX + "text-editor-set-focus", true));
    },
    textareaFocusHandler() {
      this.$emit("update:is-post-reply-position-fixed", true);
    },
    cancelButtonHanlder() {
      switch (this.currentFormUsageCase) {
        case FORM_USAGE_CASES.EDIT_POST:
          this.$eventBus.emit("post-editing-finished", this.editPostId);
          break;
      }
      this.clearAndUnpinForm();
    },
    removeQuoteFromPostCookedContent(cookedPostContent) {
      const quoteCloseTag = "</aside>";
      const indexOfQuoteCloseTag = cookedPostContent.lastIndexOf(quoteCloseTag);
      if (indexOfQuoteCloseTag === -1) {
        return cookedPostContent;
      }
      const cookedPostContentWithoutQuote = cookedPostContent.slice(indexOfQuoteCloseTag + quoteCloseTag.length);
      return cookedPostContentWithoutQuote;
    },
    initializePostReplying(postToReplyData) {
      this.currentFormUsageCase = FORM_USAGE_CASES.REPLY_TO_POST;
      this.currentPostToBeReplied.replyPostId = postToReplyData.replyPostId;
      this.currentPostToBeReplied.replyUser = postToReplyData.user;
      this.currentPostToBeReplied.replyCookedContent = this.removeQuoteFromPostCookedContent(postToReplyData.content);
      this.currentPostToBeReplied.replyPostIndexFromOne = postToReplyData.postIndexFromOne;
      this.pinFormAndFocusTextEditor();
    },
    clearPostEditingAndInitializePostReplying(postToReplyData) {
      this.finishPostEditing(this.editPostId);
      this.clearForm();
      this.initializePostReplying(postToReplyData);
    },
    startPostReplyingEventHandler(postToReplyData) {
      switch (this.currentFormUsageCase) {
        case FORM_USAGE_CASES.REPLY_TO_TOPIC:
        case FORM_USAGE_CASES.REPLY_TO_POST:
          this.initializePostReplying(postToReplyData);
          break;
        case FORM_USAGE_CASES.EDIT_POST:
          if (this.isHaveUnsavedData) {
            this.openConfirmDataLoseModal(() => this.clearPostEditingAndInitializePostReplying(postToReplyData));
          } else {
            this.clearPostEditingAndInitializePostReplying(postToReplyData);
          }
          break;
      }
    },
    async obtainPostFromApi(postId) {
      const result = await this.$api.forum.getMessage(postId);
      return result?.data?.data;
    },
    setInitialAndCurrentPostToBeRepliedFromPostToEditContent(cookedContent, rawContent) {
      const parser = new DOMParser();
      const contentHtmlDoc = parser.parseFromString(cookedContent, "text/html");
      const bodyElement = contentHtmlDoc.querySelector("body");
      const asideElement = bodyElement.querySelector("aside");
      if (asideElement) {
        this.initialPostToBeReplied.replyUser = asideElement.dataset.username;
        this.initialPostToBeReplied.replyPostIndexFromOne = Number(asideElement.dataset.post);
        const blockquoteElement = asideElement.querySelector("blockquote");
        this.initialPostToBeReplied.replyCookedContent = blockquoteElement.innerHTML.trim(); //remove \n at the start and at the end of quote content
      }
      this.initialPostToBeReplied.replyRawQuote = this.getQuoteFromPostRawContent(rawContent);
      Object.assign(this.currentPostToBeReplied, this.initialPostToBeReplied);
    },
    getQuoteFromPostRawContent(rawPostContent) {
      const quoteCloseTag = "[/quote]\n";
      const indexOfQuoteCloseTag = rawPostContent.lastIndexOf(quoteCloseTag);
      if (indexOfQuoteCloseTag === -1) {
        return "";
      }
      const rawPostContentQuote = rawPostContent.slice(0, indexOfQuoteCloseTag + quoteCloseTag.length);
      return rawPostContentQuote;
    },
    openConfirmDataLoseModal(callBackToRunOnConfirm) {
      this[modalActions.SET_MODAL](this.confirmDataLoseModalProps(callBackToRunOnConfirm));
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    finishPostEditing(editPostId) {
      this.$eventBus.emit("post-editing-finished", editPostId);
    },
    initializePostEditing(postToEditData) {
      this.$eventBus.emit("post-editing-started", postToEditData.editPostId);
      this.$load(async () => {
        this.finishPostEditing(this.editPostId);
        this.currentFormUsageCase = FORM_USAGE_CASES.EDIT_POST;
        this.resetInitialAndCurrentPostToBeReplied();
        this.editPostId = postToEditData.editPostId;
        this.editPostNumber = postToEditData.editPostNumber;

        const postToEdit = await this.obtainPostFromApi(this.editPostId);
        this.editPostUuid = postToEdit.uuid;

        this.setInitialAndCurrentPostToBeRepliedFromPostToEditContent(postToEdit?.cooked, postToEdit?.raw);
        this.updateOldPostContent(this.removeQuoteFromPostRawContent(postToEdit?.raw));

        this.pinFormAndFocusTextEditor();
      });
    },
    initializePostEditingAfterUnsavedChangesCheck(postToEditData) {
      if (this.isHaveUnsavedData) {
        this.openConfirmDataLoseModal(() => this.initializePostEditing(postToEditData));
      } else {
        this.initializePostEditing(postToEditData);
      }
    },
    startPostEditingEventHandler(postToEditData) {
      this.initializePostEditingAfterUnsavedChangesCheck(postToEditData);
    },
    initializeTopicReplying() {
      this.currentFormUsageCase = FORM_USAGE_CASES.REPLY_TO_TOPIC;
      this.resetInitialAndCurrentPostToBeReplied();
      this.pinFormAndFocusTextEditor();
    },
    clearPostEditingAndInitializeTopicReplying() {
      this.finishPostEditing(this.editPostId);
      this.clearForm();
      this.initializeTopicReplying();
    },
    startTopicReplyingEventHandler() {
      switch (this.currentFormUsageCase) {
        case FORM_USAGE_CASES.REPLY_TO_TOPIC:
        case FORM_USAGE_CASES.REPLY_TO_POST:
          this.initializeTopicReplying();

          break;
        case FORM_USAGE_CASES.EDIT_POST:
          if (this.isHaveUnsavedData) {
            this.openConfirmDataLoseModal(() => this.clearPostEditingAndInitializeTopicReplying());
          } else {
            this.clearPostEditingAndInitializeTopicReplying();
          }
          break;
      }
    },
    replyToSummaryClickHandler() {
      switch (this.currentFormUsageCase) {
        case FORM_USAGE_CASES.REPLY_TO_POST:
          this.$emit("transit-to-post-to-be-replied", {
            replyToPostId: this.currentPostToBeReplied.replyPostId,
            answerPostId: null,
          });
          break;
        case FORM_USAGE_CASES.EDIT_POST:
          this.$emit("transit-to-post-to-be-replied", {
            replyToPostId: this.currentPostToBeReplied.replyPostId,
            answerPostId: this.editPostId, //TODO:
          });
          break;
      }
    },
  },
};
</script>

<style scoped>
.post-reply {
  padding: 1.875rem 0;
  display: flex;
  outline: none;
}

.left-column {
  flex-shrink: 0;
  flex-basis: 3rem;
  position: relative;
}

.center-column {
  margin: 0 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.text-editor-wrapper {
  height: 150px;
  margin-bottom: 2rem;
}
.right-column {
  flex-shrink: 0;
  flex-basis: 3rem;
}

.reply-icon-wrapper {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* border: var(--button-border-width) solid var(--color-gray-light);
  border-radius: 5px; */
  transition: var(--default-transition);
}

.reply-icon {
  display: block;
  width: 20px;
}

.reply-icon path {
  fill: var(--color-gray-light);
}
.buttons-holder {
  display: flex;
  gap: 1.5625rem;
}

.buttons-holder > * {
  max-width: 9.375rem;
}
</style>
