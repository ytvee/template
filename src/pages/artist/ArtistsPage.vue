<template>
  <TabbedPane :initial-active-tab-index="+0" class="category-holder">
    <DynamicTab label="Artists" :is-updating="isArtistsUpdating">
      <ArtistsList :artists="artists" :is-favorites-button-to-be-shown="true" :tab-id="tabTypes.ARTISTS" />
    </DynamicTab>
    <DynamicTab label="Favorites" :is-updating="isFavoritesUpdating">
      <ArtistsList :artists="favorites" :tab-id="tabTypes.FAVORITES" />
    </DynamicTab>
    <DynamicTab label="My subscriptions" :is-updating="isSubscriptionsUpdating">
      <ArtistsList :artists="subscriptions" :tab-id="tabTypes.SUBSCRIPTIONS" />
    </DynamicTab>
  </TabbedPane>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import store from "@/store/store";
import tabTypes from "@/data/router/tabs/tabTypes.json";
import dataGetters from "@/data/store/data/dataGetters.json";
import dataActions from "@/data/store/data/dataActions.json";
import applicationActions from "@/data/store/application/applicationActions.json";
import modalActions from "@/data/store/modal/modalActions.json";
import userActions from "@/data/store/user/userActions.json";
import userGetters from "@/data/store/user/userGetters.json";
import storeModules from "@/data/store/storeModules.json";
import modalPlugin from "@/data/plugins/modal/modalPlugin.json";
import TabbedPane from "@/components/common/navigation/tabbedPane/TabbedPane.vue";
import DynamicTab from "@/components/common/navigation/tabbedPane/Tab/DynamicTab.vue";
import ArtistsList from "@/components/structure/user/artist/ArtistsList.vue";
import InformationMessage from "@/components/common/info/informationMessage/InformationMessage.vue";
import ChoseAccount from "@/components/structure/roleForm/ChoseAccount.vue";
import FanWelcomeModal from "@/components/structure/roleForm/FanWelcomeModal.vue";
import UserWelcomeModal from "@/components/structure/roleForm/UserWelcomeModal.vue";
import ChoseRoleForm from "@/components/structure/roleForm/ChoseRoleForm.vue";

const IS_FINAL_SIGN_UP_DEBUG_MODE = false; //if true show account chose steps on artists page

export default {
  name: "ArtistsPage",
  components: {
    TabbedPane,
    ArtistsList,
    DynamicTab,
  },
  data() {
    return {
      tabTypes,
      artists: [],
      favorites: [],
      subscriptions: [],
      isArtistsUpdating: true,
      isFavoritesUpdating: true,
      isSubscriptionsUpdating: true,
      publicPath: process.env.BASE_URL,
    };
  },
  computed: {
    ...mapGetters(storeModules.USER, [userGetters.GET_IS_NEED_FINAL_SIGN_UP, userGetters.GET_FINAL_SIGN_UP_STEPS]),
    ...mapState(storeModules.DATA, {
      cachedArtistsData: (state) => state.cachedArtistsData,
      cachedFavoritesData: (state) => state.cachedFavoritesData,
      cachedSubscriptionsData: (state) => state.cachedSubscriptionsData,
    }),
    ...mapGetters(storeModules.DATA, [dataGetters.IS_ARTISTS_CACHED, dataGetters.IS_FAVORITES_CACHED, dataGetters.IS_SUBSCRIPTIONS_CACHED]),
    modalChoseAccountProps() {
      return {
        displayedComponent: ChoseAccount,
      };
    },
    modalFanWelcomeProps() {
      return {
        displayedComponent: FanWelcomeModal,
      };
    },
    modalUserWelcomeProps() {
      return {
        displayedComponent: UserWelcomeModal,
      };
    },
    modalChoseRoleFormProps() {
      return {
        displayedComponent: ChoseRoleForm,
        displayedComponentProps: {
          case: "finalSignUpSteps",
        },
      };
    },
  },
  watch: {
    getFinalSignUpSteps: {
      handler(finalSignUpSteps) {
        if (this.onChoseRoleFormSubmit(finalSignUpSteps)) {
          return;
        }
        if (this.onChoseAccountSubmit(finalSignUpSteps)) {
          return;
        }
      },
      deep: true,
    },
  },
  created() {
    this.loadArtists();
    this.loadFavorites();
    this.loadSubscriptions();
    this.$eventBus.on("passParametersFilter", this.loadArtistsByTypeAndName);
  },
  mounted() {
    this.$eventBus.on("silent-update-subscriptions", () => {
      this.getSubscriptionsFromBackend();
    });
    this.$eventBus.on("silent-update-artists", () => {
      this.getArtistsFromBackend();
    });
    this.$eventBus.on("silent-update-favorites", () => {
      this.getFavoritesFromBackend();
    });
    this.finalSignUpStepsOnArtistsPage();
  },
  methods: {
    async loadArtistsByTypeAndName(artistsParams) {
      await this.$load(async () => {
        await this.getArtistsByTypeFromBackend(artistsParams);
      });
    },
    async getArtistsByTypeFromBackend(artistsParams) {
      const { data: resdata } = await this.$api.artist.getArtists(artistsParams?.types, artistsParams?.query);
      this.artists = resdata.data.artists;
    },
    ...mapActions(storeModules.APPLICATION, [applicationActions.SET_IS_LOADING]),
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    ...mapActions(storeModules.USER, [userActions.SET_IS_NEED_FINAL_SIGN_UP, userActions.SET_FINAL_SIGN_UP_STEPS]),
    ...mapActions(storeModules.DATA, [dataActions.CACHE_ARTISTS, dataActions.CACHE_FAVORITES, dataActions.CACHE_SUBSCRIPTIONS]),
    loadArtists(loadFromCache = false) {
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
    loadFavorites(loadFromCache = false) {
      this.$load(
        async () => {
          this.isFavoritesUpdating = true;
          if (this[dataGetters.IS_FAVORITES_CACHED] && loadFromCache) {
            this.getFavoritesFromCache();
          } else {
            await this.getFavoritesFromBackend();
          }
          this.isFavoritesUpdating = false;
        },
        this.artistsLoadErrorHandler,
        false
      );
    },
    loadSubscriptions(loadFromCache = false) {
      this.$load(
        async () => {
          this.isSubscriptionsUpdating = true;
          if (this[dataGetters.IS_SUBSCRIPTIONS_CACHED] && loadFromCache) {
            this.getSubscriptionsFromCache();
          } else {
            await this.getSubscriptionsFromBackend();
          }
          this.isSubscriptionsUpdating = false;
        },
        this.artistsLoadErrorHandler,
        false
      );
    },
    getArtistsFromCache() {
      this.artists = this.cachedArtistsData.artists;
    },
    async getArtistsFromBackend() {
      const { data: artistsResdata } = await this.$api.artist.getArtists();
      const artists = artistsResdata.data.artists;
      this.artists = artists;
      this[dataActions.CACHE_ARTISTS]({ artists: artists, page: 1 });
    },
    getFavoritesFromCache() {
      this.favorites = this.cachedFavoritesData.artists;
    },
    async getFavoritesFromBackend() {
      const { data: favoritesResdata } = await this.$api.artist.getFavorites();
      const favorites = favoritesResdata.data.artists;
      this.favorites = favorites;
      this[dataActions.CACHE_FAVORITES]({ artists: favorites, page: 1 });
    },
    getSubscriptionsFromCache() {
      this.subscriptions = this.cachedSubscriptionsData.artists;
    },
    async getSubscriptionsFromBackend() {
      const { data: subscriptionsResdata } = await this.$api.artist.getSubscriptions();
      const subscriptions = subscriptionsResdata.data.subscriptions;
      this.subscriptions = subscriptions;
      this[dataActions.CACHE_SUBSCRIPTIONS]({
        artists: subscriptions,
        page: 1,
      });
    },
    artistsLoadErrorHandler(error) {
      const modalPropsObject = {
        displayedComponent: InformationMessage,
        displayedComponentProps: {
          message: "An error occurred while loading data, please try again later...",
        },
      };
      if (!error.response) {
        console.error(error);
      } else {
        console.error(error.response);
      }
      store.dispatch(modalPlugin.MODAL_SET_MODAL, modalPropsObject);
      store.dispatch(modalPlugin.MODAL_SET_MODAL_VISIBILITY, true);
    },
    finalSignUpStepsOnArtistsPage() {
      this.clearFinalSignUpStepsStorage();
      if (IS_FINAL_SIGN_UP_DEBUG_MODE) {
        this[userActions.SET_IS_NEED_FINAL_SIGN_UP](true);
      }

      if (this[userGetters.GET_IS_NEED_FINAL_SIGN_UP]) {
        this.openChoseAccountModal();
        this.disableFinalSignUpStepsForThisUserForever();
      }
    },
    clearFinalSignUpStepsStorage() {
      this[userActions.SET_FINAL_SIGN_UP_STEPS]({});
    },
    disableFinalSignUpStepsForThisUserForever() {
      this[userActions.SET_IS_NEED_FINAL_SIGN_UP](false);
    },
    openChoseAccountModal() {
      this[modalActions.SET_MODAL](this.modalChoseAccountProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    openFanWelcomeModal() {
      this[modalActions.SET_MODAL](this.modalFanWelcomeProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    openUserWelcomeModal() {
      this[modalActions.SET_MODAL](this.modalUserWelcomeProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    openChoseRoleForm() {
      this[modalActions.SET_MODAL](this.modalChoseRoleFormProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    onChoseRoleFormSubmit(finalSignUpSteps) {
      if (finalSignUpSteps?.ChoseRoleForm) {
        if (finalSignUpSteps?.ChoseRoleForm === "skip") {
          this.openUserWelcomeModal();
        }
        return true;
      }
      return false;
    },
    onChoseAccountSubmit(finalSignUpSteps) {
      if (finalSignUpSteps?.ChoseAccount) {
        if (finalSignUpSteps?.ChoseAccount === "fan") {
          this.openFanWelcomeModal();
        }
        if (finalSignUpSteps?.ChoseAccount === "creator") {
          this.openChoseRoleForm();
        }
        if (finalSignUpSteps.ChoseAccount === "skip") {
          this.openUserWelcomeModal();
        }
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped>
/* temp */
.category-holder {
  padding-top: 50px;
}
</style>
