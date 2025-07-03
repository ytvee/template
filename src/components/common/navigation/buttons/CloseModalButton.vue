<template>
  <div class="close-button" @click="closeModal()">
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.1286 15L30 26.8714V30H26.8714L15 18.1286L3.12857 30H0V26.8714L11.8714 15L0 3.12857V0H3.12857L15 11.8714L26.8714 0H30V3.12857L18.1286 15Z" fill="url(#paint0_linear_1132_4435)" />
      <defs>
        <linearGradient id="paint0_linear_1132_4435" x1="-2.78571" y1="-1" x2="33.9449" y2="5.31739" gradientUnits="userSpaceOnUse">
          <stop stop-color="#74DE6F" />
          <stop offset="0.859375" stop-color="#CDE768" />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<script>
export default {
  name: "CloseModalButton",
  methods: {
    closeModal() {
      this.$modal.close();
    },
  },
};
</script>

<style scoped>
.close-button {
  cursor: pointer;
}

.close-button svg path {
  transition: var(--default-transition);
}
.close-button:hover svg path {
  opacity: 50%;
  transition: var(--default-transition);
}

.close-button:active svg path {
  opacity: 30%;
  transition: var(--default-transition);
}
</style>
