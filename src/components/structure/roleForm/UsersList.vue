<template>
  <div class="users-selector-holder">
    <div class="users-holder">
      <div v-for="(user, index) in usersList" :key="index" class="users-item" :class="{ chosen: user.isChosen }">
        <div class="user-information-holder">
          <div class="round-avatar-holder">
            <RoundAvatar :avatar-src="user.pictureURI" />
          </div>
          <div class="username-holder">
            <span>{{ user.name }}</span>
          </div>
        </div>

        <RolesSelector :selector-id="getSelectorId(index)" :roles="moderatorRolesList" class="roles-selector-wrapper" @checked-list-updated="moderatorCheckedListUpdatedHandler($event, index)" />

        <div class="add-user-button-holder" @click="addUserHandler(index)">
          <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 37C11.18 37 3.5 31.3028 3 20C3 11.18 9.46434 3 20 3C31.3027 3.5 37 12.18 37 21C37 29.82 28.82 37 20 37ZM20 0C17.3736 0 14.7728 0.517315 12.3463 1.52241C9.91982 2.5275 7.71504 4.00069 5.85786 5.85786C2.10714 9.60859 0 14.6957 0 20C0 25.3043 2.10714 30.3914 5.85786 34.1421C7.71504 35.9993 9.91982 37.4725 12.3463 38.4776C14.7728 39.4827 17.3736 40 20 40C25.3043 40 30.3914 37.8929 34.1421 34.1421C37.8929 30.3914 40 25.3043 40 20C40 17.3736 39.4827 14.7728 38.4776 12.3463C37.4725 9.91982 35.9993 7.71504 34.1421 5.85786C32.285 4.00069 30.0802 2.5275 27.6537 1.52241C25.2272 0.517315 22.6264 0 20 0ZM22 11C22 10.4477 21.5523 10 21 10H19C18.4477 10 18 10.4477 18 11V17C18 17.5523 17.5523 18 17 18H11C10.4477 18 10 18.4477 10 19V21C10 21.5523 10.4477 22 11 22H17C17.5523 22 18 22.4477 18 23V29C18 29.5523 18.4477 30 19 30H21C21.5523 30 22 29.5523 22 29V23C22 22.4477 22.4477 22 23 22H29C29.5523 22 30 21.5523 30 21V19C30 18.4477 29.5523 18 29 18H23C22.4477 18 22 17.5523 22 17V11Z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import FindUserModal from "./FindUserModal.vue";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import AddUserModal from "@/components/structure/roleForm/AddUserModal.vue";
import RoundAvatar from "@/components/common/user/RoundAvatar.vue";
import RolesSelector from "@/components/structure/roleForm/RolesSelector.vue";
export default {
  name: "UsersList",
  components: {
    RoundAvatar,
    RolesSelector,
  },
  props: {
    users: {
      type: Object,
      required: true,
    },
  },
  emits: ["chosen-members"],
  data() {
    return {
      moderatorRolesList: ["Moderator"],
      usersList: [],
    };
  },
  computed: {
    findUserModalProps() {
      return {
        displayedComponent: FindUserModal,
      };
    },
  },
  watch: {
    users: {
      handler(newUsers) {
        this.usersList = newUsers;
      },
      deep: true,
    },
    usersList: {
      handler(newUsersList) {
        const chosenUsers = newUsersList.filter((item) => {
          return item.isChosen === true;
        });
        this.$emit("chosen-members", chosenUsers);
      },
      deep: true,
    },
  },
  methods: {
    addUserModalProps(user) {
      return {
        displayedComponent: AddUserModal,
        displayedComponentProps: {
          user: user,
          previousModalProps: this.findUserModalProps,
        },
      };
    },
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    addUserHandler(index) {
      this.usersList[index].isChosen = !this.usersList[index].isChosen;
    },
    openAddUserModal(user) {
      this[modalActions.SET_MODAL](this.addUserModalProps(user));
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    getSelectorId(index) {
      return "findUserModal-" + index;
    },
    moderatorCheckedListUpdatedHandler(event, index) {
      if (Array.isArray(event) && event.length) {
        this.usersList[index].isModerator = true;
      } else {
        this.usersList[index].isModerator = false;
      }
      if (Array.isArray(event) && event.length && !this.usersList[index].isChosen) {
        this.usersList[index].isChosen = true;
      }
    },
  },
};
</script>

<style scoped>
.users-selector-holder {
  margin-bottom: 10px;
}

.users-holder {
  padding-top: 5px;
  padding-right: var(--large-padding);
  max-height: 325px;
  overflow: auto;
}

.users-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chosen .username-holder span {
  color: var(--color-accent-primary);
}

.user-information-holder {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  margin-right: auto;
}

.round-avatar-holder {
  width: 40px;
  height: 40px;
  margin-right: 25px;
}
.roles-selector-wrapper {
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.username-holder span {
  font-size: var(--medium-font-size-2);
  font-weight: var(--large-font-weight);
  color: var(--color-gray);
}
.add-user-button-holder {
  cursor: pointer;
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
