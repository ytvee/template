<template>
  <div class="track-card">
    <div
      class="player-section"
      :style="{
        backgroundImage: `url(./assets/startpage/TrackCardExample.jpg)`,
      }"
    >
      <div class="player-button-holder">
        <svg width="29" height="36" viewBox="0 0 29 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.0701 0.944396C1.73846 0.101027 0 1.0578 0 2.63404V33.366C0 34.9422 1.73847 35.899 3.0701 35.0556L27.3322 19.6896C28.572 18.9044 28.572 17.0956 27.3321 16.3104L3.0701 0.944396Z" />
        </svg>
      </div>
      <div v-if="isLoggedIn" class="like-button-wrapper">
        <FavoritesButton :theme-type="favoritesButtonThemes.DARK" :like-content="{}" class="disabled" :button-selection="buttonsProfile.FAVORITES" />
      </div>
      <div class="statistics-pane">
        <div class="statistics-pane-item">
          555
          <br />
          Minted
        </div>
        <div class="divider" />
        <div class="statistics-pane-item">
          <div class="icon-holder">
            <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4.5C10.2044 4.5 9.44129 4.81607 8.87868 5.37868C8.31607 5.94129 8 6.70435 8 7.5C8 8.29565 8.31607 9.05871 8.87868 9.62132C9.44129 10.1839 10.2044 10.5 11 10.5C11.7956 10.5 12.5587 10.1839 13.1213 9.62132C13.6839 9.05871 14 8.29565 14 7.5C14 6.70435 13.6839 5.94129 13.1213 5.37868C12.5587 4.81607 11.7956 4.5 11 4.5ZM11 12.5C9.67392 12.5 8.40215 11.9732 7.46447 11.0355C6.52678 10.0979 6 8.82608 6 7.5C6 6.17392 6.52678 4.90215 7.46447 3.96447C8.40215 3.02678 9.67392 2.5 11 2.5C12.3261 2.5 13.5979 3.02678 14.5355 3.96447C15.4732 4.90215 16 6.17392 16 7.5C16 8.82608 15.4732 10.0979 14.5355 11.0355C13.5979 11.9732 12.3261 12.5 11 12.5ZM11 0C6 0 1.73 3.11 0 7.5C1.73 11.89 6 15 11 15C16 15 20.27 11.89 22 7.5C20.27 3.11 16 0 11 0Z" />
            </svg>
          </div>
          555k
          <br />
          Viewed
        </div>
        <div class="divider" />
        <div class="statistics-pane-item">
          <div class="icon-holder" />
          <div class="text-holder">
            555
            <br />
            Traded
          </div>
        </div>
      </div>
    </div>
    <div class="card-description">
      <div class="card-description-header">Track name{{ data }}</div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nisl sed sed dui tellus. Nulla non phasellus tellus sapien, sit.
    </div>
    <div class="buttons-holder">
      <div class="artist-button">
        <div class="avatar-holder">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 0C10.1935 0 11.3381 0.474106 12.182 1.31802C13.0259 2.16193 13.5 3.30653 13.5 4.5C13.5 5.69347 13.0259 6.83807 12.182 7.68198C11.3381 8.52589 10.1935 9 9 9C7.80653 9 6.66193 8.52589 5.81802 7.68198C4.97411 6.83807 4.5 5.69347 4.5 4.5C4.5 3.30653 4.97411 2.16193 5.81802 1.31802C6.66193 0.474106 7.80653 0 9 0ZM9 11.25C13.9725 11.25 18 13.2638 18 15.75V18H0V15.75C0 13.2638 4.0275 11.25 9 11.25Z" fill="#1D2227" />
          </svg>
        </div>
        <div class="text-holder">Artist</div>
        <div class="check-mark-holder">
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.1399 1.85266L10.2859 1.70973L10.1399 1.5668L9.41475 0.857068L9.27492 0.720211L9.13503 0.857002L3.82847 6.04588L1.86486 4.12871L1.72497 3.99213L1.58525 4.12888L0.860106 4.83861L0.71407 4.98154L0.860106 5.12448L3.68868 7.89293L3.82857 8.02985L3.96847 7.89293L10.1399 1.85266Z" fill="#1D2227" stroke="#1D2227" stroke-width="0.4" />
          </svg>
        </div>
      </div>

      <button class="medium track-card-price">
        <svg width="15" height="21" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.20711 0.292892C7.81658 -0.0976315 7.18342 -0.0976314 6.79289 0.292892L0.428932 6.65685C0.0384072 7.04738 0.0384072 7.68054 0.428932 8.07107C0.819456 8.46159 1.45262 8.46159 1.84315 8.07107L7.5 2.41421L13.1569 8.07107C13.5474 8.46159 14.1805 8.46159 14.5711 8.07107C14.9616 7.68054 14.9616 7.04738 14.5711 6.65685L8.20711 0.292892ZM8.5 21L8.5 1L6.5 1L6.5 21L8.5 21Z" />
        </svg>

        2.2 ADA
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import favoritesButtonThemes from "@/data/theme/favoritesButtonThemes.json";
import storeModules from "@/data/store/storeModules.json";
import FavoritesButton from "@/components/common/navigation/buttons/FavoritesButton.vue";
import buttonsProfile from "@/data/navbar/buttons/buttonsProfile.json";

export default {
  name: "TrackCard",
  components: {
    FavoritesButton,
  },
  props: {
    data: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      favoritesButtonThemes,
      buttonsProfile,
    };
  },
  computed: {
    ...mapState(storeModules.USER, {
      isLoggedIn: (state) => state.isLoggedIn,
    }),
  },
};
</script>

<style scoped>
.track-card {
  width: 348px;
  height: 358px;

  border-radius: var(--track-card-border-radius);
  /*background: rgb(124, 255, 124);*/
  background: var(--gradient-card-dark), var(--color-dark);
  box-shadow: 2px 2px 9px var(--transparent-accent-20);

  padding: 5px;
  display: flex;
  flex-direction: column;
}

.player-section {
  margin-bottom: 0.625rem;
  position: relative;
  width: 100%;
  height: 180px;

  border-radius: var(--track-card-border-radius);
  background-size: cover;
}

.like-button-wrapper {
  position: absolute;
  right: 15px;
  top: 10px;
}

.player-button-holder {
  position: absolute;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
}

.player-button-holder > * {
  position: relative;
  top: -10%;
  fill: var(--color-light);
  transition: var(--default-transition);
}

.player-button-holder:hover > * {
  fill: var(--color-gray);
  transition: var(--default-transition);
}

.player-button-holder:active > * {
  fill: var(--color-gray-medium);
  transition: var(--default-transition);
}
.statistics-pane {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;

  background: var(--track-card-statistics-pane-blur-background);
  backdrop-filter: blur(2px);
  border-radius: 0px 0px var(--track-card-border-radius) var(--track-card-border-radius);

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.statistics-pane .divider {
  background: var(--color-light);
  width: 1px;
  height: 60%;
}

.statistics-pane-item {
  font-size: var(--small-font-size);
  font-weight: var(--regular-font-weight);
  /* flex-basis: 30%; */

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 0 0.5rem;
}

.statistics-pane-item svg {
  fill: var(--color-light);
}

.card-description {
  flex-grow: 1;
  padding: 0 0.625rem;

  font-size: var(--regular-font-size);
}

.card-description-header {
  font-size: var(--track-card-header-font-size);
  font-weight: var(--large-font-weight);
}

.track-card .buttons-holder {
  padding: 0.625rem;
  display: flex;
  justify-content: space-between;
}

.track-card .artist-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  opacity: 1;
  transition: var(--default-transition);
  cursor: pointer;
}

.track-card .artist-button:hover {
  opacity: 0.5;
  transition: var(--default-transition);
}

.track-card .artist-button .avatar-holder {
  width: 40px;
  height: 40px;
  border-radius: var(--border-raduis-circle);
  background: var(--gradient-card-dark);

  display: flex;
  justify-content: center;
  align-items: center;
}

.track-card .artist-button .text-holder {
  font-size: var(--medium-font-size-2);
  font-weight: var(--medium-font-weight);
}

.track-card .artist-button .check-mark-holder {
  width: 15px;
  height: 15px;
  border-radius: var(--border-raduis-circle);
  background: var(--gradient-primary-1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.track-card-price {
  padding-left: 1.375rem !important;
  padding-right: 1.375rem !important;

  display: flex;
  align-items: center;
  gap: var(--medium-block-gap);
}

.track-card-price > svg {
  display: block;
  transition: var(--default-transition);
  fill: var(--color-dark);
}

.track-card-price:hover > svg {
  transition: var(--default-transition);
  fill: var(--color-accent-primary);
}
</style>
