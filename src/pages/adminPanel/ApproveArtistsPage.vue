<template>
  <div class="access-creators-page">
    <CardsPageFilter v-if="false" />
    <div v-if="unapprovedArtists.length" class="artists-wrapper">
      <PreviewCard v-for="(artist, index) in unapprovedArtists" :key="index" class="artist-card" :artist="artist" :is-artist-card="true" :variant="tabTypes.ADMIN_PANEL" @click="openModalAccessCreator(artist)" />
    </div>
    <h3 v-else class="info-message">
      {{ messageStatus.ARTISTS_REQUESTS_IS_EMPTY }}
    </h3>
  </div>
</template>

<script>
import PreviewCard from "@/components/structure/user/artist/preview/PreviewCard.vue";
import CardsPageFilter from "@/components/common/navigation/filters/CardsPageFilter.vue";
import memberModal from "@/components/structure/modals/artist/MemberModal.vue";
import messageStatus from "@/data/navbar/message/messageStatus.json";
import { mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import entityTypes from "@/data/user/entityTypes.json";
import tabTypes from "@/data/router/tabs/tabTypes.json";

export default {
  components: {
    PreviewCard,
    CardsPageFilter,
  },
  data() {
    return {
      unapprovedArtists: [],
      tabTypes,
      messageStatus,
    };
  },
  created() {
    this.$eventBus.on("updated-unapprove-artists", () => {
      this.getUnapprovedArtists();
    });
  },
  async mounted() {
    await this.getUnapprovedArtists();
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    memberModalProps(artist) {
      return {
        displayedComponent: memberModal,
        displayedComponentProps: {
          artist: artist,
          memberType: entityTypes.TYPE_ARTIST_APPROVE,
          isApprove: false,
        },
      };
    },
    openModalAccessCreator(artist) {
      this[modalActions.SET_MODAL](this.memberModalProps(artist));
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    async getUnapprovedArtists() {
      await this.$load(
        async () => {
          const {
            data: { data: resdata },
          } = await this.$api.user.getClaimsForArtists();
          this.unapprovedArtists = resdata;
        },
        null,
        false
      );
    },
  },
};
</script>

<style scoped>
.artists-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}
</style>
