<script setup lang="ts">
import NavBar from "@/components/common/navigation/navbar/NavBar.vue";
import ModalWindowVue from "@/components/common/modal/ModalWindow.vue";
</script>

<template>
  <Teleport to="#content">
    <NavBar />
  </Teleport>
  <div class="app-layout-topic">
    <slot />
  </div>
  <ModalWindowVue />
</template>

<style scoped>
* {
  --top-buttons-holder-top-shift: 53px;
}
.app-layout-topic {
  display: flex;
}
</style>
