<template>
  <div class="container-not-found-page">
    <div class="title-not-found-page">
      <h1>Oops!</h1>
    </div>
    <div class="text-not-found-page">
      <p>Page lost in space</p>
    </div>
    <div class="button-not-found-page">
      <button class="medium" @click="goBackOnePage">Refresh</button>
    </div>
  </div>
</template>

<script>
import router from "@/router";

export default {
  methods: {
    goBackOnePage() {
      router.back();
    },
  },
};
</script>

<style scoped>
.container-not-found-page {
  z-index: 500;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url("@/assets/background/back.png");
  background-size: cover;
  background-repeat: no-repeat;
  color: var(--color-light);
}

.title-not-found-page {
  font-size: 100px;
  margin-bottom: 40px;
}

.text-not-found-page {
  font-size: 60px;
  margin-bottom: 70px;
}
</style>
