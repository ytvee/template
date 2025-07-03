<template>
  <div class="images-wrapper">
    <div v-for="(image, index) in images" :key="index" class="artist-image">
      <img :src="image.uri" :alt="image.alt" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ArtistModalGallery",
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.images-wrapper {
  width: 100%;
  height: 300px;
  padding: var(--large-padding);
  overflow: auto;
  gap: 10%;
  display: flex;
  flex-wrap: wrap;
}

.artist-image {
  width: 45%;
  aspect-ratio: 1/1;
}

.artist-image img {
  width: 100%;
  object-fit: contain;
  user-select: none;
  background-color: black;
  border-radius: var(--large-border-radius-2);
}
</style>
