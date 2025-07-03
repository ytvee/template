<template>
  <button
    class="favorites-button"
    :class="{
      active: isActive,
      inaccessible: isActionInProgress,
      [themeType]: themeType,
    }"
    @click.stop="favoritesAction"
  >
    <LoadingCircle v-show="isActionInProgress" :theme="loadingTheme" class="fit-loader" />
    <div v-if="isFavoritesButton || isPostLikeButton" v-show="!isActionInProgress" class="likes-group">
      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.21607 15.9593L9.21462 15.958C6.61966 13.6498 4.54731 11.8014 3.112 10.0789C1.68704 8.36884 1 6.90904 1 5.3951C1 2.93556 2.95284 1 5.5 1C6.94478 1 8.34274 1.66486 9.24741 2.69881L10 3.55896L10.7526 2.69881C11.6573 1.66486 13.0552 1 14.5 1C17.0472 1 19 2.93556 19 5.3951C19 6.90904 18.313 8.36884 16.888 10.0789C15.4527 11.8014 13.3803 13.6498 10.7854 15.958L10.7839 15.9593L10 16.6593L9.21607 15.9593Z" stroke="#D9D9D9" stroke-width="2" />
      </svg>
      <div v-if="isPostLikeButton && likesAmount" class="likes-amount">
        {{ roundedLikesAmount }}
      </div>
    </div>
    <span v-else-if="isFollowButton">
      <span v-show="!isActive && !isActionInProgress"> FOLLOW </span>
      <span v-show="isActive && !isActionInProgress"> UNFOLLOW </span>
    </span>
  </button>
</template>

<script>
import { mapActions } from "vuex";
import { NotificationsTypes } from "@/utils/types/notifications.types";
import modules from "@/data/injectableModules/modules.json";
import storeModules from "@/data/store/storeModules.json";
import notificationsActions from "@/data/store/notifications/notificationsActions.json";
import loaderThemes from "@/data/theme/loaderThemes.json";
import LoadingCircle from "@/components/common/loader/LoadingCircle.vue";
import silentUpdate from "@/data/navbar/buttons/silentUpdate.json";
import buttonsProfile from "@/data/navbar/buttons/buttonsProfile.json";

const ERROR_MESSAGE_FAVORITES_PART1 = "The attempt to add ";
const ERROR_MESSAGE_FAVORITES_PART2 = " to favorites was  unsuccessful";
const ERROR_MESSAGE_FOLLOW_PART2 = " to subscriptions was  unsuccessful";

export default {
  components: {
    LoadingCircle,
  },
  inject: [modules.ROUND_NUMBER],
  props: {
    themeType: {
      type: String,
      required: true,
    },
    likeContent: {
      type: Object,
      required: true,
    },
    buttonSelection: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isActive: false,
      isActionInProgress: false,
      likesAmount: null,
    };
  },
  computed: {
    loadingTheme() {
      return this.isActive ? loaderThemes.DARK : loaderThemes.ACCENT;
    },
    isFavoritesButton() {
      return this.buttonSelection === buttonsProfile.FAVORITES;
    },
    isFollowButton() {
      return this.buttonSelection === buttonsProfile.FOLLOW;
    },
    isPostLikeButton() {
      return this.buttonSelection === buttonsProfile.POST_LIKE;
    },
    roundedLikesAmount() {
      return this[modules.ROUND_NUMBER](this.likesAmount);
    },
  },
  watch: {
    likeContent: {
      handler() {
        if (this.isFavoritesButton) {
          this.isActive = this.likeContent?.isInFavourites;
        } else if (this.isFollowButton) {
          this.isActive = this.likeContent?.subscribed;
        } else if (this.isPostLikeButton) {
          this.isActive = this.likeContent?.acted;
          this.likesAmount = this.likeContent?.count ?? 0;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions(storeModules.NOTIFICATIONS, [notificationsActions.ADD_NOTIFICATION]),
    async favoritesAction() {
      this.isActionInProgress = true;
      await this.manageFavoritesContent();
      this.isActionInProgress = false;
    },
    async manageFavoritesContent() {
      await this.$load(
        async () => {
          if (!this.isActive) {
            await this.addToFavorites();
            this.isActive = true;
          } else {
            await this.removeFromFavorites();
            this.isActive = false;
          }
        },
        this.actionErrorHandler,
        false
      );
    },
    async addToFavorites() {
      if (this.isFavoritesButton) {
        await this.addArtistToFavorites();
        this.callArtistsSilentUpdate();
        this.callFavoritesSilentUpdate();
      } else if (this.isFollowButton) {
        await this.subscribeToArtist();
        this.callSubscriptionsSilentUpdate();
      } else if (this.isPostLikeButton) {
        await this.likePost();
        this.likesAmount++;
      }
    },
    async removeFromFavorites() {
      if (this.isFavoritesButton) {
        await this.removeArtistFromFavorites();
        this.callArtistsSilentUpdate();
        this.callFavoritesSilentUpdate();
      } else if (this.isFollowButton) {
        await this.unsubscribeFromArtist();
        this.callSubscriptionsSilentUpdate();
      } else if (this.isPostLikeButton) {
        await this.unlikePost();
        this.likesAmount--;
      }
    },

    async subscribeToArtist() {
      const payload = {
        artist_id: this.likeContent.id,
      };
      await this.$api.artist.addToSubscriptions(payload);
    },
    async unsubscribeFromArtist() {
      await this.$api.artist.removeFromSubscriptions(this.likeContent.id);
    },

    async addArtistToFavorites() {
      const payload = {
        artist_id: this.likeContent.id,
      };
      await this.$api.artist.addToFavorites(payload);
    },
    async removeArtistFromFavorites() {
      await this.$api.artist.removeFromFavorites(this.likeContent.id);
    },

    async likePost() {
      await this.$api.forum.likeMessage(this.likeContent.id);
    },
    async unlikePost() {
      await this.$api.forum.unlikeMessage(this.likeContent.id);
    },

    actionErrorHandler() {
      const favoritesErrorNotification = {
        //TODO: need to redo
        message: this.notificationErrorMessage(),
        type: NotificationsTypes.FAILURE,
      };
      this[notificationsActions.ADD_NOTIFICATION](favoritesErrorNotification);
    },
    notificationErrorMessage() {
      return ERROR_MESSAGE_FAVORITES_PART1 + this.aristProfileLink() + this.actionDependMessagePart();
    },
    actionDependMessagePart() {
      return this.isFavoritesButton ? ERROR_MESSAGE_FAVORITES_PART2 : ERROR_MESSAGE_FOLLOW_PART2;
    },
    aristProfileLink() {
      return `<a style="color: var(--color-accent-primary)" href="/artist/${this.likeContent.id}"> ${this.likeContent.name} </a>`;
    },
    callArtistsSilentUpdate() {
      this.$eventBus.emit(silentUpdate.ARTISTS);
    },
    callFavoritesSilentUpdate() {
      this.$eventBus.emit(silentUpdate.FAVORITES);
    },
    callSubscriptionsSilentUpdate() {
      this.$eventBus.emit(silentUpdate.SUBSCRIPTIONS);
    },
  },
};
</script>
<style scoped>
.favorites-button,
.favorites-button.light {
  padding: var(--padding-button-1);
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: var(--button-border-width) solid var(--color-gray-light) !important;
  border-radius: var(--small-border-radius);
  background: transparent;
  color: var(--color-gray-light);
}

.favorites-button.dark {
  background: var(--color-dark);
}

.favorites-button path {
  stroke: var(--color-gray-light);
}

.favorites-button:hover {
  filter: brightness(1.3);
  transition: var(--default-transition);
  color: var(--color-gray-light) !important;
  -webkit-text-fill-color: var(--color-gray-light);
}

.favorites-button.active {
  transform: scale(1) !important;
  border-color: var(--color-dark) !important;
  background: var(--gradient-card-dark);
  -webkit-text-fill-color: var(--color-dark);
}

.favorites-button.active path {
  fill: var(--color-dark);
  stroke: var(--color-dark);
}
.inaccessible {
  pointer-events: none;
}
.fit-loader {
  /* width: 20%; */
  height: 75%;
}

.fit-loader:deep(.circle-svg) {
  width: unset;
  height: 100%;
}

.likes-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
}

.likes-amount {
  font-size: var(--medium-font-size-2);
  line-height: 1;
}
</style>
