<template>
  <div class="access-rights-form">
    <div class="blur-wrapper"></div>
    <div class="access-rights-close-button-holder" @click="closeModal">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M6.11463 8L0.390508 13.7241C-0.130169 14.2441 -0.130169 15.0895 0.390508 15.6095C0.910519 16.1302 1.75587 16.1302 2.27588 15.6095L8 9.88538L13.7241 15.6095C14.2441 16.1302 15.0895 16.1302 15.6095 15.6095C16.1302 15.0895 16.1302 14.2441 15.6095 13.7241L9.88538 8L15.6095 2.27588C16.1302 1.75587 16.1302 0.910519 15.6095 0.390508C15.0895 -0.130169 14.2441 -0.130169 13.7241 0.390508L8 6.11463L2.27588 0.390508C1.75587 -0.130169 0.910519 -0.130169 0.390508 0.390508C-0.130169 0.910519 -0.130169 1.75587 0.390508 2.27588L6.11463 8Z" fill="currentColor" fill-opacity="0.4" />
      </svg>
    </div>
    <ButtonsHolder title="Share & Collaborate" />
    <div class="access-rights-invite-container">
      <div class="access-rights-input-container">
        <div class="input"><input type="text" :value="inputData" placeholder="Invite others by name or by email" @input="validateUser($event.target.value)" /></div>
        <div class="invite-button" :class="isUserValid ? '' : 'disabled'" @click="addUserHandle">
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15.0007 6.16732H13.334C13.0979 6.16732 12.9001 6.08732 12.7407 5.92732C12.5812 5.76732 12.5012 5.56954 12.5007 5.33398C12.5001 5.09843 12.5801 4.90065 12.7407 4.74065C12.9012 4.58065 13.099 4.50065 13.334 4.50065H15.0007V2.83398C15.0007 2.59787 15.0807 2.4001 15.2407 2.24065C15.4007 2.08121 15.5984 2.00121 15.834 2.00065C16.0695 2.0001 16.2676 2.0801 16.4282 2.24065C16.5887 2.40121 16.6684 2.59898 16.6673 2.83398V4.50065H18.334C18.5701 4.50065 18.7682 4.58065 18.9282 4.74065C19.0882 4.90065 19.1679 5.09843 19.1673 5.33398C19.1668 5.56954 19.0868 5.7676 18.9273 5.92815C18.7679 6.08871 18.5701 6.16843 18.334 6.16732H16.6673V7.83398C16.6673 8.0701 16.5873 8.26815 16.4273 8.42815C16.2673 8.58815 16.0695 8.66787 15.834 8.66732C15.5984 8.66676 15.4007 8.58676 15.2407 8.42732C15.0807 8.26787 15.0007 8.0701 15.0007 7.83398V6.16732ZM7.50065 7.00065C6.58398 7.00065 5.79926 6.67426 5.14648 6.02148C4.49371 5.36871 4.16732 4.58398 4.16732 3.66732C4.16732 2.75065 4.49371 1.96593 5.14648 1.31315C5.79926 0.660373 6.58398 0.333984 7.50065 0.333984C8.41732 0.333984 9.20204 0.660373 9.85482 1.31315C10.5076 1.96593 10.834 2.75065 10.834 3.66732C10.834 4.58398 10.5076 5.36871 9.85482 6.02148C9.20204 6.67426 8.41732 7.00065 7.50065 7.00065ZM0.833984 12.0007V11.334C0.833984 10.8618 0.955651 10.4279 1.19898 10.0323C1.44232 9.63676 1.7651 9.33454 2.16732 9.12565C3.02843 8.6951 3.90343 8.37232 4.79232 8.15732C5.68121 7.94232 6.58398 7.83454 7.50065 7.83398C8.41732 7.83343 9.3201 7.94121 10.209 8.15732C11.0979 8.37343 11.9729 8.69621 12.834 9.12565C13.2368 9.33398 13.5598 9.63621 13.8032 10.0323C14.0465 10.4284 14.1679 10.8623 14.1673 11.334V12.0007C14.1673 12.459 14.0043 12.8515 13.6782 13.1782C13.352 13.5048 12.9595 13.6679 12.5007 13.6673H2.50065C2.04232 13.6673 1.6501 13.5043 1.32398 13.1782C0.997873 12.852 0.83454 12.4595 0.833984 12.0007ZM2.50065 12.0007H12.5007V11.334C12.5007 11.1812 12.4626 11.0423 12.3865 10.9173C12.3104 10.7923 12.2095 10.6951 12.084 10.6257C11.334 10.2507 10.577 9.96954 9.81315 9.78232C9.04926 9.5951 8.27843 9.50121 7.50065 9.50065C6.72287 9.5001 5.95204 9.59398 5.18815 9.78232C4.42426 9.97065 3.66732 10.2518 2.91732 10.6257C2.79232 10.6951 2.69148 10.7923 2.61482 10.9173C2.53815 11.0423 2.5001 11.1812 2.50065 11.334V12.0007ZM7.50065 5.33398C7.95898 5.33398 8.35148 5.17093 8.67815 4.84482C9.00482 4.51871 9.16787 4.12621 9.16732 3.66732C9.16676 3.20843 9.00371 2.81621 8.67815 2.49065C8.3526 2.1651 7.9601 2.00176 7.50065 2.00065C7.04121 1.99954 6.64898 2.16287 6.32398 2.49065C5.99898 2.81843 5.83565 3.21065 5.83398 3.66732C5.83232 4.12398 5.99565 4.51648 6.32398 4.84482C6.65232 5.17315 7.04454 5.33621 7.50065 5.33398Z"
              fill="currentColor"
              fill-opacity="0.4"
            />
          </svg>
          <span>Invite</span>
        </div>
      </div>
      <div class="access-rights-users-list">
        <div v-for="(user, index) in users" :key="index" class="access-rights-user-line">
          <div class="access-rights-user-info">
            <div class="access-rights-user-avatar">
              <img :src="user.avatar" alt="user avatar" />
            </div>
            <div class="access-rights-user-name">{{ user.name }}</div>
          </div>
          <div class="access-rights-user-role">{{ user.role }}</div>
          <SimpleDropDown :options="options" :parent-id="user.id" :is-project-owner="user.rights === 'owner'" @set-option-for-user="updateUserRights" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleDropDown from "@audioeditor/components/modals/accessrightsform/SimpleDropDown.vue";
import ButtonsHolder from "@audioeditor/components/modals/accessrightsform/ButtonsHolder.vue";

export default {
  name: "AccessRightsForm",
  components: { ButtonsHolder, SimpleDropDown },
  data() {
    return {
      linkCopied: false,
      inputData: "",
      isUserValid: false,
      projectOwner: {
        id: 0,
        avatar: "/assets/users/user_1.png",
        email: "owner@owner.com",
        name: "Wade Warren",
        role: "Drums",
        rights: "owner",
      },
      users: [
        {
          id: 0,
          avatar: "/assets/users/user_1.png",
          email: "owner@owner.com",
          name: "Wade Warren",
          role: "Drums",
          rights: "owner",
        },
        {
          id: 1,
          avatar: "/assets/users/user_2.png",
          email: "",
          name: "Jenny Wilson",
          role: "Producer",
          rights: "can edit",
        },
        {
          id: 2,
          avatar: "/assets/users/user_3.png",
          email: "",
          name: "Cody Fisher",
          role: "Rhythm Guitar",
          rights: "can view",
        },
        {
          id: 3,
          avatar: "/assets/users/user_1.png",
          email: "",
          name: "Cody Nisher",
          role: "Rhythm Guitar",
          rights: "can view",
        },
        {
          id: 4,
          avatar: "/assets/users/user_1.png",
          email: "",
          name: "Cody Osbrn",
          role: "Rhythm Guitar",
          rights: "can view",
        },
        {
          id: 5,
          avatar: "/assets/users/user_1.png",
          email: "",
          name: "Cody Walc",
          role: "Rhythm Guitar",
          rights: "can view",
        },
        {
          id: 6,
          avatar: "/assets/users/user_1.png",
          email: "",
          name: "Cody Lodochnik",
          role: "Rhythm Guitar",
          rights: "can view",
        },
        {
          id: 7,
          avatar: "/assets/users/user_1.png",
          email: "",
          name: "Cody Bobby",
          role: "Rhythm Guitar",
          rights: "can view",
        },
      ],
      options: [
        {
          id: 0,
          label: "can view",
          action: () => console.log("can view"),
        },
        {
          id: 1,
          label: "can edit",
          action: () => console.log("can edit"),
        },
      ],
    };
  },
  methods: {
    closeModal() {
      this.$modal.close();
    },
    isMailValid(mail) {
      return String(mail)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    },
    validateUser(value) {
      this.inputData = value;
      this.isUserValid = false;
      // todo: search users and show tips
      this.users.forEach((user) => {
        if (value && user.name.toLowerCase().includes(value.toLowerCase())) {
          this.isUserValid = true;
        }
      });
      if (this.isMailValid(value)) {
        this.isUserValid = true;
      }
    },
    updateUserRights({ parentId, optionId }) {
      this.users.map((user, index) => {
        if (index === parentId) {
          this.users[index].rights = this.options[optionId].label;
        }
      });
    },
    addUserHandle() {
      const lastUserId = this.users[this.users.length - 1].id;
      // todo: get user profile data
      const newUser = {
        id: lastUserId + 1,
        avatar: "/assets/users/user_1.png",
        email: this.isMailValid(this.inputData) ? this.inputData : "",
        name: !this.isMailValid(this.inputData) ? this.inputData : "Vasiliy Galkin",
        role: "Some Instrument",
        rights: "can view",
      };
      this.users.push(newUser);

      this.$nextTick(() => {
        this.inputData = "";
      });
    },
  },
};
</script>

<style scoped>
.access-rights-form {
  position: relative;
  padding: 30px 20px 30px 30px;
  width: 654px;
  max-height: 502px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: var(--audio-editor-frame-border-radius);
  box-shadow: 0 22px 32px 0 #0000004d;
}

.blur-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(24px);
  border-radius: var(--audio-editor-frame-border-radius);
  background: #5c5c5ccc;
  z-index: -1;
}

.access-rights-close-button-holder {
  position: absolute;
  top: 24px;
  right: 20px;
  cursor: pointer;
}

.access-rights-close-button-holder svg path {
  fill: var(--audio-editor-color-white-opacity-40);
  transition: all var(--default-transition);
}

.access-rights-close-button-holder:hover svg path {
  fill: var(--audio-editor-color-white);
  transition: all var(--default-transition);
}

.access-rights-invite-container {
  height: 100%;
  overflow: hidden;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: var(--medium-block-gap);
}

.access-rights-input-container {
  display: flex;
  justify-content: space-between;
}

.input {
  min-width: 500px;
  height: 36px;
}

.input input {
  width: 100%;
  height: 36px;
  padding: 9px 27px;
  border-radius: 44px;
  color: var(--audio-editor-color-white);
  background-color: #0000004d;
  border: none;

  font-family: var(--audio-editor-font-label-main);
  font-weight: var(--small-font-weight);
  font-size: var(--regular-font-size);
}

.invite-button {
  padding: 9px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  border-radius: var(--large-border-radius);
  pointer-events: auto;
  user-select: none;

  font-family: var(--audio-editor-font-label-main);
  font-weight: var(--audio-editor-font-weight-bold);
  font-size: var(--regular-font-size);
  text-align: center;
  color: var(--audio-editor-color-white-opacity-40);
  background-color: var(--transparent-light-10);
  transition: all var(--default-transition);
}

.invite-button svg path {
  fill: var(--audio-editor-color-white);
  transition: all var(--default-transition);
}

.invite-button:hover,
.invite-button:hover svg path {
  color: var(--audio-editor-color-white);
  fill-opacity: 1;
  cursor: pointer;
  transition: all var(--default-transition);
}

.invite-button:active {
  background-color: var(--transparent-light-17);
  box-shadow: inset 0 0 3px var(--color-wallet);
  transition: all var(--default-transition);
}

.invite-button.disabled {
  pointer-events: none;
  background-color: var(--transparent-light-02);
  box-shadow: inset 0 0 3px var(--color-wallet);
}

.access-rights-users-list {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.access-rights-user-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 44px;
  padding: 4px 23px 4px 4px;

  font-family: "Wix Madefor Text";
  font-weight: var(--small-font-weight);
  font-size: var(--regular-font-size);
  line-height: 100%;
  color: var(--audio-editor-color-white);
}

.access-rights-user-line:hover {
  background: var(--transparent-light-05);
}

.access-rights-user-info {
  display: flex;
  width: 190px;
  gap: 15px;
}

.access-rights-user-info div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.access-rights-user-avatar,
.access-rights-user-avatar img {
  width: 36px;
  height: 36px;
  user-select: none;
}

.access-rights-user-role {
  margin-right: 80px;
  width: 110px;
  text-align: left;
  white-space: nowrap;
}
</style>
