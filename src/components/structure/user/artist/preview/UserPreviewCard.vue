<template>
  <div class="user-preview-card" :class="{ 'un-confirmed-user': isUnConfirmedUser }">
    <div class="image-container">
      <EntityImage :artist="user" />
      <div class="roles-holder">
        <div v-for="tag in user?.tags?.confirmed" :key="tag" class="role-holder">
          {{ tag }}
        </div>
      </div>
    </div>
    <div class="card-preview-information-holder">
      <div class="card-title-holder">
        <div class="card-title">
          {{ user.name }}
        </div>
        <div class="check-mark-holder">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7.5" cy="7.5" r="7.5" fill="url(#paint0_linear_1068_5044)" />
            <path d="M12.1399 5.35266L12.2859 5.20973L12.1399 5.0668L11.4148 4.35707L11.2749 4.22021L11.135 4.357L5.82847 9.54588L3.86486 7.62871L3.72497 7.49213L3.58525 7.62888L2.86011 8.33861L2.71407 8.48154L2.86011 8.62448L5.68868 11.3929L5.82857 11.5299L5.96847 11.3929L12.1399 5.35266Z" fill="#1D2227" stroke="#1D2227" stroke-width="0.4" />
            <defs>
              <linearGradient id="paint0_linear_1068_5044" x1="-1.39286" y1="-0.500001" x2="16.9725" y2="2.6587" gradientUnits="userSpaceOnUse">
                <stop stop-color="#74DE6F" />
                <stop offset="0.859375" stop-color="#CDE768" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div class="toggle-switch-wrapper">
        <ToggleSwitch :initial-is-switched-on="user.moderator" :is-locked="Boolean(isCurrentUser || isUnConfirmedUser)" label="Moderator" variant="Line" @toggle-switch-event="toggleSwitchEventHandler" />
      </div>
      <div v-if="isUnConfirmedUser" class="unconfirmed-user-label">not approved</div>
    </div>
    <div v-if="isCurrentUser" class="current-user-label">This is you</div>
    <div v-else-if="!isUnConfirmedUser" class="remove-cross-wrapper">
      <SmallCloseCross @click="removeUserHandler" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import MemberModal from "@/components/structure/modals/artist/MemberModal.vue";

import EntityImage from "@/components/common/entity/EntityImage.vue";
import ToggleSwitch from "@/components/common/navigation/buttons/ToggleSwitch.vue";
import SmallCloseCross from "@/components/common/navigation/buttons/SmallCloseCross.vue";

export default {
  name: "UserPreviewCard",
  components: {
    EntityImage,
    ToggleSwitch,
    SmallCloseCross,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    isCurrentUser: {
      type: Boolean,
      required: false,
      default: false,
    },
    isUnConfirmedUser: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["change-moderator-event", "remove-user-event"],
  data() {
    return {
      islikeClicked: false,
      THEME_LIKE_BUTTON: {
        DARK: "dark",
        LIGHT: "light",
      },
    };
  },
  computed: {
    modalMemberProps() {
      return {
        displayedComponent: MemberModal,
        displayedComponentProps: this.user,
      };
    },
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    toggleSwitchEventHandler(toggleValue) {
      this.$emit("change-moderator-event", toggleValue);
    },
    removeUserHandler() {
      this.$emit("remove-user-event");
    },
  },
};
</script>

<style scoped>
.user-preview-card {
  position: relative;
  width: 240px;
  height: 280px;
  border-radius: var(--preview-card-for-creater-border-radius);
  background: var(--gradient-card-dark);
  display: flex;
  flex-direction: column;
  padding: 5px;
  cursor: pointer;
}

.user-preview-card:hover {
  box-shadow: 0 0 7px var(--color-gray-light);
  transition: var(--default-transition);
}
.un-confirmed-user {
  opacity: 0.6;
}
.card-preview-information-holder {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
}
.user-preview-card:hover .card-title-holder * {
  color: var(--color-gray-light);
  transition: var(--default-transition);
}

.image-container {
  position: relative;
  width: 100%;
  height: 180px;
  user-select: none;
  border-radius: var(--preview-card-for-creater-border-radius);
  overflow: hidden;

  background: var(--color-gray);

  margin-bottom: 0.625rem;
}

.roles-holder {
  padding: 0.625rem;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0.5rem;
}

.role-holder {
  background: var(--gradient-purple);
  border: 1px solid #000000;
  box-shadow: 2px 2px 9px var(--transparent-accent-20);
  border-radius: var(--small-border-radius);
  padding: 0 1.25rem;

  color: var(--color-dark);
  font-size: var(--medium-font-size-2);
  font-weight: var(--large-font-weight);
}

.card-title-holder {
  display: flex;
  gap: var(--regular-block-gap);
  align-items: center;
  margin-bottom: 5px;
  overflow: auto;
}
.check-mark-holder {
  flex-shrink: 0;
}

.card-title {
  font-size: var(--large-font-size);
  font-weight: var(--large-font-weight);
  color: var(--color-light);
}

.card-title a {
  text-decoration: none;
  color: var(--color-light);
  font-size: var(--large-font-size);
  font-weight: var(--large-font-weight);
}
.toggle-switch-wrapper {
  flex-grow: 1;
}
.remove-cross-wrapper {
  position: absolute;
  top: 0.9375rem;
  right: 0.9375rem;
}
.current-user-label {
  position: absolute;
  top: 0.9375rem;
  right: 0.9375rem;
  color: var(--color-gray);
}
.unconfirmed-user-label {
  color: var(--color-error);
  font-weight: var(--medium-font-weight);
}
</style>
