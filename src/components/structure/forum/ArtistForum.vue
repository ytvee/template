<template>
  <div class="artist-forum">
    <div class="buttons-holder">
      <div class="search-holder">
        <input type="text" class="search" />
      </div>
      <button v-if="canCreateTopic" class="large" @click="showNewTopicModal()">New topic</button>
    </div>
    <ForumHeader />
    <div class="forum-table">
      <div class="column-filters">
        <FilterElement />
      </div>
      <div class="column-primary">
        <div v-if="isForumUpdating" class="loading-circle-wrapper">
          <LoadingCirlce />
        </div>
        <TopicElement v-for="topic in topics" v-else :id="topic.id" :key="topic.id" :category-id="categoryId" :title="topic.title" :excerpt="topic.excerpt" :replies="topic.posts_count" :views="topic.views" :activity="topic.bumped_at" :pinned="topic.pinned" :tags="topic.tags" :can-pin-topic="canCreateTopic" @updated-pinned-state-topic="updatedPinnedStateTopicHandler" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import modalActions from "@/data/store/modal/modalActions.json";

import NewTopicModal from "@/components/structure/modals/forum/NewTopicModal.vue";
import LoadingCirlce from "@/components/common/loader/LoadingCircle.vue";

import TopicElement from "@/components/structure/forum/TopicElement.vue";
import ForumHeader from "@/components/structure/forum/ForumHeader.vue";
import FilterElement from "@/components/structure/forum/FilterElement.vue";

export default {
  name: "ArtistForum",
  components: {
    ForumHeader,
    TopicElement,
    FilterElement,
    LoadingCirlce,
  },
  props: {
    currentArtist: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isForumUpdating: false,
      topics: [],
      canCreateTopic: null,
    };
  },
  computed: {
    categoryId() {
      return this.currentArtist?.forum;
    },
    modalNewTopicProps() {
      return {
        displayedComponent: NewTopicModal,
        displayedComponentProps: {
          isNewTopic: true,
          categoryId: this.categoryId,
        },
      };
    },
  },
  watch: {
    currentArtist: {
      handler(newCurrentArtist) {
        this.getTopicsListFromBackend(newCurrentArtist);
      },
      deep: true,
    },
  },
  mounted() {
    this.$eventBus.on("topic-deleted", () => {
      this.topicDeletedHandler();
    });
    this.$eventBus.on("new-topic-modal-topic-created", this.newTopicCreatedHandler);
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL, modalActions.SET_MODAL_VISIBILITY]),
    async getTopicsListFromBackend(newCurrentArtist = this.currentArtist) {
      if (newCurrentArtist?.forum) {
        this.isForumUpdating = true;
        this.$load(
          async () => {
            const {
              data: { data: resdata },
            } = await this.$api.forum.getListOfCategoryTopics(newCurrentArtist?.forum);
            this.topics = resdata.topics;
            this.canCreateTopic = resdata.can_create_topic;
            this.isForumUpdating = false;
          },
          null,
          false
        );
      }
    },
    showNewTopicModal() {
      this.setModal(this.modalNewTopicProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    async newTopicCreatedHandler() {
      await this.getTopicsListFromBackend();
    },
    async topicDeletedHandler() {
      await this.getTopicsListFromBackend();
    },
    async updatedPinnedStateTopicHandler() {
      await this.getTopicsListFromBackend();
    },
  },
};
</script>

<style scoped>
.forum-page-wrapper {
  color: var(--color-light);
  padding-bottom: 30px;
}

.buttons-holder {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buttons-holder > button.large {
  width: auto;
  white-space: nowrap;
}

.search-holder {
  flex-basis: 403px;
}

.forum-table {
  display: flex;
  gap: var(--regular-block-gap);
}

.column-filters {
  padding-left: 1rem;
}

:deep(.column-filters) {
  flex: none;
  width: 220px;
}

:deep(.column-primary) {
  flex: auto;
  overflow-wrap: break-word;
  min-width: 0;
}

:deep(.column-secondary) {
  flex: none;
  width: 70px;
  text-align: center;
}

.loading-circle-wrapper {
  height: 100%;
}
</style>
