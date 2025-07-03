<template>
  <div class="add-roles-modal">
    <div class="title-holder">
      <h2>Add roles</h2>
      <CloseModalButton />
    </div>
    <div class="content-holder">
      <h4>Choose user's roles</h4>
      <div class="role-selector-wrapper">
        <LoadingCircle v-if="isAvaliableTagsLoading" />
        <RolesSelector v-else selector-id="ChoseRoleFormSelector" :roles="rolesList" @checked-list-updated="checkedListUpdatedHandler" />
      </div>
    </div>
    <div class="buttons-holder">
      <button class="large" :class="{ disabled: !isFormValid }" @click="chooseButtonHandler">Add</button>
    </div>
  </div>
</template>

<script>
const CASES = {
  FINAL_SIGN_UP_STEPS: "finalSignUpSteps",
};
import { mapState, mapActions, mapGetters } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import userActions from "@/data/store/user/userActions.json";
import userGetters from "@/data/store/user/userGetters.json";
import storeModules from "@/data/store/storeModules.json";

import InformationMessage from "@/components/common/info/informationMessage/InformationMessage.vue";

import SubmittedRoleInfoMessageModal from "@/components/structure/roleForm/SubmittedRoleInfoMessageModal.vue";
import LoadingCircle from "@/components/common/loader/LoadingCircle.vue";

import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";
import RolesSelector from "./RolesSelector.vue";

export default {
  name: "AddRolesModal",
  components: {
    CloseModalButton,
    RolesSelector,
    LoadingCircle,
  },
  data() {
    return {
      checkedList: [],
      rolesList: [],
      isAvaliableTagsLoading: false,
    };
  },
  computed: {
    ...mapGetters(storeModules.USER, [userGetters.GET_FINAL_SIGN_UP_STEPS]),
    ...mapState(storeModules.MODAL, {
      modalProps: (state) => state.modal.displayedComponentProps,
    }),

    modalSubmittedRoleInfoMessageProps() {
      return {
        displayedComponent: SubmittedRoleInfoMessageModal,
      };
    },

    isFormValid() {
      return this.isCheckedListNotEmpty();
    },
  },
  mounted() {
    this[modalActions.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY](true);
    this.getAvaliableRolesFromApi();
  },
  unmounted() {
    this[modalActions.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY](false);
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY, modalActions.SET_MODAL_VISIBILITY, modalActions.SET_MODAL]),
    ...mapActions(storeModules.USER, [userActions.SET_FINAL_SIGN_UP_STEPS]),
    checkedListUpdatedHandler(checkedList) {
      this.checkedList = checkedList;
    },
    isCheckedListNotEmpty() {
      return this.checkedList.length;
    },
    skipButtonHandler() {
      this.saveSubmitResultInStoreIfOnSignUp("skip");
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
    chooseButtonHandler() {
      this.saveSubmitResultInStoreIfOnSignUp("choose");
      this.sendDataToServerByApi();
    },
    saveSubmitResultInStoreIfOnSignUp(submitResult) {
      if (this.modalProps?.case === CASES.FINAL_SIGN_UP_STEPS) {
        const stateSingUpSteps = JSON.parse(JSON.stringify(this[userGetters.GET_FINAL_SIGN_UP_STEPS]));
        stateSingUpSteps["ChoseRoleForm"] = submitResult;
        this[userActions.SET_FINAL_SIGN_UP_STEPS](stateSingUpSteps);
      }
    },
    sendDataToServerByApi() {
      const payload = {
        tags: [...this.checkedList],
        links: [],
      };
      this.$load(async () => {
        const response = await this.$api.auth.finalSignUpSteps(payload);
        this.openSubmittedRoleInfoMessageModal();
      }, this.submitRolesErrorHandler);
    },
    getAvaliableRolesFromApi() {
      this.$load(async () => {
        this.isAvaliableTagsLoading = true; //TODO: remake this with load plugin (interferes with other load call in this case);

        const response = await this.$api.auth.getAvaliableTags();
        const { data: resdata } = response;
        this.rolesList = resdata.data;
        this.isAvaliableTagsLoading = false;
      });
    },
    openSubmittedRoleInfoMessageModal() {
      this[modalActions.SET_MODAL](this.modalSubmittedRoleInfoMessageProps);
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
    submitRolesErrorHandler(error) {
      console.error(error);
      this.openErrorWindow(error.response.data.error.message);
    },
    modalErrorProps(message) {
      return {
        displayedComponent: InformationMessage,
        displayedComponentProps: {
          message: message,
        },
      };
    },
    openErrorWindow(message) {
      this[modalActions.SET_MODAL](this.modalErrorProps(message));
      this[modalActions.SET_MODAL_VISIBILITY](true);
    },
  },
};
</script>

<style scoped>
.add-roles-modal {
  padding: 50px;
  display: flex;
  flex-direction: column;
  background: var(--color-dark);
  width: 500px;
  border-radius: var(--medium-border-radius);
  /* max-height: calc(100vh - var(--navbar-height)); */
  /* min-height: 615px; */
  height: 620px;
}
.title-holder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.content-holder {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

h4 {
  margin-bottom: 0.9375rem;
}

.title-holder h2,
h4 {
  color: var(--color-gray);
}

.role-selector-wrapper {
  flex-grow: 1;
  margin-bottom: 25px;
  overflow: hidden;
}

.buttons-holder {
  display: flex;
  justify-content: space-between;
}
.buttons-holder > * {
  margin-left: auto;
}
button {
  width: 160px !important;
}
</style>
