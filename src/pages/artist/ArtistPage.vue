<template>
  <div class="profile-page">
    <ProfileHeader :is-user-card="false" :user="artist" :is-artist-page-viewed-by-artist-moderator="isArtistPageViewedByArtistModerator" />
    <TabbedPane :initial-active-tab-label="initialCurrentTabName" affected-route-param="currentTabLabel">
      <DynamicTab label="Profile" :is-updating="isDataUpdating">
        <ProfileData :user-data="artist" />
      </DynamicTab>
      <DynamicTab label="Team" :is-updating="isDataUpdating">
        <ArtistsList :artists="artistConfirmedMembers" :tab-id="tabTypes.TEAM" />
      </DynamicTab>
      <DynamicTab label="Forum">
        <ArtistForum :current-artist="artist" />
      </DynamicTab>
    </TabbedPane>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import dataGetters from "@/data/store/data/dataGetters.json";
import dataActions from "@/data/store/data/dataActions.json";
import applicationActions from "@/data/store/application/applicationActions.json";
import ProfileHeader from "@/components/common/headers/ProfileHeader.vue";
import TabbedPane from "@/components/common/navigation/tabbedPane/TabbedPane.vue";
import DynamicTab from "@/components/common/navigation/tabbedPane/Tab/DynamicTab.vue";
import ArtistsList from "@/components/structure/user/artist/ArtistsList.vue";
import ProfileData from "@/components/structure/user/general/ProfileData.vue";
import ArtistForum from "@/components/structure/forum/ArtistForum.vue";
import tabTypes from "@/data/router/tabs/tabTypes.json";
/*
  artist {
    id
    type
    name
    description
    logoURI
    coverURI
    members
    images
    links
  }

*/

export default {
  name: "ArtistPage",
  components: {
    ProfileHeader,
    TabbedPane,
    DynamicTab,
    ArtistsList,
    ProfileData,
    ArtistForum,
  },
  data() {
    return {
      artistId: this.$route.params.id,
      isDataUpdating: false,
      artist: {},
      tabTypes: tabTypes,
    };
  },
  computed: {
    ...mapState(storeModules.DATA, {
      cachedArtistData: (state) => state.cachedArtistData,
    }),
    ...mapGetters(storeModules.DATA, [dataGetters.IS_ARTIST_CACHED]),
    ...mapState(storeModules.USER, {
      currentUser: (state) => state.currentUser,
    }),
    initialCurrentTabName() {
      const currentTabLabelFromURI = this.$route.params.currentTabLabel;
      return currentTabLabelFromURI?.[0]?.toUpperCase() + currentTabLabelFromURI?.slice(1);
    },
    artistConfirmedMembers() {
      return this.artist.members?.filter((item) => {
        return item.is_confirmed === true;
      });
    },
    isArtistPageViewedByArtistModerator() {
      // return true;
      return Boolean(
        this.artist.members?.find((item) => {
          return item.moderator && item.is_confirmed && item.id === this.currentUser?.id;
        })
      );
    },
  },
  created() {
    this.loadArtist();
    // this.$router.go();
  },
  methods: {
    ...mapActions(storeModules.APPLICATION, [applicationActions.SET_IS_LOADING]),
    ...mapActions(storeModules.DATA, [dataActions.CACHE_ARTIST]),
    loadArtist() {
      this.$load(async () => {
        this.isDataUpdating = true;
        //temp disable
        //TODO fix constant
        const valFalse = false;
        if (this[dataGetters.IS_ARTIST_CACHED](this.artistId) && valFalse) {
          this.getArtistFromCache();
        } else {
          await this.getArtistFromBackend();
        }
        this.isDataUpdating = false;
      });
    },
    getArtistFromCache() {
      this.artist = this.cachedArtistData.artist;
    },
    async getArtistFromBackend() {
      const { data: resdata } = await this.$api.artist.getArtist(this.artistId);
      const artist = resdata?.data?.artist;
      this.artist = artist;
      this[dataActions.CACHE_ARTIST]({ artist: artist });
    },
  },
};
</script>
