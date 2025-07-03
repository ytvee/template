<template>
  <div class="delete-topic-modal">
    <h2 class="title">You will delete this {{ modalProps.type }}</h2>
    <h3 class="action-info">Are you sure?</h3>
    <div class="button-group">
      <button class="large" @click="deletingFunction">Got it!</button>
      <button class="large outlined" @click="closeModal()">NO!</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";

const typeOfModal = {
  TOPIC: "topic",
  POST: "post",
};
export default {
  name: "DeleteTopicModal",
  data() {
    return {
      deletingFunction: this.deleteThread,
    };
  },
  computed: {
    ...mapState(storeModules.MODAL, {
      modalProps: (state) => state.modal.displayedComponentProps,
    }),
  },
  mounted() {
    if (this.modalProps.type === typeOfModal.POST) {
      this.deletingFunction = this.deletePost;
    } else {
      this.deletingFunction = this.deleteTopic;
    }
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY]),
    deletePost() {
      this.$load(async () => {
        const payload = {
          category_id: this.modalProps.categoryId,
          topic_id: this.modalProps.topicId,
          post_id: this.modalProps.postId,
        };
        await this.$api.forum.deleteMessage(payload);
        this.$eventBus.emit("post-deleted");
        this.closeModal();
      });
    },
    deleteTopic() {
      this.$load(async () => {
        const payload = {
          category_id: this.modalProps.categoryId,
          topic_id: this.modalProps.topicId,
        };
        await this.$api.forum.deleteTopic(payload);
        this.$eventBus.emit("topic-deleted");
        this.closeModal();
      });
    },
    closeModal() {
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
  },
};
</script>

<style scoped>
.delete-topic-modal {
  width: 500px;
  max-width: 80vw;
  border-radius: var(--medium-border-radius);
  background: var(--color-dark);
  padding: 50px 40px;
  color: var(--color-gray);
  text-align: center;
}

.title,
.action-info {
  margin-bottom: 25px;
}

.action-info {
  color: var(--color-accent-primary);
}

.button-group {
  display: flex;
  gap: 50px;
}
</style>
