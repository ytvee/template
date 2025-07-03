<template>
  <div class="image-in-full-size-modal">
    <!-- <div class="image-wrapper"> -->
    <img class="image" :src="modalProps.uri" />
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  name: "ImageInFullSizeModal",
  props: {
    modalProps: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.image-in-full-size-modal {
  width: 100%;
  max-width: 80vw;
  max-height: 70vh;

  overflow: hidden;
}

.image {
  width: 100%;
  max-height: 100vh;
  object-fit: contain;
}
</style>
