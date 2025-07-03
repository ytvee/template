<template>
  <div class="preview-cards-holder">
    <PreviewCard v-for="(member, index) in membersList" :id="member.user.id" :key="index" :card-image="member.user.pictureURI" :card-title="member.user.name" :is-artist-card="false" />
  </div>
</template>

<script>
import PreviewCard from "@/components/structure/artist/PreviewCard.vue";

export default {
  components: {
    PreviewCard,
  },
  props: {
    artist: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    membersList() {
      return this.artist?.members ?? [];
    },
  },
};
</script>

<style scoped>
.preview-cards-holder {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.artist-modal .preview-cards-holder {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
}

/* temp */
.category-holder {
  padding-top: 50px;
  display: flex;
  user-select: none;
  margin-bottom: 30px;
}

.category-holder span {
  margin-right: 40px;
  font-size: var(--h3-font-size);
  font-weight: var(--large-font-weight);
  color: var(--color-gray-medium);
}

.category-holder span.active {
  color: var(--color-light);
}

.category-holder span:hover {
  color: var(--color-accent-primary);
  cursor: pointer;
}
</style>
