<script setup lang="ts">
import NavBar from "@/components/common/navigation/navbar/NavBar.vue"
import CustomizationProvider from "@/components/theme/CustomizationProvider.vue";
import ModalWindowVue from "@/components/common/modal/ModalWindow.vue";
import NotificationList from "@/components/common/notifications/NotificationList.vue";
</script>

<template>
<!--  <CustomizationProvider />-->
  <NavBar />

  <main class="app-layout-default-main">
    <slot />
  </main>
  <ModalWindowVue />
  <NotificationList />
</template>

<style>
.app-layout-default-main {
  height: 100%;
  margin: 0px 0px 0px 100px;
}
</style>
