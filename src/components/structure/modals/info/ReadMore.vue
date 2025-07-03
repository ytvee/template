<template>
  <div class="read-more-modal">
    <div class="read-more-header">
      <h2>Artist Bio</h2>
      <CloseModalButton />
    </div>
    <div class="read-more-content">
      {{ modal.displayedComponentProps }}
    </div>
  </div>
</template>

<script>
import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";
import { mapState } from "vuex";
import storeModules from "@/data/store/storeModules.json";

export default {
  name: "ReadMore",
  components: {
    CloseModalButton,
  },
  computed: {
    ...mapState(storeModules.MODAL, {
      modal: (state) => state.modal,
    }),
  },
};
</script>

<style scoped>
.read-more-modal {
  background: var(--color-dark);
  padding: 50px 30px;
  max-width: 800px;
  border-radius: var(--medium-border-radius);
}

.read-more-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.read-more-content {
  color: var(--color-light);
  font-size: var(--medium-font-size-2);
  line-height: 150%;
  max-height: 60vh;
  overflow: auto;
}
</style>
