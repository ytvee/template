<template>
  <div class="add-user-form-holder">
    <div class="content-holder">
      <div class="title-holder">
        <h2>Add user</h2>
        <CloseModalButton />
      </div>
      <div class="input-username-holder">
        <label for="username-input">Username</label>
        <input id="username-input" v-model="modalProps.user.name" type="text" placeholder="Enter username" readonly />
      </div>
      <h4>Choose user’s role</h4>
      <div class="role-selector-wrapper">
        <RolesSelector selector-id="AddUserSelector" :roles="rolesList" @checked-list-updated="checkedListUpdatedHandler" />
      </div>
      <div class="separator">
        <svg width="392" height="1" viewBox="0 0 392 1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="391.5" y2="0.5" stroke="url(#paint0_linear_1585_8267)" stroke-linecap="round" />
          <defs>
            <linearGradient id="paint0_linear_1585_8267" x1="-36.4" y1="0.966667" x2="-36.2913" y2="8.29429" gradientUnits="userSpaceOnUse">
              <stop stop-color="#74DE6F" />
              <stop offset="0.859375" stop-color="#CDE768" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="role-selector-wrapper">
        <RolesSelector selector-id="AddUserSelector" :roles="moderatorRolesList" @checked-list-updated="moderatorCheckedListUpdatedHandler" />
      </div>
      <div class="buttons-holder">
        <button class="large outlined" @click="goToPrevious">Back</button>
        <button class="large" :class="{ disabled: !isFormValid }" @click="addButtonHandler">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";
import RolesSelector from "./RolesSelector.vue";
import rolesList from "@/data/user/role/rolesList.json";
export default {
  name: "AddUserModal",
  components: {
    CloseModalButton,
    RolesSelector,
  },
  data() {
    return {
      userName: "",
      checkedList: [],
      moderatorCheckedList: [],
      rolesList: [],
      moderatorRolesList: [rolesList.MODERATOR],
    };
  },
  computed: {
    ...mapState(storeModules.MODAL, {
      modalProps: (state) => state.modal.displayedComponentProps,
    }),
    isFormValid() {
      return this.isUserNameValid() && (this.isRolesCheckListNotEmpty() || this.isModeratorRolesCheckListNotEmpty());
    },
  },
  mounted() {
    this.getAvaliableRolesFromApi();
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    checkedListUpdatedHandler(checkedList) {
      this.checkedList = checkedList;
    },
    moderatorCheckedListUpdatedHandler(moderatorCheckedList) {
      this.moderatorCheckedList = moderatorCheckedList;
    },

    isRolesCheckListNotEmpty() {
      return this.checkedList.length;
    },
    isModeratorRolesCheckListNotEmpty() {
      return this.moderatorCheckedList.length;
    },
    isUserNameValid() {
      return this.userName !== "";
    },
    goToPrevious() {
      if (this.modalProps.previousModalProps) {
        this.openPreviousModal();
      } else {
        this[modalActions.SET_MODAL_VISIBILITY](false);
      }
    },
    openPreviousModal() {
      this[modalActions.SET_MODAL](this.modalProps.previousModalProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    addButtonHandler() {
      //TODO: call api to send data about invited creator
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },

    sendDataToServerByApi() {
      const payload = {
        tags: [...this.checkedList],
        links: [...this.socialLinksList],
      };
      this.$load(async () => {
        const response = await this.$api.auth.finalSignUpSteps(payload);
      });
    },
    getAvaliableRolesFromApi() {
      this.$load(async () => {
        const response = await this.$api.auth.getAvaliableTags();
        const { data: resdata } = response;
        this.rolesList = resdata.data;
      });
    },
  },
};
</script>

<style scoped>
h4 {
  margin-bottom: 0.9375rem;
}

.add-user-form-holder {
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

.close-button {
  cursor: pointer;
}

.close-button:hover svg path {
  opacity: 50%;
}

.close-button:active svg path {
  opacity: 30%;
}

.input-username-holder {
  margin-bottom: 20px;
}

.input-username-holder label {
  display: block;
  margin-left: 5px;
  margin-bottom: 10px;
  color: var(--color-gray);
  font-weight: var(--large-font-weight);
}

.input-username-holder input {
  font-size: var(--h4-font-size);
  font-weight: var(--h4-font-weight);
}

.role-selector-wrapper {
  margin-bottom: 25px;
}

.separator {
  display: flex;
  align-items: flex-start;
  margin-bottom: 25px;
}

.moderator-checkbox-holder {
  margin-bottom: 25px;
}

.input[type="checkbox"]:checked + label {
  color: var(--color-accent-primary);
}

.buttons-holder {
  display: flex;
  justify-content: space-between;
}

button {
  width: 160px !important;
}
</style>
