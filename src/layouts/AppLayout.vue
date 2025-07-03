<template>
  <CustomizationProvider />
  <component :is="$route.meta.layoutComponent">
    <slot />
  </component>
  <LoaderComponent />
</template>

<script>
import { useRoute } from "vue-router";
import LoaderComponent from "@/components/common/loader/LoaderComponent.vue";
import CustomizationProvider from "@/components/theme/CustomizationProvider.vue";

export default {
  components: {
    CustomizationProvider,
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
