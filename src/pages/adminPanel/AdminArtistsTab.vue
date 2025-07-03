<template>
  <div>
    <CardsPageFilter v-show="false" />
    <div class="preview-cards-holder">
      <PreviewCard v-for="artist in artists" :key="artist.id" :artist="artist" :is-favorites-button-to-be-shown="false" :variant="tabTypes.ADMIN_PANEL" @click="openArtistModal(artist)" />
    </div>
  </div>
</template>

<script>
import PreviewCard from "@/components/structure/user/artist/preview/PreviewCard.vue";
import CardsPageFilter from "@/components/common/navigation/filters/CardsPageFilter.vue";
import memberModal from "@/components/structure/modals/artist/MemberModal.vue";
import entityTypes from "@/data/user/entityTypes.json";
import { mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import tabTypes from "@/data/router/tabs/tabTypes.json";

export default {
  components: {
    PreviewCard,
    CardsPageFilter,
  },
  data() {
    return {
      artists: [],
      tabTypes,
    };
  },
  created() {
    this.$eventBus.on("updated-artists", () => {
      this.getArtists();
    });
    this.$eventBus.on("updated-unapprove-artists", () => {
      this.getArtists();
    });
  },
  async mounted() {
    await this.getArtists();
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    memberModalProps(artist) {
      return {
        displayedComponent: memberModal,
        displayedComponentProps: {
          artist: artist,
          memberType: entityTypes.TYPE_ARTIST_APPROVE,
          isApprove: true,
        },
      };
    },
    openArtistModal(artist) {
      this[modalActions.SET_MODAL](this.memberModalProps(artist));
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    async getArtists() {
      this.$load(
        async () => {
          const { data: artistsResdata } = await this.$api.artist.getArtists();
          this.artists = artistsResdata.data.artists;
        },
        null,
        false
      );
    },
  },
};
</script>

<style scoped>
.preview-cards-holder {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}
</style>
