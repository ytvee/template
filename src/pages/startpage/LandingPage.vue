<template>
  <div class="landing-page">
    <div class="container">
      <div class="logo">
        <div class="logo-img">
          <img :src="logoPath" alt="" />
        </div>
        <div class="logo-text">
          <p>Jam Galaxy</p>
        </div>
      </div>

      <div class="left-column">
        <div class="h1-wrapper">
          <h1>Jam Galaxy</h1>
        </div>
        <div class="h2-wrapper">
          <h2>Next-gen music NFT platform</h2>
        </div>
        <div class="h3-wrapper">
          <h3>Here you may connect with your favorite artist, buy NFT tokens, purchase tickets on event</h3>
        </div>
        <div class="statistics-list">
          <div class="statistics-list-item">
            <div class="item-value">nk+</div>
            <div class="item-label">artists</div>
          </div>
          <div class="statistics-list-item">
            <div class="item-value">nk+</div>
            <div class="item-label">songs</div>
          </div>
          <div class="statistics-list-item">
            <div class="item-value">nk+</div>
            <div class="item-label">albums</div>
          </div>
        </div>
        <div v-if="!isLoggedIn" class="buttons-holder">
          <button class="large landing" @click="goToLogInPage()">Log in</button>
          <button class="large landing" @click="goToSignUpPage()">Sign up</button>
        </div>
        <div v-else class="buttons-holder">
          <button class="large landing" @click="goToArtistsPage()">Explore!</button>
        </div>
      </div>
      <div class="right-column">
        <CardSliderVue :cards-list="cardsList" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { logoPath } from "@/utils/constants/constants";
import storeModules from "@/data/store/storeModules.json";
import applicationActions from "@/data/store/application/applicationActions.json";
import CardSliderVue from "@/components/common/navigation/sliders/CardSlider.vue";
import routerPaths from "@/data/router/path/routerPaths.json";

export default {
  components: {
    CardSliderVue,
  },
  data() {
    return {
      logoPath,
      cardsList: [
        { data: "1" },
        { data: "2" },
        { data: "3" },
        { data: "4" },
        { data: "5" },
        // {data: '6'},
        // {data: '7'},
        // {data: '8'},
        // {data: '9'},
        // {data: '10'},
        // {data: '11'},
        // {data: '12'},
        // {data: '13'},
        // {data: '14'},
        // {data: '15'},
        // {data: '16'},
        // {data: '17'},
        // {data: '18'},
        // {data: '19'},
        // {data: '20'},
        // {data: '21'},
        // {data: '22'},
        // {data: '23'},
      ],
    };
  },
  computed: {
    ...mapState(storeModules.USER, {
      isLoggedIn: (state) => state.isLoggedIn,
    }),
  },
  methods: {
    ...mapActions(storeModules.APPLICATION, [applicationActions.SET_IS_LOADING]),
    goToLogInPage() {
      this.$router.push({ path: routerPaths.LOGIN });
    },
    goToSignUpPage() {
      this.$router.push({ path: routerPaths.SIGNUP });
    },
    goToArtistsPage() {
      this.$router.push({ path: routerPaths.ARTISTS });
    },
  },
};
</script>

<style scoped>
.landing-page {
  /* border: 1px solid red; */
  height: 100vh;
  color: var(--color-light);
}

.container {
  /* border: 1px solid green; */
  margin-left: calc(min(140px, 20%));
  height: 100%;
  position: relative;
  display: flex;

  align-items: center;
  gap: calc(min(calc(41% - 348px), 248px));
  /* flex-wrap: wrap; */
}

.logo {
  display: flex;
  align-items: center;
  user-select: none;
  position: absolute;
  top: 66px;
}
.logo:hover {
  cursor: pointer;
}
.logo-img {
  max-width: var(--logo-img-max-width);
  flex: auto;
}
.logo-img img {
  width: 100%;
  object-fit: cover;
}
.logo-text {
  font-weight: var(--large-font-weight);
  font-size: var(--logo-font-size);
  color: var(--color-light);
}

.left-column {
  flex-basis: 790px;
}
.h1-wrapper {
  margin-bottom: 0.625rem;
}
.h1-wrapper h1 {
  font-size: var(--landing-h1);
}
.h2-wrapper {
  margin-bottom: 3.75rem;
}
.h3-wrapper {
  margin-bottom: 1.875rem;
}

.statistics-list {
  display: flex;
  margin-bottom: 6.25rem;
}
.statistics-list-item {
  min-width: 120px;

  display: flex;
  flex-direction: column;
  align-items: center;
}
.statistics-list-item:not(:last-child) {
  margin-right: 50px;
}
.statistics-list-item .item-value {
  font-family: var(--statistics-font-family);
  font-weight: var(--small-font-weight);
  font-size: var(--statistics-value-font-size);
}
.statistics-list-item .item-label {
  font-family: var(--statistics-font-family);
  font-weight: var(--small-font-weight);
  font-size: var(--statistics-label-font-size);
}

.buttons-holder {
  display: flex;
}
.buttons-holder > *:not(:last-child) {
  margin-right: 44px;
}
button.landing {
  flex-basis: 220px;
}

.right-column {
  flex-grow: 1;
  flex-shrink: 2;
  /* border: 1px solid orange; */
}
</style>
