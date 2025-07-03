<template>
  <div ref="holder" class="information-message-holder" :class="{ 'information-message-holder-animation': isActiveAnimation }">
    <div class="message-title-holder">
      <span class="message-icon-wrapper">
        <svg class="message-icon" :class="`message-icon__${notification.type}`" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g v-if="notification.type === typesOfNotification.FAILURE" class="cross-icon">
            <line x1="1.5" y1="-1.5" x2="23.9554" y2="-1.5" transform="matrix(0.707094 0.707119 -0.707094 0.707119 5 7)" stroke-width="3" stroke-linecap="round" />
            <line x1="1.5" y1="-1.5" x2="23.9554" y2="-1.5" transform="matrix(0.707094 -0.707119 0.707094 0.707119 7 25)" stroke-width="3" stroke-linecap="round" />
          </g>
          <path v-else class="check-icon" d="M24.1399 10.5624L24.2859 10.4195L24.1399 10.2765L22.6896 8.85707L22.5498 8.72021L22.4099 8.857L11.657 19.3714L7.59001 15.4005L7.45011 15.2639L7.31039 15.4007L5.86011 16.8202L5.71407 16.9631L5.86011 17.106L11.5172 22.6429L11.6571 22.7799L11.797 22.6429L24.1399 10.5624Z" stroke-width="0.4" />
        </svg>
      </span>
      <h4 class="message-title">
        <slot name="title-text" />
      </h4>
    </div>
    <div v-if="notification.type === typesOfNotification.FAILURE || notification.type === typesOfNotification.SUCCESS" class="button-close-notification" @click="dispatchAction(notificationActions.DISMISS)">
      <button>Dismiss</button>
    </div>
    <div v-if="notification.type === typesOfNotification.REQUEST" class="message-buttons-holder">
      <button class="accept-button medium" @click="dispatchAction(notificationActions.ACCEPT)">
        <span class="button-text-wrapper">
          <slot name="accept-button-text" />
        </span>
      </button>
      <button class="decline-button medium">
        <span class="button-text-wrapper" @click="dispatchAction(notificationActions.DECLINE)">
          <slot name="decline-button-text" />
        </span>
      </button>
    </div>
    <div v-else class="message-description-holder">
      <div class="message-description">
        <slot name="description-text" />
      </div>
    </div>
  </div>
</template>

<script>
import typesOfNotification from "@/data/store/notifications/typesOfNotification.json";
import storeModules from "@/data/store/storeModules.json";
import notificationsActions from "@/data/store/notifications/notificationsActions.json";
import { mapActions } from "vuex";

const notificationActions = {
  DECLINE: "decline",
  ACCEPT: "accept",
  DISMISS: "dismiss",
};

const notificationAnswers = {
  DECLINE: "decline",
  ACCEPT: "confirm",
};

export default {
  name: "UserNotification",
  props: {
    notification: {
      type: Object,
      required: true,
    },
    isAnimationBell: {
      type: Boolean,
    },
  },
  data() {
    return {
      typesOfNotification: typesOfNotification,
      isActiveAnimation: false,
      notificationActions,
      notificationAnswers,
    };
  },
  methods: {
    ...mapActions(storeModules.NOTIFICATIONS, [notificationsActions.DELETE_NOTIFICATION]),
    dispatchAction(action) {
      this.$load(async () => {
        let response;
        switch (action) {
          case this.notificationActions.ACCEPT:
            response = await this.acceptRequest();
            break;
          case this.notificationActions.DECLINE:
            response = await this.declineRequest();
            break;
          case this.notificationActions.DISMISS:
            response = await this.dismiss();
            break;
        }
        this.closeNotification();
      }, this.notificationsErrorHandler);
    },
    async dismiss() {
      return await this.$api.user.dismissNotification(this.notification.id);
    },
    async acceptRequest() {
      return await this.$api.user.resolveNotification(this.notification.id, this.notificationAnswers.ACCEPT);
    },
    async declineRequest() {
      return await this.$api.user.resolveNotification(this.notification.id, this.notificationAnswers.DECLINE);
    },
    closeNotification() {
      this.isActiveAnimation = true;
      setTimeout(() => {
        this[notificationsActions.DELETE_NOTIFICATION](this.notification.id);
      }, 300);
    },
    notificationsErrorHandler(error) {
      console.error(error);
      return;
    },
  },
};
</script>

<style scoped>
.information-message-holder {
  width: 352px;
  padding: 21px 15px;
  background: var(--color-dark);
  border-radius: 0 0 5px 5px;
  box-shadow: -5px 4px 5px var(--transparent-accent-08);
  margin-bottom: 15px;
  overflow-x: hidden;
}

.message-title-holder {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 11px;
}

.information-message-holder-animation {
  transform: translate(350px);
  transition: var(--default-transition);
  background: none;
}

.message-icon {
  height: 30px;
  width: 30px;
  border-radius: 100px;
  background: var(--gradient-card-dark);
}

.message-icon__failure {
  background: var(--color-error);
}

.message-icon .cross-icon line {
  stroke: var(--color-dark);
}

.message-icon .check-icon {
  stroke: var(--color-dark);
  fill: var(--color-dark);
}

.message-title {
  line-height: 1.2;
  color: var(--color-gray);
  overflow-wrap: break-word;
  overflow: hidden;
}

.message-buttons-holder {
  display: flex;
  gap: var(--large-block-gap);
}

.message-buttons-holder button {
  padding: var(--button-padding-small);
  font-size: var(--medium-font-size-2);
  min-width: 0;
}

.message-buttons-holder button:hover {
  flex-shrink: 0;
}

/* TODO: SHOULD BE IN THE THEME PROVIDER */
.decline-button {
  background: none;
  border-color: var(--color-error);
  color: var(--color-error);
  outline-color: var(--color-error);
  background-clip: unset !important;
  -webkit-text-fill-color: unset !important;
}

.button-text-wrapper {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-description-holder {
  margin-bottom: 6px;
}

.message-description {
  color: var(--color-gray);
  font-size: var(--regular-font-size);
  line-height: 1.2;
  font-weight: var(--small-font-weight);
  overflow-wrap: break-word;
  overflow: hidden;
}
</style>
