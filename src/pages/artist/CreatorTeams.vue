<template>
  <div class="creator-teams">
    <TabbedPane :initial-active-tab-index="+0" class="category-holder">
      <DynamicTab label="" :is-updating="isArtistsUpdating">
        <div class="creator-teams-tab">
          <div class="title-holder">
            <h2>My teams</h2>
          </div>
          <div class="cards-container">
            <PreviewCardForCreator v-for="artist in unConfirmedArtists" :key="artist.id" :artist="artist" :is-un-confirmed="true" />
            <PreviewCardForCreator v-for="artist in confirmedArtists" :key="artist.id" :artist="artist" />
            <div class="add-new-artist-wrapper" @click="goToNewArtistCreation">
              <FileInput title="Add new artist" input-id="CreatorTeams" :is-enabled="false" />
            </div>
          </div>
        </div>
      </DynamicTab>
    </TabbedPane>
  </div>
</template>

<script>
import store from "@/store/store";
import { mapState, mapGetters, mapActions } from "vuex";
import userActions from "@/data/store/user/userActions.json";
import storeModules from "@/data/store/storeModules.json";
import dataGetters from "@/data/store/data/dataGetters.json";

import TabbedPane from "@/components/common/navigation/tabbedPane/TabbedPane.vue";
import DynamicTab from "@/components/common/navigation/tabbedPane/Tab/DynamicTab.vue";
import PreviewCardForCreator from "@/components/structure/user/artist/preview/PreviewCardForCreator.vue";
import FileInput from "@/components/structure/user/general/imageManager/PhotoInsert/FileInput.vue";

import InformationMessage from "@/components/common/info/informationMessage/InformationMessage.vue";
import modalPlugin from "@/data/plugins/modal/modalPlugin.json";

export default {
  name: "CreatorTeams",
  components: {
    PreviewCardForCreator,
    FileInput,
    TabbedPane,
    DynamicTab,
  },
  data() {
    return {
      unConfirmedArtists: [],
      confirmedArtists: [],
      isArtistsUpdating: true,
    };
  },
  computed: {
    ...mapState(storeModules.USER, {
      isAfterArtistCreation: (state) => state.isAfterArtistCreation,
    }),
    ...mapGetters(storeModules.DATA, [dataGetters.IS_ARTISTS_CACHED, dataGetters.IS_FAVORITES_CACHED, dataGetters.IS_SUBSCRIPTIONS_CACHED]),
  },
  created() {
    this.loadArtistsWhereUserIsMember();
    this.showArtistCreatedMessageDialog();
  },
  methods: {
    ...mapActions(storeModules.USER, [userActions.SET_IS_AFTER_ARTIST_CREATION]),
    goToNewArtistCreation() {
      this.$router.push({ path: `/newartist` });
    },
    loadArtistsWhereUserIsMember(loadFromCache = false) {
      //TODO: true to load with cache
      this.$load(async () => {
        this.isArtistsUpdating = true;
        if (this[dataGetters.IS_ARTISTS_CACHED] && loadFromCache) {
          this.getArtistsFromCache();
        } else {
          await this.getArtistsFromBackend();
        }
        this.isArtistsUpdating = false;
      }, this.artistsLoadErrorHandler);
    },
    async getArtistsFromBackend() {
      const { data: artistsResdata } = await this.$api.artist.getArtistsWhereUserIsMember();
      this.unConfirmedArtists = artistsResdata.data.unconfirmed_artists;
      this.confirmedArtists = artistsResdata.data.confirmed_artists;

      // this[dataActions.CACHE_ARTISTS]({artists: artists, page: 1}); //TODO: uncommit to cache artists data
    },
    showArtistCreatedMessageDialog() {
      if (this.isAfterArtistCreation) {
        this[userActions.SET_IS_AFTER_ARTIST_CREATION](false);
        const modalPropsObject = {
          displayedComponent: InformationMessage,
          displayedComponentProps: {
            message: "The artist has been created and is awaiting confirmation",
          },
        };
        store.dispatch(modalPlugin.MODAL_SET_MODAL, modalPropsObject);
        store.dispatch(modalPlugin.MODAL_SET_MODAL_VISIBILITY, true);
      }
    },
  },
};
</script>

<style scoped>
* {
  --card-width: 310px;
  --cards-container-gap: 50px;
}
.creator-teams {
  padding-bottom: 1rem;
}
.title-holder {
  margin-top: 2.5rem;
  margin-bottom: 1.875rem;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--card-width), var(--card-width)));
  row-gap: var(--cards-container-gap);
  column-gap: var(--preview-card-for-creater-column-gap);
  /* justify-content: center; */
}

.add-new-artist-wrapper {
  width: var(--card-width);
  height: 280px;
}
@media (max-width: 1200px) {
  .cards-container {
    justify-content: center;
  }
}
</style>
