<template>
  <div class="teams-list">
    <div class="preview-cards-holder">
      <PreviewCard v-for="artist in artists" :key="artist.id" :artist="artist" :is-favorites-button-to-be-shown="true" :variant="tabTypes.MEMBER_MODAL" />
    </div>
  </div>
</template>

<script>
import PreviewCard from "@/components/structure/user/artist/preview/PreviewCard.vue";
import tabTypes from "@/data/router/tabs/tabTypes.json";

export default {
  name: "TeamsList",
  components: {
    PreviewCard,
  },
  props: {
    isTeamTab: {
      type: Boolean,
      required: true,
    },
    artists: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tabTypes: tabTypes,
    };
  },
};
</script>

<style scoped>
.preview-cards-holder {
  display: grid;
  gap: var(--large-block-gap);
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.artist-modal .preview-cards-holder {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  height: 260px;
  padding: 0 3px;
}
</style>
