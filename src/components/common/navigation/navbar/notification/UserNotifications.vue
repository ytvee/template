<template>
  <div class="user-notifications" :class="{ viewing: isDropdownShown }" @click.stop="toggleNotifications()">
    <svg :class="{ 'animation-bell-notification': isAnimationBell }" width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.99099 5.41927e-05C9.76836 0.00210036 9.556 0.0897124 9.40096 0.24299C9.24615 0.396269 9.16148 0.602557 9.16613 0.816093V1.93201C4.95549 2.33362 1.66469 5.7373 1.66469 9.87639V15.8055L0.101802 18.5453V18.5455C-0.0388665 18.7929 -0.0334448 19.0929 0.11614 19.3355C0.265723 19.5781 0.537378 19.7273 0.831116 19.728H6.38812V20.7272C6.38812 22.5593 8.04555 24 10 24C11.9545 24 13.6119 22.5593 13.6119 20.7272V19.728H19.1689C19.4626 19.7273 19.7343 19.5781 19.8839 19.3355C20.0334 19.0929 20.0389 18.7929 19.8982 18.5455L18.3353 15.8057V9.87658C18.3353 5.73739 15.0443 2.33363 10.8339 1.9322V0.816088C10.8385 0.599752 10.7515 0.390859 10.5928 0.237034C10.4341 0.0831984 10.2173 -0.00236457 9.9916 4.97421e-05L9.99099 5.41927e-05ZM9.99971 3.48929C13.7091 3.48929 16.6678 6.32694 16.6678 9.87651V16.0056V16.0054C16.6686 16.1396 16.7044 16.2713 16.7721 16.3886L17.7618 18.1292H2.23759L3.22732 16.3886H3.22751C3.29513 16.2713 3.33098 16.1396 3.33175 16.0054V9.87632C3.33175 6.3268 6.29066 3.4891 9.99986 3.4891L9.99971 3.48929ZM8.05473 19.7281H11.9445V20.7273C11.9445 21.6349 11.1247 22.4012 9.99951 22.4012C8.87452 22.4012 8.05473 21.635 8.05453 20.7273V19.7281H8.05473Z"
        fill="#D9D9D9"
      />
    </svg>
    <div v-show="hasNotifications" class="icon-badge">
      <p class="number-of-notifications" :title="getNotificationsCount" />
    </div>
    <div class="notifications-holder">
      <transition name="fade">
        <div v-if="isDropdownShown" class="notifications" @click.stop>
          <div v-for="notification in notifications" :key="notification.id" class="user-notification">
            <Notification :notification="notification">
              <template #title-text>
                <!-- eslint-disable-next-line -->
                <span v-html="notification.message"></span>
              </template>
              <template #accept-button-text> Accept </template>
              <template #decline-button-text> Decline </template>
            </Notification>
          </div>
          <div v-if="!hasNotifications" class="no-notifications">
            <h4>No new notifications.</h4>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import notificationsGetters from "@/data/store/notifications/notificationsGetters.json";
import notificationsMutations from "@/data/store/notifications/notificationsMutations.json";
import Notification from "./Notification.vue";

export default {
  components: {
    Notification,
  },
  data() {
    return {
      isDropdownShown: false,
      isAnimationBell: false,
      notificationBell: {
        enable: () => {
          this.isAnimationBell = true;
        },
        disable: () => {
          setTimeout(() => {
            this.isAnimationBell = false;
          }, 500);
        },
      },
    };
  },
  computed: {
    ...mapGetters(storeModules.NOTIFICATIONS, [notificationsGetters.GET_NOTIFICATIONS_COUNT]),
    ...mapState(storeModules.NOTIFICATIONS, {
      notifications: (state) => state.notifications,
    }),
    ...mapState(storeModules.USER, {
      currentUser: (state) => state.currentUser,
    }),
    hasNotifications() {
      return this[notificationsGetters.GET_NOTIFICATIONS_COUNT] > 0;
    },
  },
  watch: {
    getNotificationsCount(newQuantityNotification, oldQuantityNotification) {
      if (newQuantityNotification > oldQuantityNotification) {
        this.notificationBell.enable();
        this.notificationBell.disable();
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.closeNotifications);
  },
  unmounted() {
    document.removeEventListener("click", this.closeNotifications);
  },
  methods: {
    ...mapActions(storeModules.NOTIFICATIONS, [notificationsMutations.DELETE_NOTIFICATION]),
    toggleNotifications() {
      this.isDropdownShown = !this.isDropdownShown;
    },
    closeNotifications() {
      if (this.isDropdownShown) {
        this.isDropdownShown = false;
      }
    },
    animationBellTrue() {
      this.isAnimationBell = true;
    },
    animationBellFalse() {
      this.isAnimationBell = false;
    },
  },
};
</script>
<style scoped>
.no-notifications {
  width: 352px;
  height: 128px;
  padding: 21px 15px;
  background: var(--color-dark);
  border-radius: 0 0 5px 5px;
  box-shadow: -5px 4px 5px var(--transparent-accent-08);
  overflow-x: hidden;
  /* color: var(--color-gray); */
  display: flex;
  justify-content: center;
  align-items: center;
}
.user-notifications {
  margin: 0 50px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.notifications {
  box-shadow: var(--shadow-accent);
  border-radius: 0px 0px 5px 5px;
  background: transparent;
  box-shadow: var(--shadow-accent);
  overflow: auto;
  max-height: 50vh;
  width: max-content;
  backdrop-filter: blur(5px);
  overflow-x: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: max-height 0.7s;
  overflow-y: hidden;
}

.fade-enter-from,
.fade-leave-to {
  max-height: 0;
  overflow-y: hidden;
}
.animation-bell-notification {
  animation: animationBell 1 0.4s ease-in;
}

@keyframes animationBell {
  0% {
    transform: rotate(5deg);
  }

  5% {
    transform: rotate(10deg);
  }

  10% {
    transform: rotate(20deg);
  }

  15% {
    transform: rotate(30deg);
  }

  20% {
    transform: rotate(40deg);
  }

  25% {
    transform: rotate(50deg);
  }

  30% {
    transform: rotate(40deg);
  }

  35% {
    transform: rotate(30deg);
  }

  40% {
    transform: rotate(20deg);
  }

  45% {
    transform: rotate(10deg);
  }

  50% {
    transform: rotate(0);
  }

  55% {
    transform: rotate(-5deg);
  }

  60% {
    transform: rotate(-10deg);
  }

  65% {
    transform: rotate(-20deg);
  }

  70% {
    transform: rotate(-30deg);
  }

  75% {
    transform: rotate(-40deg);
  }

  80% {
    transform: rotate(-50deg);
  }

  85% {
    transform: rotate(-40deg);
  }

  90% {
    transform: rotate(-30deg);
  }

  95% {
    transform: rotate(-20deg);
  }

  100% {
    transform: rotate(-10deg);
  }
}

.icon-badge {
  position: absolute;
  top: -1px;
  left: 12px;
  right: 0;
  bottom: 0;
  border: solid 1px rgb(217, 217, 217);
  border-radius: 100%;
  width: 11px;
  height: 11px;
  background: red;
}

.number-of-notifications {
  color: rgb(217, 217, 217);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 9px;
  font-size: 4.5px;
}

.user-notifications.viewing path {
  fill: var(--color-accent-primary);
}

.notifications-holder {
  max-width: 300px;
  max-height: 0;
  width: max-content;
  position: absolute;
  background: transparent;
  padding-top: calc(var(--navbar-height) / 2);
  top: 50%;
  right: 0;
}

.user-notification {
  color: var(--color-light);
}

.user-notification:last-child .information-message-holder {
  margin-bottom: 0 !important;
}
</style>
