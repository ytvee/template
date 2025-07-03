<template>
  <div class="add-user-form-holder">
    <div class="content-holder">
      <div class="title-holder">
        <h2>Edit user</h2>
        <CloseModalButton />
      </div>
      <div class="input-username-holder">
        <label for="username-input">Username</label>
        <input id="username-input" v-model="userName" type="text" placeholder="Enter username" />
      </div>
      <h4>Choose user’s role</h4>
      <div class="role-selector-wrapper">
        <RolesSelector selector-id="EditUserSelector" :roles="rolesList" @checked-list-updated="checkedListUpdatedHandler" />
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
        <RolesSelector selector-id="EditUserSelector" :roles="moderatorRolesList" @checked-list-updated="moderatorCheckedListUpdatedHandler" />
      </div>
      <div class="buttons-holder">
        <button class="large" :class="{ disabled: !isFormValid }">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";
import RolesSelector from "./RolesSelector.vue";
export default {
  name: "AddUser",

  components: {
    CloseModalButton,
    RolesSelector,
  },

  data() {
    return {
      userName: "",
      checkedList: [],
      moderatorCheckedList: [],
      rolesList: [
        { id: "0", name: "Musician" },
        { id: "1", name: "Songwriter" },
        { id: "2", name: "Signer" },
        { id: "3", name: "Producer" },
        { id: "4", name: "Sound Designer" },
      ],
      moderatorRolesList: [{ id: "100", name: "Moderator" }],
    };
  },
  computed: {
    isFormValid() {
      return this.isUserNameValid() && (this.isRolesCheckListNotEmpty() || this.isModeratorRolesCheckListNotEmpty());
    },
  },
  methods: {
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
  align-items: start;
  margin-bottom: 25px;
}

.buttons-holder {
  display: flex;
  justify-content: end;
}

button {
  width: 160px !important;
}
</style>
