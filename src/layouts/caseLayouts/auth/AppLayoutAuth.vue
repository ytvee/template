<script setup lang="ts">
import ModalWindowVue from "@/components/common/modal/ModalWindow.vue";
</script>

<template>
  <main class="app-layout-auth-main main-no-navbar">
    <slot />
  </main>
  <ModalWindowVue />
</template>

<style lang="scss"></style>
