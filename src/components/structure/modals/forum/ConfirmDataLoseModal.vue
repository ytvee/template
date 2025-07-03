<template>
  <div class="cancel-post-editing-modal">
    <h2 class="title">Changes made to your post will be lost!</h2>
    <h3 class="action-info">Are you sure?</h3>
    <div class="button-group">
      <button class="large" @click="postActionConfirmHandler">Got it!</button>
      <button class="large outlined" @click="closeModal()">NO!</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";

export default {
  name: "ConfirmDataLoseModal",
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
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY]),
    postActionConfirmHandler() {
      this.modalProps.callBackToRunOnConfirm();
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
    closeModal() {
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
  },
};
</script>

<style scoped>
.cancel-post-editing-modal {
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
