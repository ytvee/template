<template>
  <div class="find-user-holder">
    <div class="content-holder">
      <div class="title-holder">
        <h2>Find user</h2>
        <CloseModalButton />
      </div>
      <input type="text" class="search" placeholder="Enter name, band or other" />
      <div class="users-list-wrapper">
        <UsersList :users="findUsersList" @chosen-members="chosenMembersHandler" />
      </div>
      <div class="button-holder">
        <button class="large" :disabled="!isAddButtonEnabled" @click="addButtonHandler">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";
import UsersList from "@/components/structure/roleForm/FindAndAddUserModal/UsersList";
export default {
  name: "FindUserModal",
  components: {
    CloseModalButton,
    UsersList,
  },
  data() {
    return {
      findUsersList: [],
      chosenMembers: [],
    };
  },
  computed: {
    ...mapState(storeModules.MODAL, {
      modalProps: (state) => state.modal.displayedComponentProps,
    }),
    isAddButtonEnabled() {
      return this.chosenMembers.length;
    },
  },
  mounted() {
    this.loadCreativeUsersListByApi();
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY]),
    initialiseFindUserListWithAddedMembersInEditedArtist() {
      this.modalProps.addedMembers?.forEach((addedMembersItem) => {
        const addedMembersItemIndexInFindUserList = this.findUsersList.findIndex((findUserListItem) => {
          return findUserListItem.id === addedMembersItem.id;
        });
        if (addedMembersItemIndexInFindUserList !== -1) {
          this.findUsersList[addedMembersItemIndexInFindUserList].isChosen = true;
          this.findUsersList[addedMembersItemIndexInFindUserList].moderator = addedMembersItem.moderator;
        }
      });
    },
    loadCreativeUsersListByApi() {
      this.$load(async () => {
        const response = await this.$api.user.getCreativeUsersList(this.modalProps.artistId);
        const { data: resdata } = response;
        this.findUsersList = resdata.data;
        this.initialiseFindUserListWithAddedMembersInEditedArtist();
      });
    },
    chosenMembersHandler(members) {
      this.chosenMembers = members;
    },
    addButtonHandler() {
      this.$eventBus.emit("change-members-event", this.chosenMembers);
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
  },
};
</script>

<style scoped>
.title-holder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.title-holder h2,
h4 {
  color: var(--color-gray);
}
.find-user-holder {
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-dark);
  width: 500px;
  border-radius: var(--medium-border-radius);
}

.content-holder {
  width: 100%;
}
.content-holder input {
  font-size: var(--h4-font-size);
  font-weight: var(--h4-font-weight);
}
.title-holder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.close-button {
  cursor: pointer;
}

.close-button:hover svg path {
  opacity: 50%;
}

.close-button:active svg path {
  opacity: 30%;
}

input {
  margin-bottom: 30px;
  user-select: none;
}

.button-holder {
  display: flex;
  justify-content: flex-end;
}

button {
  width: 160px !important;
}
.users-list-wrapper {
  margin-bottom: 1.875rem;
}
</style>
