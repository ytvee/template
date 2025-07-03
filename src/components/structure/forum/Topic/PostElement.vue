<template>
  <div class="post-element" :class="{ 'with-quote': isWithQuote }">
    <div class="post-element-inner">
      <div ref="animatedColorCover" class="animated-color-cover"></div>
      <div v-if="isWithQuote" class="reply-to-post-element-holder">
        <QuoteBlock :quote-content="quoteContent" :sender="quoteUsername" @click="quoteBlockClickHandler" />
      </div>
      <div class="post-element-inner-content">
        <div class="left-column">
          <div class="round-avatar-holder">
            <RoundAvatar :avatar-src="avatarSrc" />
          </div>
        </div>
        <div class="center-column">
          <div class="author-name-holder">
            <h3>
              {{ displayUsername }}
            </h3>
            <div v-if="!isStartTopicPost && canEdit" class="post-controls">
              <div class="post-control-button" :class="{ disabled: isPostBeingEdited }" @click="editPostHandler()">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.675 4.49104C20.1083 4.05777 20.1083 3.33565 19.675 2.92459L17.0754 0.324955C16.6644 -0.108318 15.9422 -0.108318 15.509 0.324955L13.4648 2.35801L17.6309 6.52409M0 15.8339V20H4.16609L16.4533 7.70171L12.2872 3.53562L0 15.8339Z" />
                </svg>
              </div>
              <div class="post-control-button danger" @click="deletePostHandler">
                <svg width="21" height="23" viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.75 17.9375C7.75 18.3242 7.40625 18.625 7.0625 18.625C6.67578 18.625 6.375 18.3242 6.375 17.9375V9C6.375 8.65625 6.67578 8.3125 7.0625 8.3125C7.40625 8.3125 7.75 8.65625 7.75 9V17.9375ZM11.1875 17.9375C11.1875 18.3242 10.8438 18.625 10.5 18.625C10.1133 18.625 9.8125 18.3242 9.8125 17.9375V9C9.8125 8.65625 10.1133 8.3125 10.5 8.3125C10.8438 8.3125 11.1875 8.65625 11.1875 9V17.9375ZM14.625 17.9375C14.625 18.3242 14.2812 18.625 13.9375 18.625C13.5508 18.625 13.25 18.3242 13.25 17.9375V9C13.25 8.65625 13.5508 8.3125 13.9375 8.3125C14.2812 8.3125 14.625 8.65625 14.625 9V17.9375ZM14.4961 1.82422L16.0859 4.1875H19.0938C19.6523 4.1875 20.125 4.66016 20.125 5.21875C20.125 5.82031 19.6523 6.25 19.0938 6.25H18.75V19.3125C18.75 21.2461 17.2031 22.75 15.3125 22.75H5.6875C3.75391 22.75 2.25 21.2461 2.25 19.3125V6.25H1.90625C1.30469 6.25 0.875 5.82031 0.875 5.21875C0.875 4.66016 1.30469 4.1875 1.90625 4.1875H4.87109L6.46094 1.82422C6.89062 1.17969 7.66406 0.75 8.48047 0.75H12.4766C13.293 0.75 14.0664 1.17969 14.4961 1.82422ZM7.36328 4.1875H13.5938L12.7773 2.98438C12.7344 2.89844 12.6055 2.8125 12.4766 2.8125H8.48047C8.35156 2.8125 8.22266 2.89844 8.17969 2.98438L7.36328 4.1875ZM4.3125 19.3125C4.3125 20.0859 4.91406 20.6875 5.6875 20.6875H15.3125C16.043 20.6875 16.6875 20.0859 16.6875 19.3125V6.25H4.3125V19.3125Z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <!-- eslint-disable vue/no-v-html -->
          <div class="post-content" v-html="contentWithoutQuote" />
          <!-- eslint-enable vue/no-v-html -->
        </div>
        <div class="right-column">
          {{ creationDateRounded }}
        </div>
      </div>

      <div class="buttons-holder">
        <ReplyButton v-if="canReply" theme-type="dark-with-accent-background" @click="replyToPostButtonInPostElementHandler()" />
        <FavoritesButton :disabled="yours" :theme-type="favoritesButtonThemes.DARK" :button-selection="buttonsProfile.POST_LIKE" :like-content="contentForLike" />
      </div>
    </div>
  </div>
</template>

<script>
import RoundAvatar from "@/components/common/user/RoundAvatar.vue";
import ReplyButton from "@/components/common/navigation/buttons/ReplyButton.vue";
import DeleteTopicModal from "@/components/structure/modals/forum/DeleteTopicModal.vue";
import QuoteBlock from "./QuoteBlock.vue";
import FavoritesButton from "@/components/common/navigation/buttons/FavoritesButton.vue";

import { mapActions } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import modalActions from "@/data/store/modal/modalActions.json";

import modules from "@/data/injectableModules/modules.json";
import buttonsProfile from "@/data/navbar/buttons/buttonsProfile.json";
import favoritesButtonThemes from "@/data/theme/favoritesButtonThemes.json";

const POST = "post";
export function getDiscourseAvatarSrc(avatarTemplate, discourseHost) {
  const stringSignOfDefaultAvatar = "/letter_avatar_proxy/";
  const avatarSize = "90";
  return avatarTemplate.includes(stringSignOfDefaultAvatar) ? null : discourseHost + avatarTemplate.replace("{size}", avatarSize);
}
export default {
  name: "PostElement",
  components: {
    RoundAvatar,
    ReplyButton,
    FavoritesButton,
    QuoteBlock,
  },
  inject: [modules.ROUND_NUMBER, modules.ROUND_DATE],
  props: {
    id: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: Number,
      required: true,
    },
    topicId: {
      type: Number,
      required: true,
    },
    discourseHost: {
      type: String,
      required: true,
    },
    postIndexFromOne: {
      type: Number,
      required: true,
    },
    replyToPostNumber: {
      type: Number,
      required: false,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    userDiscourseId: {
      type: Number,
      required: true,
    },
    displayUsername: {
      type: String,
      required: true,
    },
    avatarTemplate: {
      type: String,
      required: true,
    },
    creationDate: {
      type: String,
      required: true,
    },
    // replies: {
    //   type: Number,
    //   required: true,
    // },
    likes: {
      type: Number,
      default: 0,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
    canReply: {
      type: Boolean,
      required: true,
    },
    contentForLike: {
      type: Object,
      default: () => ({}),
    },
    yours: {
      type: Boolean,
      required: true,
    },
    isOriginalPost: {
      type: Boolean,
      required: false,
      default: false,
    },
    statisticPaneData: {
      type: Object,
      default: undefined,
    },
    replyCount: {
      type: Number,
      required: false,
      default: null,
    },
  },
  emits: ["transit-to-post-to-be-replied"],
  data() {
    return {
      isPostBeingEdited: false,
      quoteUsername: null,
      quoteContent: null,
      contentWithoutQuote: null,
      favoritesButtonThemes,
      buttonsProfile,

      quotePostId: null,
    };
  },
  computed: {
    isWithQuote() {
      const cookedQuoteTag = "</aside>";
      return this.$props.content.includes(cookedQuoteTag);
    },
    isStartTopicPost() {
      return !!this.statisticPaneData;
    },
    avatarSrc() {
      return getDiscourseAvatarSrc(this.$props.avatarTemplate, this.$props.discourseHost);
    },
    creationDateRounded() {
      return this[modules.ROUND_DATE](new Date(this.creationDate));
    },
    deleteTopicModalProps() {
      return {
        displayedComponent: DeleteTopicModal,
        displayedComponentProps: {
          categoryId: this.categoryId,
          topicId: this.topicId,
          postId: this.id,
          type: POST,
        },
      };
    },
  },
  watch: {
    content() {
      this.parseCookedPostContent();
    },
  },
  mounted() {
    this.parseCookedPostContent();
    this.$eventBus.on("post-editing-started", this.postEditingStartedHandler);
    this.$eventBus.on("post-editing-finished", this.postEditingFinishedEventHandler);
    this.$eventBus.on("transit-to-post-completed", this.transitToPostCompleted);
  },
  unmounted() {
    this.$eventBus.off("post-editing-started", this.postEditingStartedHandler);
    this.$eventBus.off("post-editing-finished", this.postEditingFinishedEventHandler);
    this.$eventBus.off("transit-to-post-completed", this.transitToPostCompleted);
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL, modalActions.SET_MODAL_VISIBILITY]),
    parseCookedPostContent() {
      const parser = new DOMParser();
      const contentHtmlDoc = parser.parseFromString(this.$props.content, "text/html");
      const bodyElement = contentHtmlDoc.querySelector("body");
      if (this.isWithQuote) {
        const asideElement = bodyElement.querySelector("aside");
        this.quoteUsername = asideElement.dataset.username;

        this.quotePostId = asideElement.dataset.post; //TODO: need separate field for qoutePostId in discourse. this is temporary solution. this cause some mess.

        const blockquoteElement = asideElement.querySelector("blockquote");
        this.quoteContent = blockquoteElement.innerHTML;
        asideElement.remove();
      }
      this.contentWithoutQuote = bodyElement.innerHTML;
    },
    postEditingStartedHandler(postId) {
      if (this.$props.id === postId) {
        this.isPostBeingEdited = true;
      }
    },
    postEditingFinishedEventHandler(postId) {
      if (this.id === postId) {
        this.isPostBeingEdited = false;
      }
    },
    deletePostHandler() {
      this[modalActions.SET_MODAL](this.deleteTopicModalProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    editPostHandler() {
      const postToEditData = {
        editPostId: this.$props.id,
        editPostNumber: this.$props.postIndexFromOne,
      };
      this.$eventBus.emit("start-post-editing", postToEditData);
    },
    replyToPostButtonInPostElementHandler() {
      if (!this.$props.isOriginalPost) {
        const postToReplyData = {
          replyPostId: this.$props.id,
          content: this.content,
          postIndexFromOne: this.postIndexFromOne,
          user: this.displayUsername,
        };
        this.$eventBus.emit("start-post-replying", postToReplyData);
      } else {
        this.$eventBus.emit("start-topic-replying");
      }
    },
    quoteBlockClickHandler() {
      this.$emit("transit-to-post-to-be-replied", {
        replyToPostId: Number(this.quotePostId),
        answerPostId: this.$props.id,
      });
    },
    animateColorBlock() {
      this.$refs.animatedColorCover.animate(
        {
          display: "block",
          opacity: [0, 0.5, 0],
        },
        {
          duration: 500,
          iterations: 1,
        }
      );
    },
    transitToPostCompleted(postId) {
      if (postId === this.id) {
        this.animateColorBlock();
      }
    },
  },
};
</script>

<style scoped>
.post-element {
  position: relative;
}
.post-element:not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  background: var(--gradient-card-dark);
  height: 1px;
  border-radius: 100px;
}
.post-element-inner {
  padding: 1.25rem 0 1.875rem 0;
}
.post-element.with-quote .post-element-inner {
  margin-left: 2rem;
}

.post-element-inner-content {
  display: flex;
}

.reply-to-post-element-holder {
  margin-bottom: 1.8rem;
  cursor: pointer;
}

.left-column {
  flex-shrink: 0;
  margin-right: 1.25rem;
  position: relative;
}

.center-column {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.right-column {
  flex-shrink: 0;
  flex-basis: 60px;
  font-size: var(--medium-font-size-2);
  font-weight: var(--small-font-weight);
  color: var(--color-light);
  text-align: right;
}

.round-avatar-holder {
  position: sticky;
  top: calc(var(--navbar-height) + 10px);
  width: 3rem;
}

.author-name-holder {
  margin-bottom: 0.625rem;
  display: flex;
}

.author-name-holder > h3 {
  color: var(--color-gray);
}

.post-controls {
  margin-left: 1.25rem;
  display: flex;
  gap: var(--regular-block-gap);
}

.post-control-button {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.post-control-button.disabled {
  pointer-events: none;
}

.post-control-button svg {
  fill: var(--color-gray);
  transition: var(--default-transition);
}

.post-control-button:hover svg {
  fill: var(--color-accent-primary);
  transition: var(--default-transition);
}

.post-control-button:active svg {
  fill: var(--color-gray-light);
  transition: var(--default-transition);
  opacity: 50%;
}

.post-control-button.danger:hover svg {
  fill: var(--color-error);
  transition: var(--default-transition);
}

.post-control-button.danger:active svg {
  fill: var(--color-error);
  transition: var(--default-transition);
  opacity: 50%;
}

.post-content {
  margin-bottom: 1.25rem;

  font-size: var(--forum-post-content-font-size);
  font-weight: var(--regular-font-weight);
  color: var(--color-gray);
}

.buttons-holder {
  display: flex;
  justify-content: flex-end;
  gap: 1.5625rem;
}

.buttons-holder > * {
  min-width: 4rem;
}

.animated-color-cover {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  z-index: 2;
  background: var(--gradient-primary);
  pointer-events: none;
}
</style>
