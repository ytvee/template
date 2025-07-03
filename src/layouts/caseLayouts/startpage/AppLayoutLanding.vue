<script setup lang="ts">
import CustomizationProvider from "@/components/theme/CustomizationProvider.vue";
</script>

<template>
<!--  <CustomizationProvider />-->
  <main id="app-landing-page" class="app-layout-landing-main">
    <slot />
  </main>
</template>

<style scoped>
body {
  padding-top: 0 !important;
}
main {
  padding: 0;
}
</style>
