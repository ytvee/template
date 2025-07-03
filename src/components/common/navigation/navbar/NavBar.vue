<template>
  <nav>
    <div class="nav-content">
      <div class="up-container">
        <div class="logo" @click.stop="goToLanding()">
          <img :src="logoPath" alt="" />
        </div>
        <div class="nav-buttons-panel">
          <NavbarItem v-for="(navItem, index) in navItems.pages" :key="index" :isActive="activePage === navItem.route"
            :iconPath="navItem.iconPath" @click.stop="setActiveTab(navItem.route)" />
        </div>
      </div>
      <div class="down-container">
        <div class="nav-buttons-panel">
          <NavbarItem v-for="(navItem, index) in navItems.buttons" :key="index" :isActive="false"
            :iconPath="navItem.iconPath" @click.stop="navItem.action" />
        </div>
        <ProfileSection />
      </div>
      <CreditWindow v-if="isCreditWindowOpen" :onClose="closeCreditWindow"/>
    </div>
  </nav>
</template>

<script>
import NavbarItem from "./NavbarItem.vue";
import SearchArea from "./SearchArea.vue";
import ProfileSection from "./ProfileSection.vue";
import CreditWindow from "../windows/CreditWindow.vue";
import storeModules from "@/data/store/storeModules.json";
import routerPaths from "@/data/router/path/routerPaths.json";
import AuthorizationService from '@/services/authorizationService';
import UserNotifications from "./notification/UserNotifications.vue";
// import navbarItemsData from "@/data/navbar/navigationItems.json";
import { pagesNavigationData } from "@/utils/constants/constants";
import { logoPath } from "@/utils/constants/constants";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  components: {
    ProfileSection,
    SearchArea,
    NavbarItem,
    UserNotifications,
    CreditWindow
  },
  data() {
    return {
      logoPath,
      navItems: {
        pages: pagesNavigationData,
        buttons: [],
      },
      isCreditWindowOpen: false,
      isSettingsOpen: false,
      // activePage: "aichat",
    };
  },
  methods: {
    ...mapMutations(storeModules.USER, ["resetSession"]),
    ...mapActions(storeModules.APPLICATION, ["setIsLoading", "setActivePage"]),
    goToLanding() {
      this.$router.push({ path: routerPaths.ARTISTS });
    },
    resetSocket() {
      this.$notificationsSocket.stop();
    },
    setActiveTab(tabName) {
      this.setActivePage(tabName);
      this.$router.push({ path: routerPaths[tabName] });
    },
    // openUrl(tabName) {
    //   console.log(`open ${tabName}`);
    // },
    toggleCreditWindow() {
      this.isCreditWindowOpen = !this.isCreditWindowOpen;
    },
    toggleSettings() {
      this.isSettingsOpen = !this.isSettingsOpen;

      console.log("You change isSettingsOpen: ", this.isSettingsOpen);
    },
    async handleLogout() {
      try {
        await this.setIsLoading(true);

        await AuthorizationService.signOut();

        this.resetSession();
        this.$router.push({ path: routerPaths.NEW_AUTHORIZATION });
      } catch (error) {
        console.error("SignOut error: ", error.message);
      } finally {
        await this.setIsLoading(false);
      }
    },
    closeCreditWindow() {
      this.isCreditWindowOpen = !this.isCreditWindowOpen;
    },
  },
  created() {
    this.navItems.buttons = [
      {
        name: "logout",
        iconPath: "/assets/navbar/logout.svg",
        action: this.handleLogout,
      },
      {
        name: "circle",
        iconPath: "/assets/navbar/circle.svg",
        action: this.toggleCreditWindow,
      },
      {
        name: "settings",
        iconPath: "/assets/navbar/settings.svg",
        action: this.toggleSettings,
      }
    ];
  },
  computed: {
    ...mapState(storeModules.USER, {
      isLoggedIn: (state) => state.isLoggedIn,
      currentUser: (state) => state.currentUser,
    }),
    ...mapState(storeModules.APPLICATION, {
      activePage: (state) => {
        console.log("CURRENT PAGE:", state.activePage);
        return state.activePage;
      },
    }),
  },
};
</script>

<style scoped>
nav {
  position: fixed;
  left: 0;
  top: 0;
  height: 97%;
  margin: 18px 20px;
  border-radius: 30px;
  background: var(--gradient-dark-green);
  transition: var(--default-transition);
  z-index: 100;
}

nav .nav-content {
  margin: var(--margin-zero-auto);
  padding: 15px 8px 8px 8px;
  width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: center;
}

.up-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--large-block-gap);
}

.down-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--medium-block-gap);
}

.active-text {
  -webkit-background-clip: text !important;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background: var(--color-accent-primary);
  text-decoration-color: var(--color-accent-primary);
  text-decoration-line: underline;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  margin: auto;
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
  min-width: 120px;
}

.nav-buttons-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  border-radius: 28px;
}

/* .search-item{
  margin-right: auto;
  flex: auto;
  max-width: 400px;
  min-width: 100px;
  position: relative;
}

.search-item input{
  border-color: var(--color-gray-medium);
} */

.nav-items {
  display: flex;
  flex-wrap: nowrap;
}
</style>
