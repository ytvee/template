<template>
  <div class="preview-card-for-creator" :class="{ 'un-confirmed': isUnConfirmed }" @click="goToEditArtistPage">
    <div class="image-holder">
      <img :src="artist.logoURI" alt="image not available" />
    </div>
    <div class="card-preview-information-holder">
      <div class="card-title" :title="artist.name">
        {{ artist.name }}
      </div>
      <div class="card-description hide">songs</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import MemberModal from "@/components/structure/modals/artist/MemberModal.vue";

export default {
  name: "PreviewCardForCreator",
  props: {
    artist: {
      type: Object,
      required: true,
    },
    isUnConfirmed: {
      type: Boolean,
      required: false,
      default: false,
    },
    isMemberModal: Boolean,
  },
  computed: {
    modalMemberProps() {
      return {
        displayedComponent: MemberModal,
        displayedComponentProps: this.artist,
      };
    },
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    goToEditArtistPage() {
      if (!this.isUnConfirmed) {
        this.$router.push({ path: `/artist/${this.artist.id}` });
      }
    },
  },
};
</script>

<style scoped>
.un-confirmed {
  opacity: 0.6;
}
.un-confirmed .image-holder img {
  filter: grayscale(1);
}
.preview-card-for-creator {
  width: 310px;
  height: 280px;
  border-radius: var(--preview-card-for-creater-border-radius);
  background: var(--gradient-card-dark);
  padding: 5px;
  cursor: pointer;
}
.preview-card-for-creator:hover {
  box-shadow: 0 0 7px var(--color-accent-primary);
  transition: var(--default-transition);
}
.preview-card-for-creator:hover * {
  color: var(--color-gray-light);
  transition: var(--default-transition);
}

.image-holder {
  position: relative;
  width: 100%;
  height: 180px;
  user-select: none;
  border-radius: var(--preview-card-for-creater-border-radius);
  overflow: hidden;
}
.image-holder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.card-preview-information-holder {
  display: flex;
  flex-direction: column;
  padding-left: var(--default-padding);
}
.card-title {
  margin-bottom: 5px;
  font-size: var(--large-font-size);
  font-weight: var(--large-font-weight);
  color: var(--color-light);
  padding: 10px 5px 5px 5px;
  display: block;
  width: 282px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-title a {
  text-decoration: none;
  color: var(--color-light);
  font-size: var(--large-font-size);
  font-weight: var(--large-font-weight);
}
.card-description {
  color: var(--color-light);
  font-size: var(--regular-font-size);
}
</style>
