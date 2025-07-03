<template>
  <div class="chose-account-holder">
    <div class="content-holder">
      <div class="title-holder">
        <h2>Who are you</h2>
        <CloseModalButton />
      </div>
      <div class="account-type-holder">
        <div class="selector creator" :class="{ selected: selectedRole === ACCOUNT_TYPES.CREATOR }" @click="setRole(ACCOUNT_TYPES.CREATOR)">
          <svg width="91" height="86" viewBox="0 0 91 86" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M34.588 73.0762C36.1683 67.3483 38.0067 65.5099 39.8829 64.7678C41.7591 64.028 47.3235 62.2611 49.1525 58.165C50.7746 54.5364 47.4558 53.4415 46.5575 54.4789C41.9506 59.7981 38.0537 52.2053 38.831 51.4279C39.6095 50.6494 67.1397 22.3308 72.1264 17.2425C72.6172 16.7428 73.0645 16.3287 73.4736 15.9814C76.7223 12.7537 78.6255 14.31 79.8673 13.7509C81.1068 13.1905 82.7184 9.73918 84.5704 7.0712C86.4216 4.40505 86.9412 6.92323 89.1629 5.81352C91.3841 4.7021 91.3604 2.20706 90.1009 0.947592C88.8415 -0.311817 87.422 -0.149976 84.8242 1.25177C82.2275 2.65368 74.9793 6.81226 72.2389 8.07164C69.4988 9.33098 72.6094 9.77494 69.7206 12.8128C66.8319 15.8495 42.0559 39.2915 38.7598 42.5877C35.3527 45.9948 29.5758 40.2665 36.0345 34.8998C39.7873 31.7841 30.4658 27.7741 24.5392 40.8109C18.6138 53.8454 16.8355 46.8837 5.57885 54.8827C-5.68065 62.8814 5.79257 74.9629 8.76292 77.9158C18.1689 87.2721 21.3046 86.5085 25.2799 85.1978C29.2105 83.9064 33.0069 78.8059 34.5877 73.0764L34.588 73.0762ZM26.0665 76.9257C25.9858 71.6209 22.5766 69.3444 22.5766 69.3444C22.5766 69.3444 23.7664 68.4284 23.1756 67.8377C22.6831 67.3452 18.6697 63.3074 18.0209 62.6587C17.4086 62.0464 16.4855 63.345 16.4855 63.345C16.4855 63.345 11.7057 59.3073 19.945 54.7351C25.5176 51.6427 28.0193 51.5858 31.093 46.477C33.4494 42.5592 34.2583 47.1235 34.2583 47.1235C34.2583 47.1235 33.0801 48.2421 32.4993 48.8229C31.9195 49.4027 31.8582 49.7842 33.938 51.938C36.018 54.0919 36.1438 53.9957 37.0515 53.088C37.7416 52.3979 40.474 61.1916 46.0551 56.5858C48.2206 54.8001 48.9671 56.821 46.6841 59.3658C45.1072 61.1204 42.9986 62.3103 39.5737 63.4349C36.9037 64.3183 35.5731 66.4749 34.3137 69.3244C33.0554 72.175 31.9252 75.7302 30.519 78.5278C29.1144 81.3237 26.1661 83.1955 26.0666 76.9255L26.0665 76.9257Z"
              fill="url(#paint0_linear_1622_1807)"
            />
            <defs>
              <linearGradient id="paint0_linear_1622_1807" x1="74.8917" y1="-19.5385" x2="105.547" y2="14.7649" gradientUnits="userSpaceOnUse">
                <stop stop-color="#74DE6F" />
                <stop offset="0.859375" stop-color="#CDE768" />
              </linearGradient>
            </defs>
          </svg>
          <span class="creator">I am creator</span>
        </div>
        <div class="selector fan" :class="{ selected: selectedRole === ACCOUNT_TYPES.FAN }" @click="setRole(ACCOUNT_TYPES.FAN)">
          <svg width="79" height="106" viewBox="0 0 79 106" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M78.4515 12.3223C78.447 12.1265 78.4084 11.9329 78.3366 11.75C78.3177 11.7023 78.2928 11.6585 78.2708 11.6131H78.2701C78.2421 11.5451 78.2104 11.4786 78.1741 11.4151L71.3999 1.25379C71.0839 0.780503 70.5524 0.497749 69.9838 0.500013H9.01618C8.4499 0.500013 7.92143 0.782768 7.60692 1.25379L0.832736 11.4151C0.795689 11.4786 0.763934 11.5451 0.736718 11.6131C0.714793 11.6608 0.68909 11.7008 0.670944 11.75H0.670188C0.596096 11.9322 0.555267 12.1265 0.548462 12.3223V12.3548V37.758H3.93555V34.3709H10.7097V37.758H14.0968V33.3782L27.6452 46.9266V76.7097C27.6452 77.1588 27.8236 77.5898 28.1412 77.9073C28.4587 78.2248 28.8896 78.4033 29.3387 78.4033H31.0323V103.806C31.0323 104.256 31.2107 104.686 31.5282 105.004C31.8458 105.322 32.2767 105.5 32.7258 105.5H46.2742C46.7233 105.5 47.1542 105.322 47.4718 105.004C47.7893 104.686 47.9677 104.256 47.9677 103.806V78.4033H49.6613C50.1104 78.4033 50.5413 78.2248 50.8589 77.9073C51.1764 77.5898 51.3548 77.1588 51.3548 76.7097V46.9266L64.9032 33.3782V37.758H68.2903V34.3709H75.0645V37.758H78.4515V12.3548V12.3223H78.4515ZM9.92198 3.88709H69.078L73.5946 10.6613H5.40573L9.92198 3.88709ZM64.9032 17.4355H61.5161V14.0484H64.9032V17.4355ZM17.4839 17.4355H14.0968V14.0484H17.4839V17.4355ZM20.871 14.0484H32.7697C31.6493 15.5053 31.0384 17.2911 31.0323 19.129V22.5161C31.0323 25.5411 32.6465 28.3369 35.2662 29.849C37.8859 31.3619 41.1143 31.3619 43.7339 29.849C46.3536 28.3369 47.9678 25.5411 47.9678 22.5161V19.129C47.9617 17.291 47.3509 15.5052 46.2304 14.0484H58.1291V25.2023L48.9606 34.3709H30.0397L20.8711 25.2023L20.871 14.0484ZM44.5806 19.129V22.5161C44.5806 24.3314 43.6121 26.0083 42.0403 26.9162C40.4685 27.8235 38.5315 27.8235 36.9597 26.9162C35.3879 26.0082 34.4194 24.3314 34.4194 22.5161V19.129C34.4194 17.3137 35.3879 15.6368 36.9597 14.7289C38.5315 13.8216 40.4685 13.8216 42.0403 14.7289C43.6121 15.6369 44.5806 17.3137 44.5806 19.129ZM3.93554 14.0484H10.7097V30.9838H3.93554V14.0484ZM37.8064 78.4031V95.3385H34.4194V78.4031H37.8064ZM34.4194 98.7256H37.8064V102.113H34.4194V98.7256ZM41.1935 102.113V98.7256H44.5806V102.113H41.1935ZM44.5806 95.3385H41.1935V78.4031H44.5806V95.3385ZM41.1935 75.016V64.8547H37.8064V75.016H31.0323V61.4676H47.9677V75.016H41.1935ZM48.4636 45.0277C48.1461 45.3452 47.9676 45.7762 47.9676 46.2252V58.0801H31.0322V46.2252C31.0322 45.7762 30.8537 45.3452 30.5362 45.0277L14.0966 28.5889V20.822H17.4837V25.9026C17.4837 26.3517 17.6621 26.7826 17.9797 27.1002L28.1409 37.2614C28.4585 37.579 28.8894 37.7574 29.3385 37.7574H49.6611C50.1102 37.7574 50.5411 37.579 50.8586 37.2614L61.0199 27.1002C61.3375 26.7826 61.5159 26.3517 61.5159 25.9026V20.822H64.903V28.5889L48.4636 45.0277ZM68.2907 29.2899V14.048H75.0648V30.9834H68.2907V29.2899Z"
              fill="url(#paint0_linear_1622_2545)"
            />
            <defs>
              <linearGradient id="paint0_linear_1622_2545" x1="-6.6854" y1="-3.00001" x2="89.9437" y2="9.33055" gradientUnits="userSpaceOnUse">
                <stop stop-color="#74DE6F" />
                <stop offset="0.859375" stop-color="#CDE768" />
              </linearGradient>
            </defs>
          </svg>
          <span>I am fan</span>
        </div>
      </div>
      <div class="buttons-holder">
        <button class="large outlined" @click="skipButtonHandler">Skip</button>
        <button class="large" :disabled="!isRoleSelected" @click="nextButtonHandler">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import userActions from "@/data/store/user/userActions.json";
import userGetters from "@/data/store/user/userGetters.json";
import storeModules from "@/data/store/storeModules.json";

import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";
export default {
  name: "ChoseAccount",
  components: {
    CloseModalButton,
  },
  emits: ["chose-account-result"],
  data() {
    return {
      ACCOUNT_TYPES: {
        FAN: "fan",
        CREATOR: "creator",
        SKIP: "skip",
      },
      selectedRole: "",
    };
  },
  computed: {
    ...mapGetters(storeModules.USER, [userGetters.GET_FINAL_SIGN_UP_STEPS]),
    isRoleSelected() {
      return this.selectedRole === this.ACCOUNT_TYPES.CREATOR || this.selectedRole === this.ACCOUNT_TYPES.FAN;
    },
  },
  created() {
    this[modalActions.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY](true);
  },
  unmounted() {
    this[modalActions.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY](false);
  },
  methods: {
    ...mapActions(storeModules.MODAL, [modalActions.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY]),
    ...mapActions(storeModules.USER, [userActions.SET_FINAL_SIGN_UP_STEPS]),
    setRole(currentRole) {
      this.selectedRole = currentRole;
    },
    skipButtonHandler() {
      const stateSingUpSteps = JSON.parse(JSON.stringify(this[userGetters.GET_FINAL_SIGN_UP_STEPS]));
      stateSingUpSteps["ChoseAccount"] = this.ACCOUNT_TYPES.SKIP;
      this[userActions.SET_FINAL_SIGN_UP_STEPS](stateSingUpSteps);
    },
    nextButtonHandler() {
      const stateSingUpSteps = JSON.parse(JSON.stringify(this[userGetters.GET_FINAL_SIGN_UP_STEPS]));
      stateSingUpSteps["ChoseAccount"] = this.selectedRole;
      this[userActions.SET_FINAL_SIGN_UP_STEPS](stateSingUpSteps);
    },
  },
};
</script>

<style scoped>
.chose-account-holder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--color-dark);
  width: 550px;
  height: 600px;
  border-radius: var(--medium-border-radius);
}

.content-holder {
  width: 450px;
}

.title-holder {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}
.selector {
  width: 100%;
  height: 150px;
  border: 2px solid var(--color-accent-primary);
  border-radius: var(--small-border-radius);
  margin-bottom: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.selector:hover,
.selector.selected {
  color: var(--color-dark);
  background: var(--gradient-card-dark);
}

.selector:hover path,
.selector.selected path {
  fill: var(--color-dark);
}

.selector:hover span,
.selector.selected span {
  color: var(--color-dark);
}

.selector:active {
  opacity: 50%;
}

.selector.fan {
  margin-bottom: 40px;
}

.selector span {
  font-size: var(--button-font-size);
  font-weight: var(--large-font-weight);
  color: var(--color-accent-primary);
  margin-left: 40px;
}

.buttons-holder {
  display: flex;
  justify-content: space-between;
}
button {
  width: 200px !important;
}
</style>
