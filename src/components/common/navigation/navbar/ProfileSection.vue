<template>
  <div class="profile-section" @mouseover="isProfileDropdownShown = true" @mouseout="isProfileDropdownShown = false">
    <div class="user-state-holder">
      <div class="user-state"></div>
    </div>
    <div class="profile-image">
      <RoundAvatar :avatar-src="userPictureURI()" />
    </div>
    <div v-show="isProfileDropdownShown" class="profile-popup-panel-holder" @mouseover="isProfileDropdownShown = true">
      <div class="profile-popup-panel">
        <div class="profile-image">
          <RoundAvatar :avatar-src="userPictureURI()" />
        </div>
        <button class="profile-popup-panel-item" @click="goStub">Settings</button>
        <button class="profile-popup-panel-item" @click="goStub">Connect wallet</button>
        <button class="profile-popup-panel-item" @click="goStub">Web3Auth</button>
        <div v-if="isLoggedIn" class="logout-section">
          <button class="logout-button" @click="logoutHandler()">
            Log out
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0H2C0.89 0 0 0.89 0 2V6H2V2H16V16H2V12H0V16C0 16.5304 0.210714 17.0391 0.585786 17.4142C0.960859 17.7893 1.46957 18 2 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V2C18 0.89 17.1 0 16 0ZM7.08 12.58L8.5 14L13.5 9L8.5 4L7.08 5.41L9.67 8H0V10H9.67L7.08 12.58Z" fill="white" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import userActions from "@/data/store/user/userActions.json";
import userGetters from "@/data/store/user/userGetters.json";
import applicationActions from "@/data/store/application/applicationActions.json";
import modalActions from "@/data/store/modal/modalActions.json";
import userMutations from "@/data/store/user/userMutations.json";
import InformationMessage from "@/components/common/info/informationMessage/InformationMessage.vue";
import RoundAvatar from "../../user/RoundAvatar.vue";

export default {
  components: {
    RoundAvatar,
  },
  data() {
    return {
      isProfileDropdownShown: false,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user.currentUser,
    }),
    ...mapState(storeModules.USER, {
      isLoggedIn: (state) => state.isLoggedIn,
    }),
    ...mapGetters(storeModules.USER, [userGetters.GET_CURRENT_USER_PREVIEW_IMAGE, "isLoggedIn"]),
  },
  methods: {
    ...mapMutations([userMutations.OPEN_MODAL_CONNECT_WALLET]),
    ...mapActions(storeModules.USER, [userActions.SET_USER, userActions.SET_IS_LOGGED_IN, "signOutUser"]),
    ...mapActions(storeModules.APPLICATION, [applicationActions.SET_IS_LOADING]),
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    userPictureURI() {
      return this.user?.pictureURI;
    },
    async logoutHandler() {
      await this.signOutUser();
    },
    modalErrorProps(message) {
      return {
        displayedComponent: InformationMessage,
        displayedComponentProps: {
          message: message,
        },
      };
    },
    goStub() {
      alert("This is the stub function!")
    },
  },
};
</script>

<style scoped>
.profile-section {
  position: relative;
  max-width: 51px;
  cursor: pointer;
}

.user-state-holder {
  position: absolute;
  top: -7px;
  right: -7px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--border-raduis-circle);
  background-color: var(--color-gray-dark);
  z-index: 500;
}

.user-state {
  margin: auto;
  width: 6px;
  height: 6px;
  border-radius: var(--border-raduis-circle);
  background-color: var(--color-success);
}

.profile-image {
  margin: var(--margin-zero-auto);
  width: var(--profile-icon-width);
  height: var(--profile-icon-width);
  overflow: hidden;
  border-radius: var(--border-raduis-circle);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image svg {
  width: calc(var(--profile-icon-width) / 2);
  height: calc(var(--profile-icon-width) / 2);
  /* todo: need to update variable */
  fill: var(--profile-svg-fill-color);
}

.profile-popup-panel-holder {
  right: 0;
  background: transparent;
  position: absolute;
  padding-top: calc(var(--navbar-height) / 2);
  width: max-content;
  top: 60%;
}

.profile-popup-panel {
  box-shadow: var(--shadow-accent);
  background: var(--color-dark);
  border-radius: var(--medium-border-radius);
  padding: var(--regular-padding);
  min-width: 180px;
}

.profile-popup-panel .profile-image {
  width: var(--profile-icon-width);
  height: var(--profile-icon-width);
  overflow: hidden;
  border-radius: var(--border-raduis-circle);
  background: var(--gradient-card-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.profile-image svg {
  width: calc(var(--profile-icon-width) / 2);
  height: calc(var(--profile-icon-width) / 2);
  /* todo: need to refactor variable */
  fill: var(--profile-svg-fill-color);
}

/* Buttons */
.profile-popup-panel-item {
  border-radius: var(--button-border-radius);

  font-size: var(--regular-font-size);
  font-weight: var(--large-font-weight);
  color: var(--color-dark);

  margin: var(--margin-zero-auto);
  margin-bottom: 10px;
  width: 150px !important;
  height: var(--button-height-small);

  padding: 0 0.625rem !important;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}

.logout-button {
  border-width: 0;
  display: flex;
  align-items: center;
  color: var(--color-light);
  font-size: var(--medium-font-size);
  background: transparent;
  margin: var(--margin-zero-auto);
}

.logout-button:hover {
  border-width: var(--button-border-width);
  -webkit-text-fill-color: var(--color-light) !important;
}

.logout-button svg {
  margin-left: 10px;
}
</style>
