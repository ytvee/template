<template>
  <LeftAsidePanel :artist-id="artistId" :answer-post-id="answerPostId" @transit-to-answer="transitToAnswerHandler" />
  <main class="app-layout-topic-main">
    <div class="forum-thread-page">
      <div v-if="originalPost" class="topic-op-container">
        <div class="topic-op-bordered-area">
          <div class="topic-header">
            <h2>
              {{ topicHeader }}
            </h2>
            <div v-if="canEditOrDeleteTopic" class="topic-control">
              <div class="svg-button" @click="topicEditButtonHandler">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24.5938 5.6138C25.1354 5.07221 25.1354 4.16956 24.5938 3.65574L21.3443 0.406194C20.8304 -0.135398 19.9278 -0.135398 19.3862 0.406194L16.831 2.94751L22.0386 8.15512M0 19.7924V25H5.20761L20.5666 9.62714L15.359 4.41953L0 19.7924Z" />
                </svg>
              </div>
              <div class="svg-button danger" @click="topicDeleteButtonHandler">
                <svg width="25" height="25" viewBox="0 0 21.875 25" xmlns="http://www.w3.org/2000/svg">
                  <path
                    width="100px"
                    heigth="100px"
                    d="M 7.812 19.532 C 7.812 19.97 7.422 20.312 7.032 20.312 C 6.592 20.312 6.25 19.97 6.25 19.532 L 6.25 9.375 C 6.25 8.984 6.592 8.594 7.032 8.594 C 7.422 8.594 7.812 8.984 7.812 9.375 L 7.812 19.532 Z M 11.719 19.532 C 11.719 19.97 11.328 20.312 10.937 20.312 C 10.498 20.312 10.157 19.97 10.157 19.532 L 10.157 9.375 C 10.157 8.984 10.498 8.594 10.937 8.594 C 11.328 8.594 11.719 8.984 11.719 9.375 L 11.719 19.532 Z M 15.625 19.532 C 15.625 19.97 15.234 20.312 14.844 20.312 C 14.405 20.312 14.062 19.97 14.062 19.532 L 14.062 9.375 C 14.062 8.984 14.405 8.594 14.844 8.594 C 15.234 8.594 15.625 8.984 15.625 9.375 L 15.625 19.532 Z M 15.478 1.22 L 17.285 3.907 L 20.703 3.907 C 21.337 3.907 21.875 4.443 21.875 5.078 C 21.875 5.761 21.337 6.25 20.703 6.25 L 20.312 6.25 L 20.312 21.094 C 20.312 23.291 18.555 25 16.407 25 L 5.469 25 C 3.272 25 1.562 23.291 1.562 21.094 L 1.562 6.25 L 1.172 6.25 C 0.489 6.25 0 5.761 0 5.078 C 0 4.443 0.489 3.907 1.172 3.907 L 4.541 3.907 L 6.348 1.22 C 6.836 0.489 7.715 0 8.643 0 L 13.184 0 C 14.111 0 14.991 0.489 15.478 1.22 Z M 7.373 3.907 L 14.453 3.907 L 13.525 2.539 C 13.477 2.441 13.331 2.344 13.184 2.344 L 8.643 2.344 C 8.497 2.344 8.35 2.441 8.301 2.539 L 7.373 3.907 Z M 3.907 21.094 C 3.907 21.973 4.59 22.657 5.469 22.657 L 16.407 22.657 C 17.236 22.657 17.969 21.973 17.969 21.094 L 17.969 6.25 L 3.907 6.25 L 3.907 21.094 Z"
                    transform="matrix(1, 0, 0, 1, -1.4210854715202004e-14, -7.105427357601002e-15)"
                  />
                </svg>
              </div>
            </div>
          </div>
          <PostElement v-if="originalPost" :id="originalPost.id" :category-id="categoryId" :topic-id="topicId" :post-index-from-one="originalPost.post_number" :content="originalPost.cooked" :user-discourse-id="originalPost.user_id" :display-username="originalPost.display_username" :avatar-template="originalPost.avatar_template" :creation-date="originalPost.created_at" :replies="originalPost.replies" :likes="originalPost.likes" :can-edit="originalPost.can_edit" :can-reply="canCreatePost" :content-for-like="getContentForLike(originalPost)" :yours="originalPost.yours" :discourse-host="discourseHost" is-original-post="true" :statistic-pane-data="originalPost.statisticPaneData" @transit-to-post-to-be-replied="transitToPostToBeRepliedHandler" />
        </div>
      </div>
      <div class="forum-paginator-wrapper">
        <ForumPaginator v-show="postsCount" :pages-count="pagesCount" :current-page-number="currentViewingPageNumber" @page-number-clicked="pageNumberClickedHandler" />
      </div>
      <div v-if="originalPost && allPostsExceptOriginalPost?.length" class="posts-divider"></div>
      <div class="topic-posts-section">
        <div ref="topicPosts" class="topic-posts">
          <PostElement v-for="(post, index) in allPostsExceptOriginalPost" :id="post.id" :key="index" :category-id="categoryId" :topic-id="topicId" :post-index-from-one="post.post_number" :reply-to-post-number="post.reply_to_post_number" :content="post.cooked" :user-discourse-id="post.user_id" :display-username="post.display_username" :avatar-template="post.avatar_template" :creation-date="post.created_at" :replies="post.replies" :likes="post.likes" :can-edit="post.can_edit" :can-reply="canCreatePost" :content-for-like="getContentForLike(post)" :yours="post.yours" :discourse-host="discourseHost" :reply-count="post.reply_count" @transit-to-post-to-be-replied="transitToPostToBeRepliedHandler" />
        </div>

        <div v-if="isPostsLoading" class="loading-dummy-wrapper">
          <LoadingCirlce />
        </div>
      </div>
      <div v-if="canCreatePost" class="post-replay-wrapper" :class="{ fixed: isPostReplyPositionFixed }" tabindex="-1">
        <div class="divider" />
        <PostReply v-model:is-post-reply-position-fixed="isPostReplyPositionFixed" :category-id="`${categoryId}`" :topic-id="topicId" :topic-name="topicHeader" @new-post-sent="newPostSentHandler" @post-edited="postEditedHandler" @transit-to-post-to-be-replied="transitToPostToBeRepliedHandler" />
      </div>
    </div>
  </main>
  <aside class="app-layout-topic-right-aside"></aside>
</template>

<script>
import LeftAsidePanel from "@/components/structure/forum/Topic/LeftAsidePanel.vue";
import ForumPaginator from "@/components/common/navigation/pagination/ForumPaginator.vue";
import PostElement from "@/components/structure/forum/Topic/PostElement.vue";
import PostReply from "@/components/structure/forum/Topic/PostReply.vue";
import LoadingCirlce from "@/components/common/loader/LoadingCircle.vue";

import { mapActions } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import NewTopicModal from "@/components/structure/modals/forum/NewTopicModal.vue";
import DeleteTopicModal from "@/components/structure/modals/forum/DeleteTopicModal.vue";
import modalActions from "@/data/store/modal/modalActions.json";
import { RouteNames } from "@/utils/types/router.types";

const TOPIC = "topic";
const POSTS_COUNT_PER_PAGE = 20;
const ENABLE_NEXT_PAGE_LOADING_ON_SCROLL_TO_BOTTOM = true;

export default {
  name: "ForumThreadPage",
  components: {
    LeftAsidePanel,
    ForumPaginator,
    PostElement,
    PostReply,
    LoadingCirlce,
  },
  data() {
    return {
      postsCount: null,
      currentStartPageNumber: 1, //first loaded page
      currentViewingPageNumber: 1, //page which page user see now
      currentLastLoadedPageNumber: 1, //last loaded page
      artistId: null,
      topicId: this.$route.params.id,
      slug: null,
      categoryId: null,
      topicHeader: "",
      discourseHost: null,
      allPostIdsInTopic: [],
      posts: [],
      topicTags: [],
      canEditOrDeleteTopic: null,
      canCreatePost: null,
      isPostReplyPositionFixed: false,
      answerPostId: null,
      isPostsLoading: false,
    };
  },
  computed: {
    pagesCount() {
      return Math.ceil(this.allPostIdsInTopic.length / POSTS_COUNT_PER_PAGE);
    },

    originalPost() {
      return this.currentStartPageNumber === 1 ? this.posts[0] || null : null;
    },
    allPostsExceptOriginalPost() {
      return this.currentStartPageNumber === 1 ? this.posts.filter((item, index) => index > 0) : this.posts;
    },
    newTopicModalProps() {
      return {
        displayedComponent: NewTopicModal,
        displayedComponentProps: {
          isNewTopic: false,
          categoryId: this.categoryId,
          topicId: this.topicId,
          slug: this.slug,
          topicTitle: this.topicHeader,
          topicFirstPostId: this.posts[0].id,
          topicTags: this.topicTags,
        },
      };
    },
    deleteTopicModalProps() {
      return {
        displayedComponent: DeleteTopicModal,
        displayedComponentProps: {
          categoryId: this.categoryId,
          topicId: this.topicId,
          type: TOPIC,
        },
      };
    },
  },
  mounted() {
    this.$eventBus.on("new-topic-modal-topic-edited", this.loadPosts);
    this.$eventBus.on("post-deleted", this.postDeletedHandler);
    this.$eventBus.on("topic-deleted", this.redirectRoute);
    this.addPaginatorScrollEventListener();
    this.loadPosts();
  },
  unmounted() {
    this.$eventBus.off("new-topic-modal-topic-edited", this.loadPosts);
    this.$eventBus.off("post-deleted", this.postDeletedHandler);
    this.$eventBus.off("topic-deleted", this.redirectRoute);
    this.removePaginatorScrollEventListener();
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL, modalActions.SET_MODAL_VISIBILITY]),

    /* Topic control functions */
    redirectRoute() {
      if (this.$route.name !== RouteNames.ARTIST) {
        this.$router.back();
      }
    },
    topicEditButtonHandler() {
      this[modalActions.SET_MODAL](this.newTopicModalProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    topicDeleteButtonHandler() {
      this[modalActions.SET_MODAL](this.deleteTopicModalProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },

    /* Posts control functions */
    getContentForLike(post) {
      let contentForLike = post.actions_summary?.find?.((action) => action.id === 2);
      if (contentForLike) {
        contentForLike = JSON.parse(JSON.stringify(contentForLike));
        contentForLike.id = post.id;
        return contentForLike;
      }
    },
    removeChangedStatusPosts(posts) {
      //only events has field action_code
      return posts.filter((post) => !Object.hasOwn(post, "action_code"));
    },
    setStatisticPaneDataToFirstPost(resdata) {
      //TODO: remove statisticPaneData
      if (this.posts[0]) {
        this.posts[0].statisticPaneData = {
          discourseHost: this.discourseHost,
          creation: {
            createdBy: resdata.details.created_by,
            createdAt: resdata.created_at,
          },
          lastReply: {
            lastPoster: resdata.details.last_poster,
            lastPostedAt: resdata.last_posted_at,
          },
          posts: resdata.posts_count,
          views: resdata.views,
          users: resdata.participant_count,
          likes: resdata.like_count,
        };
      }
    },
    async getPostsFromBackend(pageNumber, isPushToViewedPages) {
      if (!isPushToViewedPages) {
        this.posts = [];
      }
      const payload = {
        id: this.topicId,
        count: POSTS_COUNT_PER_PAGE,
        page: pageNumber || 1,
      };
      const {
        data: { data: resdata },
      } = await this.$api.forum.getTopic(payload);
      this.artistId = resdata.artist_id;
      this.topicHeader = resdata.title;
      this.discourseHost = resdata.discourse_host;

      this.postsCount = resdata.posts_count;
      this.posts = isPushToViewedPages ? [...this.posts, ...this.removeChangedStatusPosts(resdata.post_stream?.posts)] : this.removeChangedStatusPosts(resdata.post_stream?.posts);

      this.setStatisticPaneDataToFirstPost(resdata);
      this.slug = resdata.slug;
      this.categoryId = resdata.category_id;
      this.topicTags = [...resdata.tags];
      this.canEditOrDeleteTopic = resdata.details?.can_edit;
      this.canCreatePost = resdata.can_create_post;
      this.allPostIdsInTopic = resdata.stream;
    },
    async loadPosts(pageNumber, isPushToViewedPages) {
      await this.$load(
        async () => {
          this.isPostsLoading = true;
          await this.getPostsFromBackend(pageNumber, isPushToViewedPages);
          this.setCurrentViewingPageNumberByScroll();
          this.isPostsLoading = false;
        },
        null,
        false
      );
    },
    isNewPostPageNextToCurrentLastLoadedPage(pageNumber) {
      return pageNumber === this.currentLastLoadedPageNumber + 1;
    },
    async newPostSentHandler({ post_id, stream }) {
      await this.$load(async () => {
        this.allPostIdsInTopic = stream;
        const pageNumber = this.getPageNumberByPostId(post_id); //TODO: getPageNumberByPostId to getPageNumberByPostId

        if (this.isNewPostPageNextToCurrentLastLoadedPage(pageNumber)) {
          await this.loadNextPageIfExist();
        } else {
          await this.pageNumberClickedHandler(pageNumber);
        }
        await this.transitToPost(post_id);
      });
    },
    postEditedHandler(postId) {
      this.newPostSentHandler({
        post_id: postId,
        stream: this.allPostIdsInTopic,
      }); //Replace with some logic if nessesary
    },
    postDeletedHandler() {
      this.pageNumberClickedHandler(this.currentViewingPageNumber);
    },

    /* Pagination functions */
    getPageNumberByPostId(postId) {
      const postIndexInStream = this.allPostIdsInTopic.indexOf(postId);
      if (postIndexInStream === -1) {
        const error = new Error("Something went wrong... Post you were trying to see does not exist in topic!");
        error.metadata = "post_id is not contained in stream of postIds from discourse! Check discourse settings!";
        throw error;
      }
      const postIndexInStreamByOne = postIndexInStream + 1;
      return Math.ceil(postIndexInStreamByOne / POSTS_COUNT_PER_PAGE);
    },
    async pageNumberClickedHandler(pageNumber) {
      this.currentStartPageNumber = pageNumber;
      this.currentViewingPageNumber = pageNumber;
      this.currentLastLoadedPageNumber = pageNumber;
      await this.loadPosts(pageNumber, false);
    },
    async loadNextPageIfExist(pagesCount = this.pagesCount) {
      if (this.currentLastLoadedPageNumber < pagesCount && !this.isPostsLoading) {
        await this.loadPosts(this.currentLastLoadedPageNumber + 1, true);
        this.currentLastLoadedPageNumber++;
      }
    },
    isElementScrolledToBottom(element) {
      return this.isNearlyEqual(element.scrollTop, element.scrollHeight - element.offsetHeight, 5);
    },
    loadNextPageIfContentIsScrolledToBottom(contentElement) {
      if (ENABLE_NEXT_PAGE_LOADING_ON_SCROLL_TO_BOTTOM && this.isElementScrolledToBottom(contentElement)) {
        this.loadNextPageIfExist();
      }
    },
    htmlCollectionToArray(htmlCollection) {
      return Array.prototype.slice.call(htmlCollection);
    },
    getIndexOfLastVisiblePostElement(arrayOfTopicPostsChildren, contentElement) {
      const indexOfLastVisiblePostElement = arrayOfTopicPostsChildren.findIndex((item) => {
        return item.offsetTop + item.clientHeight >= contentElement.scrollTop + contentElement.clientHeight;
      });
      if (indexOfLastVisiblePostElement === -1) {
        return arrayOfTopicPostsChildren.length - 1; //all post elements are higher than contentElement bottom border
      } else {
        return indexOfLastVisiblePostElement;
      }
    },
    setCurrentViewingPageNumberByScroll(contentElement = document.querySelector("#content")) {
      const arrayOfTopicPostsChildren = this.htmlCollectionToArray(this.$refs.topicPosts.children);
      if (!arrayOfTopicPostsChildren.length) {
        this.currentViewingPageNumber = this.currentStartPageNumber;
        return;
      }
      const indexOfLastVisiblePost = this.getIndexOfLastVisiblePostElement(arrayOfTopicPostsChildren, contentElement);
      const postId = this.allPostsExceptOriginalPost[indexOfLastVisiblePost].id; //TODO: remake this. It case bug when post is created after post is deleted
      this.currentViewingPageNumber = this.getPageNumberByPostId(postId);
    },
    handlePageScrollend(event) {
      const contentElement = event.target;
      this.loadNextPageIfContentIsScrolledToBottom(contentElement);
      this.setCurrentViewingPageNumberByScroll(contentElement);
    },
    imitateScrollendEvent(event, handlePageScrollend) {
      clearTimeout(window.scrollEndForumTimer);
      window.scrollEndForumTimer = setTimeout(handlePageScrollend, 100, event);
    },
    pageScrollHandler(event) {
      this.imitateScrollendEvent(event, this.handlePageScrollend);
    },
    addPaginatorScrollEventListener() {
      const contentElement = document.querySelector("#content");
      contentElement.addEventListener("scroll", this.pageScrollHandler);
    },
    removePaginatorScrollEventListener() {
      const contentElement = document.querySelector("#content");
      contentElement.removeEventListener("scroll", this.pageScrollHandler);
    },

    /* Transit to post functions */
    isNearlyEqual(val1, val2, epsilon) {
      return val1 >= val2 - epsilon && val1 <= val2 + epsilon;
    },
    async transitToPost(postId) {
      const postPageNumber = this.getPageNumberByPostId(postId);
      if (!(postPageNumber >= this.currentStartPageNumber && postPageNumber <= this.currentLastLoadedPageNumber)) {
        await this.pageNumberClickedHandler(postPageNumber);
      }
      const indexInArrayOfPostToBeReplied = this.allPostsExceptOriginalPost.findIndex((item) => item.id === postId);
      const postToBeRepliedElement = this.$refs.topicPosts.children[indexInArrayOfPostToBeReplied];
      if (!postToBeRepliedElement) {
        console.error("postToBeRepliedElement is undefined!");
        return;
      }
      const contentElement = document.querySelector("#content"); //TODO: move to mounted
      const navBarElement = contentElement.querySelector("nav");
      const navBarElementHeight = navBarElement.offsetHeight;
      const scrollToTopValue = postToBeRepliedElement.offsetTop - navBarElementHeight;

      if (!this.isNearlyEqual(contentElement.scrollTop, scrollToTopValue, 2) && contentElement.scrollHeight - contentElement.clientHeight > scrollToTopValue) {
        contentElement.onscrollend = () => {
          this.$eventBus.emit("transit-to-post-completed", postId);
          contentElement.onscrollend = null;
        };
        contentElement.scrollTo({
          top: scrollToTopValue,
          behavior: "smooth",
        });
      } else if (!this.isNearlyEqual(contentElement.scrollTop, scrollToTopValue, 2) && contentElement.scrollHeight - (contentElement.scrollTop + contentElement.clientHeight) > 2) {
        contentElement.onscrollend = () => {
          this.$eventBus.emit("transit-to-post-completed", postId);
          contentElement.onscrollend = null;
        };
        contentElement.scrollTo({
          top: contentElement.scrollHeight,
          behavior: "smooth",
        });
      } else {
        this.$eventBus.emit("transit-to-post-completed", postId);
      }
    },
    transitToPostToBeRepliedHandler({ replyToPostId, answerPostId }) {
      this.transitToPost(replyToPostId);
      this.answerPostId = answerPostId;
    },
    transitToAnswerHandler() {
      this.transitToPost(this.answerPostId);
      this.answerPostId = null;
    },
  },
};
</script>

<style scoped>
.app-layout-topic-right-aside {
  /* flex-grow: 1; */
  width: calc((100vw - var(--content-width)) / 2);
}

/* main page section styles */
.app-layout-topic-main {
  flex-shrink: 0;
  max-width: var(--content-width);
  margin: 0;
}

.forum-thread-page {
  display: flex;
  flex-direction: column;
}

.topic-op-container {
  position: relative;
}

.forum-paginator-wrapper {
  margin-left: auto;
  display: flex;
  justify-content: end;
  margin-bottom: 1.5625rem;
  position: sticky;
  top: calc(var(--navbar-height) + 3.3125rem);
  bottom: 3.3125rem;
  z-index: 50;
}

.posts-divider {
  background: var(--gradient-card-dark);
  height: 1px;
  border-radius: 100px;
}

.topic-op-bordered-area {
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
  border-radius: var(--forum-op-post-bordered-area-border-radius);
  border: 1px solid rgba(194, 229, 104, 0.5);
  padding: 0.625rem;
}

.topic-header {
  display: flex;
  align-items: baseline;
  /* gap: 1.5625rem; */
}

.topic-header h2 {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.topic-control {
  margin-left: 1.5625rem;
  display: flex;
  gap: 0.75rem;
}

.divider {
  height: 5px;
  background: var(--gradient-primary);
  border-radius: 100px;
}
.loading-dummy-wrapper {
  height: 50px;
  margin: 25px auto;
}
.post-replay-wrapper {
  z-index: 60;
  bottom: 0px;
  background: transparent;
  transition: var(--default-transition);
}

.post-replay-wrapper.fixed {
  position: sticky;
  background: rgba(29, 34, 39, 1);
}
</style>
