import dataMutations from "@/data/store/data/dataMutations.json";
import type { State } from "@/store/store";
import type { ArtistsData, ArtistData } from "@/utils/types/data.types";
import type { ActionContext } from "vuex";

const TIME_FIELD_KEY = "time";
const OUTDATED_KEY = "isOudated";

export interface DataState {
  cachedArtistData: ArtistData;
  cachedArtistsData: ArtistsData;
  cachedFavoritesData: ArtistsData;
  cachedSubscriptionsData: ArtistsData;
}

type Context = ActionContext<DataState, State>;

const dataModule = {
  //TODO: remove this module
  namespaced: true as boolean,
  state: (): DataState => ({
    cachedArtistData: {} as ArtistData,
    cachedArtistsData: {} as ArtistsData,
    cachedFavoritesData: {} as ArtistsData,
    cachedSubscriptionsData: {} as ArtistsData,
  }),
  getters: {
    isArtistCached:
      (state: DataState) =>
      (artistId: number): boolean => {
        //INFO: do not use '===' here, there's js<>ts fork with string<>number
        return state.cachedArtistData?.artist?.id == artistId;
      },
    isArtistsCached(state: DataState): boolean {
      return state.cachedArtistsData?.artists?.length ? true : false;
    },
    isArtistsOutdated(state: DataState): boolean {
      return state.cachedArtistsData?.isOudated ? false : true;
    },
    isFavoritesCached(state: DataState): boolean {
      return state.cachedFavoritesData?.artists?.length ? true : false;
    },
    isSubscriptionsCached(state: DataState): boolean {
      return state.cachedSubscriptionsData?.artists?.length ? true : false;
    },
  },
  mutations: {
    cacheArtist(state: DataState, dataToCache: ArtistData): void {
      dataToCache[TIME_FIELD_KEY] = Date.now();
      state.cachedArtistData = dataToCache;
    },
    cacheArtists(state: DataState, dataToCache: ArtistsData): void {
      dataToCache[TIME_FIELD_KEY] = Date.now();
      state.cachedArtistsData = dataToCache;
    },
    cacheFavorites(state: DataState, dataToCache: ArtistsData): void {
      dataToCache[TIME_FIELD_KEY] = Date.now();
      state.cachedFavoritesData = dataToCache;
    },
    cacheSubscriptions(state: DataState, dataToCache: ArtistsData): void {
      dataToCache[TIME_FIELD_KEY] = Date.now();
      state.cachedSubscriptionsData = dataToCache;
    },
    markArtistsCachedDataAsOutdated(state: DataState): void {
      state.cachedArtistsData[OUTDATED_KEY] = true;
    },
  },
  actions: {
    setArtist(context: Context, payload: ArtistData): void {
      context.commit(dataMutations.CACHE_ARTIST, payload);
    },
    setArtists(context: Context, payload: ArtistsData): void {
      context.commit(dataMutations.CACHE_ARTISTS, payload);
    },
    setFavorites(context: Context, payload: ArtistsData): void {
      context.commit(dataMutations.CACHE_FAVORITES, payload);
    },
    setSubscriptions(context: Context, payload: ArtistsData): void {
      context.commit(dataMutations.CACHE_SUBSCRIPTIONS, payload);
    },
  },
};

export default dataModule;
