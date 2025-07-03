<script setup lang="ts">
import CustomizationProvider from "@/components/theme/CustomizationProvider.vue";
</script>

<template>
  <div>
<!--    <CustomizationProvider />-->
    <main class="app-layout-error-main main-no-navbar">
      <slot />
    </main>
  </div>
</template>
