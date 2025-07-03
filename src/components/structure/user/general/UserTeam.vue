<template>
  <div class="user-team">
    <ArtistsPage :is-team-page="true" />
  </div>
</template>
<script>
import ArtistsPage from "@/pages/ArtistsPage.vue";
export default {
  components: {
    ArtistsPage,
  },
};
</script>

<style scoped>
.user-team {
  width: 100%;
}
</style>
