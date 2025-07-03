<template>
  <div v-show="isVisible" id="modal-window" class="modal-window">
    <div class="modal-content-holder">
      <div id="modal-content">
        <!-- TODO teleport component -->
        <component :is="modal.displayedComponent" v-show="isVisible" ref="component" :modal-props="modal.displayedComponentProps" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, markRaw } from "vue";
import { mapState, mapActions } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import modalActions from "@/data/store/modal/modalActions.json";

export const IS_MODAL_VISIBLE = "isModalVisible";

const ESCAPE_KEY_CODE = 27;

export default {
  provide() {
    return {
      [IS_MODAL_VISIBLE]: computed(() => this.isVisible), //In purpose of ExtendableContainer correct work
    };
  },
  data() {
    return {
      // modalComponent: markRaw({}),
    };
  },
  computed: {
    ...mapState(storeModules.MODAL, {
      modal: (state) => state.modal,
      isVisible: (state) => state.isVisible,
      isNonClosableByClickOnPeriphery: (state) => state.isNonClosableByClickOnPeriphery,
    }),
  },
  mounted() {
    this.addHandleModalClicksListeners();
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY]),
    closeModal() {
      if (!this.isVisible) {
        return;
      }
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
    addHandleModalClicksListeners() {
      const modalContent = document.querySelector("#modal-content");
      const modalWindow = document.querySelector("#modal-window");
      modalWindow.addEventListener("click", () => {
        if (!this.isNonClosableByClickOnPeriphery) {
          this.closeModal();
        }
      });
      // modalContent.addEventListener("click", (e) => {
        // e.stopPropagation();
      // });
      document.addEventListener("keydown", (e) => {
        if (e.keyCode === ESCAPE_KEY_CODE) {
          this.closeModal();
        }
      });
    },
  },
};
</script>

<style scoped>
.modal-window {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 101;
  top: 0;
  left: 0;
  background: rgba(29, 34, 39, 0.6);
  transition: var(--default-transition);
  overflow: hidden;
}

.modal-content-holder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
