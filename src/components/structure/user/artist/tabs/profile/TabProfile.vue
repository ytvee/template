<template>
  <div class="profile-data">
    <div class="profile-data-wrapper">
      <div class="user-gallery">
        <ArtistGallery :images="artist?.images || []" />
      </div>
      <div class="user-data">
        <h3 class="bio">Bio</h3>
        <p class="description">
          {{ bioInformation }}
        </p>
        <div class="read-more" @click="openModalReadMore()">Read more</div>
        <SocialLinksList :links="artist?.links || []" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import ArtistGallery from "@/components/structure/artist/ArtistGallery.vue";
import SocialLinksList from "@/components/structure/artist/SocialLinks.vue";
import ReadMore from "@/components/structure/modals/info/ReadMore.vue";

export default {
  components: {
    SocialLinksList,
    ArtistGallery,
  },
  props: {
    artist: {
      type: Object,
      required: true,
    },
    userLinks: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    modalProps() {
      return {
        displayedComponent: ReadMore,
      };
    },
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    openModalReadMore() {
      this[modalActions.SET_MODAL](this.modalProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
  },
};
</script>
<style scoped>
.profile-data-wrapper {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.user-gallery {
  flex: 0 1 50%;
}

.user-data {
  flex: 0 1 45%;
}

.bio {
  margin-bottom: 15px;
}

.description {
  max-height: 200px;
  overflow: hidden;
  /* todo: need to refactor variable */
  font-size: var(--reular-font-size);
  color: var(--color-light);
  line-height: 130%;
}

.read-more {
  color: var(--color-accent-primary);
  font-size: var(--medium-font-size-2);
  cursor: pointer;
  line-height: 130%;
  margin-bottom: 55px;
}
</style>
