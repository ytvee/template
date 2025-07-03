<script setup lang="ts">
import CustomizationProvider from "@/components/theme/CustomizationProvider.vue";
import ModalWindowVue from "@/components/common/modal/ModalWindow.vue";
</script>

<template>
<!--  <CustomizationProvider />-->
  <main class="app-layout-auth-main main-no-navbar">
    <slot />
  </main>
  <ModalWindowVue />
</template>

<style lang="scss"></style>
