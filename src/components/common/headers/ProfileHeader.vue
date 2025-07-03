<template>
  <div class="profile-header" :class="{ 'user-card': isUserCard }" :style="obtainHeaderCoverBackground">
    <div class="profile-wrapper">
      <RoundAvatar class="user-avatar" :avatar-src="user?.logoURI || user?.pictureURI || ''" :is-enabled-for-uploading="profileEditPage || isSettingsArtistPage" />
      <div v-if="!isUserCard" class="profile-data">
        <h4 v-if="user.type" :data-text-stroke="user.type" class="user-type-holder">
          {{ user.type }}
        </h4>
        <h4 v-if="user.roles" :data-text-stroke="displayedUserRole" class="user-type-holder">
          {{ displayedUserRole }}
        </h4>
        <h2 :title="user.name" :data-text-stroke="user.name" class="user-name-holder">
          {{ user.name }}
        </h2>
      </div>
      <div v-if="isProfilePage" class="profile-buttons">
        <button class="medium outlined profile-button edit-profile" @click="goToEdit()">EDIT</button>
      </div>
      <div v-if="isEditPage" class="profile-buttons">
        <button class="medium profile-button change-cover" @click="showChoseRoleFormOrNotification()">My roles</button>
      </div>
      <div v-if="!isEditPage && !isProfilePage && !isSettingsArtistPage && !isUserCard && !isArtistPageViewedByArtistModerator" class="profile-buttons">
        <FavoritesButton class="like-button" :theme-type="favoritesButtonThemes.DARK" :like-content="user" :button-selection="buttonsProfile.FAVORITES" />
        <FavoritesButton class="follow-button" :theme-type="favoritesButtonThemes.DARK" :like-content="user" :button-selection="buttonsProfile.FOLLOW" />
      </div>
      <div v-if="isArtistPageViewedByArtistModerator" class="profile-buttons">
        <EditArtistButton />
      </div>
      <div v-if="isSettingsArtistPage || (isUser && isCreator)" class="profile-buttons">
        <ChangeCoverButton :theme-type="favoritesButtonThemes.DARK" :is-fit="true" input-id="ProfileHeader" :is-with-cover="Boolean(user?.coverURI)" />
      </div>
    </div>
    <UserLinks v-if="!isCreatorCard" class="user-links-component" :user-links="user.links" />
  </div>
  <h3 v-if="isUserCard" class="user-card-username-holder">
    {{ user.name }}
  </h3>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import userGetters from "@/data/store/user/userGetters.json";
import { RouteNames } from "@/utils/types/router.types";
import favoritesButtonThemes from "@/data/theme/favoritesButtonThemes.json";
import buttonsProfile from "@/data/navbar/buttons/buttonsProfile.json";
import storeModules from "@/data/store/storeModules.json";
import dataActions from "@/data/store/data/dataActions.json";
import ChoseRoleForm from "@/components/structure/roleForm/ChoseRoleForm.vue";
import InformationMessage from "@/components/common/info/informationMessage/InformationMessage.vue";
import modalActions from "@/data/store/modal/modalActions.json";
import routerPaths from "@/data/router/path/routerPaths.json";
import RoundAvatar from "../user/RoundAvatar.vue";
import UserLinks from "@/components/common/info/socialLinks/SocialLinks.vue";
import EditArtistButton from "../navigation/buttons/EditArtistButton.vue";
import ChangeCoverButton from "../navigation/buttons/ChangeCoverButton.vue";
import FavoritesButton from "@/components/common/navigation/buttons/FavoritesButton.vue";

export const ENTITY_TYPES = {
  USER_ROLES: {
    USER: "user",
    FAN: "fan",
    CREATOR: "creator",
  },
  ARTIST: "artist",
};
export default {
  components: {
    UserLinks,
    RoundAvatar,
    ChangeCoverButton,
    FavoritesButton,
    EditArtistButton,
  },
  props: {
    isUser: {
      type: Boolean,
      required: false,
      default: false,
    },
    isCreator: {
      type: Boolean,
      required: false,
      default: false,
    },
    isUserCard: {
      type: Boolean,
      required: false,
      default: false,
    },
    isCreatorCard: {
      type: Boolean,
      required: false,
      default: true,
    },
    isArtistPageViewedByArtistModerator: {
      type: Boolean,
      required: false,
      default: false,
    },
    user: {
      type: Object,
      default: () => {
        return {
          name: "",
          type: "",
        };
      },
    },
    entityType: {
      type: String,
      required: false, //TODO: remake to true
      default: "",
    },
    profileEditPage: {
      type: Boolean,
      required: false,
      default: false,
    },
    isSettingsArtistPage: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      favoritesButtonThemes,
      buttonsProfile,
      publicPath: process.env.BASE_URL,

      coverImage: null,
    };
  },
  computed: {
    ...mapGetters(storeModules.USER, [userGetters.HAS_ROLE]),
    isProfilePage() {
      return this.$route.name === RouteNames.PROFILE_PAGE;
    },
    isEditPage() {
      return this.$route.name === RouteNames.SETTINGS_CREATOR;
    },
    modalChoseRoleForm() {
      return {
        displayedComponent: ChoseRoleForm,
      };
    },
    obtainHeaderCoverBackground() {
      const coverURI = this.$props.user?.coverURI;
      return coverURI ? { backgroundImage: "url(" + coverURI + ")" } : "";
    },
    displayedUserRole() {
      if (this.user.roles.includes("CREATOR")) {
        return "Creator";
      } else if (this.user.roles.includes("ADMIN")) {
        return "Admin";
      } else {
        return "Fan";
      }
    },
    profileCategory() {
      let entityCategory;
      if (this.user.type) {
        entityCategory = this.user.type;
      } else {
        entityCategory = this.displayedUserRole;
      }
      return entityCategory;
    },
  },
  methods: {
    ...mapActions(storeModules.DATA, [dataActions.LOAD_CROSS_PAGE_PROPS]),
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    hasUserRole(role) {
      return this[userGetters.HAS_ROLE](role); //TODO: remake this
    },
    goToEdit() {
      this[dataActions.LOAD_CROSS_PAGE_PROPS](this.user);
      this.$router.push({ path: routerPaths.PROFILE_PAGE_EDIT });
    },
    showChoseRoleForm() {
      this[modalActions.SET_MODAL](this.modalChoseRoleForm);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    modalInformationRoleVerificationInProgressProps() {
      return {
        displayedComponent: InformationMessage,
        displayedComponentProps: {
          message: "You have already submitted a role application for verification. You will be able to submit a new application after the verification of the old application by the moderator",
        },
      };
    },
    showRoleVerificationInProgressModal() {
      this[modalActions.SET_MODAL](this.modalInformationRoleVerificationInProgressProps());
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    showChoseRoleFormOrNotification() {
      this.$load(async () => {
        const response = await this.$api.user.getUserRoleSubmitStatus();
        const resdata = response.data;
        const isUserRoleSubmitInProcess = resdata.data;

        if (isUserRoleSubmitInProcess) {
          this.showRoleVerificationInProgressModal();
        } else {
          this.showChoseRoleForm();
        }
      });
    },
    changeGetHeadersForImage() {
      this.$api.removeHeader("authorization");
    },
    restoreGetHeaders() {
      this.$api.autoConfigure();
    },
  },
};
</script>
<style scoped>
* {
  --text-stroke-width: 2px;
  --text-stroke-blur-width: 1px;
}
.profile-header {
  height: 190px;
  background: var(--gradient-card-dark);
  display: flex;
  margin-bottom: 90px;
  background-size: cover;
  background-position: center;
}

.profile-header.user-card {
  background: var(--gradient-purple);
  border-top-left-radius: var(--regular-border-radius);
  border-top-right-radius: var(--regular-border-radius);
  height: 100px;
  margin-bottom: 10px;
  position: relative;
}

.user-card .profile-user-image {
  border-width: 8px;
  top: 55px;
}

.profile-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-self: flex-end;
  margin-bottom: 25px;
  align-items: flex-end;
}

.profile-wrapper > .track-avatar {
  width: 202px;
  height: 202px;
}

.user-avatar {
  position: relative;
  top: 100px;
  margin: 0 3%;
  border: 15px solid #2a333a;
  width: 100%;
}
.user-card .profile-wrapper {
  margin-bottom: 0;
}

.user-card .profile-user-image {
  min-width: 50px;
  max-width: 85px;
}
.user-name-holder {
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  margin-right: 3%;
  /*width: 100%;*/

  /* text-stroke rules */
  z-index: 0;
}

.user-name-holder,
.user-type-holder {
  -webkit-text-fill-color: var(--color-dark) !important;
}

.profile-data {
  margin-right: auto;
  overflow: hidden;
  padding: 0 5px;
}
.profile-data > * {
  padding-left: 2px;
  padding-right: 2px;
  position: relative;
  z-index: 0;
}

.profile-data > *::before {
  content: attr(data-text-stroke);
  position: absolute;
  left: 0;
  color: var(--color-accent-primary);
  text-stroke: var(--text-stroke-width) var(--color-accent-primary);
  -webkit-text-stroke: var(--text-stroke-width) var(--color-accent-primary);
  z-index: -1;
  width: calc(100% - 2 * 2px);
  padding-left: 2px;
  padding-right: 2px;
}
.profile-data > .user-name-holder::before {
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-data > *:last-child {
  padding-bottom: 2px;
}

.profile-buttons {
  display: flex;
  gap: 25px;
  margin-right: 3%;
  white-space: nowrap;
  white-space: nowrap;
}

.profile-button {
  border-color: var(--color-dark);
  -webkit-text-fill-color: var(--color-dark);
}

.profile-button:hover {
  background: var(--color-dark);
  border-color: var(--color-dark);
  -webkit-text-fill-color: var(--color-accent-primary);
}

.like-button,
.follow-button {
  height: 40px;
  width: 160px;
}

.like-button {
  width: 60px;
}

.user-card .profile-buttons {
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

.change-cover {
  width: 210px;
  font-size: calc(var(--button-font-size) - 0.25rem);
}

.user-card-username-holder {
  padding-left: 125px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 20px;
}

.user-links-component:deep(.user-link a img) {
  /* -webkit-filter: sepia() saturate(10000%) hue-rotate(20deg);
  filter: sepia() saturate(10000%) hue-rotate(20deg); */
  filter: brightness(5%) drop-shadow(0 0 5px var(--color-accent-primary));
}
.user-links-component {
  position: absolute;
  bottom: 0;
  justify-content: end;
  right: 20px;
}
</style>
