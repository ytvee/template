<template>
  <div class="artists-list">
    <CardsPageFilter v-if="isArtistTab" />
    <div v-if="isArtists" class="preview-cards-holder">
      <PreviewCard v-for="artist in artists" :key="artist.id" :artist="artist" :is-favorites-button-to-be-shown="isFavoritesButtonToBeShown" :variant="tabId" @click="openMemberModal(artist)" />
    </div>
    <div v-else class="status-artists-container">
      <h2>{{ noDataMessage }}</h2>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import MemberModal from "@/components/structure/modals/artist/MemberModal.vue";
import tabTypes from "@/data/router/tabs/tabTypes.json";
import PreviewCard from "@/components/structure/user/artist/preview/PreviewCard.vue";
import CardsPageFilter from "@/components/common/navigation/filters/CardsPageFilter.vue";
import messageStatus from "@/data/navbar/message/messageStatus.json";
import entityTypes from "@/data/user/entityTypes.json";

export default {
  name: "ArtistsList",
  components: {
    PreviewCard,
    CardsPageFilter,
  },
  props: {
    isFavoritesButtonToBeShown: {
      type: Boolean,
      required: false,
      default: false,
    },
    artists: {
      type: Array,
      default: () => [],
    },
    tabId: {
      type: String,
      default: "",
    },
    clickOnPreviewCard: {
      type: Function,
      default: () => {
        return;
      },
    },
  },
  computed: {
    isArtists() {
      if (!this.artists) {
        return false;
      }
      return this.artists.length > 0;
    },
    isArtistTeamPage() {
      return this.tabId === tabTypes.TEAM;
    },
    isArtistTab() {
      return this.tabId === tabTypes.ARTISTS;
    },
    noDataMessage() {
      if (this.isArtistTeamPage) {
        return messageStatus.NO_TEAM;
      }
      if (this.tabId === tabTypes.FAVORITES) {
        return messageStatus.FAVORITES;
      }
      if (this.tabId === tabTypes.SUBSCRIPTIONS) {
        return messageStatus.SUBSCRIPTIONS;
      }
      return messageStatus.ARTISTS;
    },
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    modalMemberProps(user) {
      return {
        displayedComponent: MemberModal,
        displayedComponentProps: {
          id: user.id,
          memberType: entityTypes.TYPE_MEMBER,
          //isApprove: false,
        },
      };
    },
    openMemberModal(user) {
      if (this.isArtistTeamPage) {
        this[modalActions.SET_MODAL](this.modalMemberProps(user));
        this[modalActions.SET_MODAL_VISIBILITY](true);
      }
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

.status-artists-container {
  width: 100%;
  text-align: center;
  display: flex;
  flex: auto;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}
</style>
