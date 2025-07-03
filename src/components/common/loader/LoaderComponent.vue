<template>
  <div v-show="isLoading" class="container-circle-svg">
    <LoadingCircle />
  </div>
</template>

<script>
import { mapState } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import LoadingCircle from "./LoadingCircle.vue";

export default {
  components: {
    LoadingCircle,
  },
  computed: {
    ...mapState(storeModules.APPLICATION, {
      isLoading: (state) => state.isLoading,
    }),
  },
};
</script>

<style scoped>
.container-circle-svg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--transparent-dark-70);
  backdrop-filter: blur(3px);
  z-index: 99999;
}
</style>
