<template>
  <AppLayout>
    <RouterView v-slot="{ Component , route }">
      <keep-alive :include="['SoundSplitterPage']">
        <component
          :is="Component"
          :key="route.fullPath"
        />
      </keep-alive>
    </RouterView>
  </AppLayout>
</template>

<script>
import AppLayout from "./layouts/AppLayout.vue";

import { mapActions, mapState } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import { DialogTemplateNames } from "./data/modal/constants";

// import FillUserNameModal from "@/components/structure/modals/user/FillUserNameModal.vue";

export default {
  components: {
    AppLayout,
  },
  computed: {
    ...mapState(storeModules.USER, {
      isLoggedIn: (state) => state.isLoggedIn,
      userState: (state) => state,
      currentUser: (state) => state.currentUser,
    }),
  },
  async created() {
    await this.initializeState();
  },

  methods: {
    ...mapActions(["initializeState"]),

    /* event handling */
    emptyUserNameHandler() {
      this.$modal.openModalWithName(DialogTemplateNames.FILL_USER_NAME_MODAL);
    },
    /* /event handling */
  },
  watch: {
    userState: {
      handler(newUserState) {
        if (newUserState.isLoggedIn && newUserState.currentUser.id && !newUserState.currentUser.name) {
          this.emptyUserNameHandler();
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap");

* {
  box-sizing: border-box;
  font-family: var(--main-font-family);
  margin: 0;
}
</style>
