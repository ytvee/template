<template>
  <component :is="$route.meta.layoutComponent">
    <slot />
  </component>
  <LoaderComponent />
</template>

<script>
import { useRoute } from "vue-router";
import LoaderComponent from "@/components/common/loader/LoaderComponent.vue";

export default {
  components: {
    LoaderComponent,
  },
  computed: {
    route() {
      return useRoute().meta.layoutComponent;
    },
  },
};
</script>

<style></style>
