<template>
  <div class="users-list-item" :class="{ chosen: initialUser.isChosen }">
    <div class="user-information-holder">
      <div class="round-avatar-holder">
        <RoundAvatar :avatar-src="user.pictureURI" />
      </div>
      <div class="username-holder">
        <span>{{ initialUser.name }}</span>
      </div>
    </div>
    <div class="toggle-switch-wrapper">
      <ToggleSwitch :initial-is-switched-on="initialUser.moderator" label="Moderator" @toggle-switch-event="toggleSwitchEventHandler" />
    </div>
    <div class="add-user-button-holder" @click="addUserHandler(index)">
      <svg v-if="!user.isChosen" width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20 37C11.18 37 3.5 31.3028 3 20C3 11.18 9.46434 3 20 3C31.3027 3.5 37 12.18 37 21C37 29.82 28.82 37 20 37ZM20 0C17.3736 0 14.7728 0.517315 12.3463 1.52241C9.91982 2.5275 7.71504 4.00069 5.85786 5.85786C2.10714 9.60859 0 14.6957 0 20C0 25.3043 2.10714 30.3914 5.85786 34.1421C7.71504 35.9993 9.91982 37.4725 12.3463 38.4776C14.7728 39.4827 17.3736 40 20 40C25.3043 40 30.3914 37.8929 34.1421 34.1421C37.8929 30.3914 40 25.3043 40 20C40 17.3736 39.4827 14.7728 38.4776 12.3463C37.4725 9.91982 35.9993 7.71504 34.1421 5.85786C32.285 4.00069 30.0802 2.5275 27.6537 1.52241C25.2272 0.517315 22.6264 0 20 0ZM22 11C22 10.4477 21.5523 10 21 10H19C18.4477 10 18 10.4477 18 11V17C18 17.5523 17.5523 18 17 18H11C10.4477 18 10 18.4477 10 19V21C10 21.5523 10.4477 22 11 22H17C17.5523 22 18 22.4477 18 23V29C18 29.5523 18.4477 30 19 30H21C21.5523 30 22 29.5523 22 29V23C22 22.4477 22.4477 22 23 22H29C29.5523 22 30 21.5523 30 21V19C30 18.4477 29.5523 18 29 18H23C22.4477 18 22 17.5523 22 17V11Z"
        />
      </svg>
      <svg v-else width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 27.75C8.385 27.75 2.625 23.4771 2.25 15C2.25 8.385 7.09826 2.25 15 2.25C23.477 2.625 27.75 9.135 27.75 15.75C27.75 22.365 21.615 27.75 15 27.75ZM15 0C13.0302 0 11.0796 0.387987 9.25975 1.14181C7.43986 1.89563 5.78628 3.00052 4.3934 4.3934C1.58035 7.20644 0 11.0218 0 15C0 18.9782 1.58035 22.7936 4.3934 25.6066C5.78628 26.9995 7.43986 28.1044 9.25975 28.8582C11.0796 29.612 13.0302 30 15 30C18.9782 30 22.7936 28.4196 25.6066 25.6066C28.4196 22.7936 30 18.9782 30 15C30 13.0302 29.612 11.0796 28.8582 9.25975C28.1044 7.43986 26.9995 5.78628 25.6066 4.3934C24.2137 3.00052 22.5601 1.89563 20.7403 1.14181C18.9204 0.387987 16.9698 0 15 0ZM16 13.5H13.5H8.5C7.94772 13.5 7.5 13.9477 7.5 14.5V15.5C7.5 16.0523 7.94772 16.5 8.5 16.5H13.5H14H15H15.5H16.5H21.5C22.0523 16.5 22.5 16.0523 22.5 15.5V14.5C22.5 13.9477 22.0523 13.5 21.5 13.5H16.5H16Z" fill="#DE3838" />
      </svg>
    </div>
  </div>
</template>

<script>
import RoundAvatar from "@/components/common/user/RoundAvatar.vue";
import ToggleSwitch from "@/components/common/navigation/buttons/ToggleSwitch.vue";

export default {
  name: "UsersListItem",
  components: {
    RoundAvatar,
    ToggleSwitch,
  },
  props: {
    initialUser: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ["change-user-event"],
  data() {
    return {
      user: {},
    };
  },
  watch: {
    user: {
      handler(newUser) {
        this.$emit("change-user-event", newUser, this.$props.index);
      },
      deep: true,
    },
  },
  mounted() {
    this.user = JSON.parse(JSON.stringify(this.$props.initialUser));
  },
  methods: {
    addUserHandler() {
      this.user.isChosen = !this.user.isChosen;
      if (!this.user.isChosen) {
        this.user.moderator = false;
      }
    },
    toggleSwitchEventHandler(event) {
      if (event) {
        this.user.moderator = true;
        if (!this.user.isChosen) {
          this.user.isChosen = true;
        }
      } else {
        this.user.moderator = false;
      }
    },
  },
};
</script>

<style scoped>
.users-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.users-list-item:not(:last-child) {
  margin-bottom: 20px;
}

.chosen .username-holder span {
  color: var(--color-accent-primary);
}
.user-information-holder {
  display: flex;
  /* justify-content: center; */
  overflow-x: hidden;
  align-items: center;
  user-select: none;
  margin-right: auto;
}
.round-avatar-holder {
  width: 40px;
  height: 40px;
  margin-right: 25px;
}
.username-holder {
  overflow-x: auto;
}
.username-holder span {
  font-size: var(--medium-font-size-2);
  font-weight: var(--large-font-weight);
  color: var(--color-gray);
  /* overflow-x: scroll; */
}
.toggle-switch-wrapper {
  margin-right: 0.9375rem;
}
.users-list-item.chosen .add-user-button-holder svg path {
  fill: var(--color-error);
}
.add-user-button-holder {
  cursor: pointer;
  display: flex;
}
.add-user-button-holder svg path {
  fill: #var(--color-gray);
}
.chosen .add-user-button-holder svg path {
  fill: var(--color-accent-primary);
}
.add-user-button-holder:hover svg path {
  fill: var(--color-accent-primary);
}

.add-user-button-holder:active svg path {
  opacity: 50%;
}
</style>
