<template>
  <div class="web3auth-modal required-more-shares-modal">
    <div class="web3auth-modal-title">
      <div class="web3auth-modal-title-text">Required more shares to login</div>
      <CloseModalButton />
    </div>
    <div class="web3auth-modal-body">
      <div class="web3auth-modal-subtitle">Enter additional factor</div>
      <div class="web3auth-modal-divider"></div>
      <div class="web3auth-modal-subtitle">Social</div>
      <div class="social-provider-buttons">
        <div class="social-provider-button" @click="inputSocialFactorHandler('google')">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
        </div>
        <div class="social-provider-button" @click="inputSocialFactorHandler('farcaster')">
          <svg width="225" height="225" viewBox="0 0 225 225" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="225" height="225" rx="50" fill="#855DCD" />
            <path d="M58 35H167V190H151V119H150.843C149.075 99.3773 132.583 84 112.5 84C92.4169 84 75.9253 99.3773 74.157 119H74V190H58V35Z" fill="white" />
            <path d="M29 57L35.5 79H41V168C38.2386 168 36 170.239 36 173V179H35C32.2386 179 30 181.239 30 184V190H86V184C86 181.239 83.7614 179 81 179H80V173C80 170.239 77.7614 168 75 168H69V57H29Z" fill="white" />
            <path d="M152 168C149.239 168 147 170.239 147 173V179H146C143.239 179 141 181.239 141 184V190H197V184C197 181.239 194.761 179 192 179H191V173C191 170.239 188.761 168 186 168V79H191.5L198 57H158V168H152Z" fill="white" />
          </svg>
        </div>
        <div class="social-provider-button">test</div>
        <div class="social-provider-button">test</div>
      </div>

      <div class="web3auth-modal-divider"></div>

      <div class="web3auth-modal-subtitle">Input Mnemonic Recovery Phrase</div>
      <input type="text" placeholder="Mnemonic recovery phrase" />
      <div class="button">Enter</div>

      <div class="web3auth-modal-divider"></div>

      <div class="web3auth-modal-subtitle">Input email/phone</div>
      <input type="text" placeholder="email/phone" />
      <div class="button">Get code</div>
      <div class="web3auth-modal-subtitle">Enter code</div>
      <input type="text" placeholder="Enter code" />
      <div class="button">Enter</div>

      <div class="web3auth-modal-divider"></div>

      <div class="web3auth-modal-subtitle">Input other entry factor in hex</div>
      <input type="text" placeholder="Recovery factor in hex" />
      <div class="button">Enter</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import modalActions from "@/data/store/modal/modalActions.json";
import storeModules from "@/data/store/storeModules.json";
import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";

export default {
  name: "RequiredMoreSharesModal",
  components: {
    CloseModalButton,
  },
  computed: {
    ...mapGetters("web3auth", ["isWeb3AuthLoggedIn"]),
  },
  methods: {
    ...mapActions("web3auth", ["inputSocialFactor"]),
    async inputSocialFactorHandler(socialProviderName) {
      await this.inputSocialFactor(socialProviderName);
      if (this.isWeb3AuthLoggedIn) {
        //TODO:
      }
    },
    ...mapActions(storeModules.MODAL, [modalActions.SET_MODAL_VISIBILITY, modalActions.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY]),
    closeModal() {
      this[modalActions.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY](false);
      this[modalActions.SET_MODAL_VISIBILITY](false);
    },
  },
};
</script>

<style scoped>
.web3auth-modal {
  width: 450px;
  background-color: var(--color-dark);
  border: 1px solid var(--color-accent-primary);
  border-radius: var(--large-border-radius);
  padding: 30px;
  color: var(--color-light);
}
.web3auth-modal-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.web3auth-modal-title-text {
  font-size: var(--medium-font-size-3);
  font-weight: var(--large-font-weight);
}
.web3auth-modal-subtitle {
  text-align: center;
}
.web3auth-modal-divider {
  height: 1px;
  background: var(--color-accent-primary);
  margin-top: 10px;
  margin-bottom: 10px;
}

.social-provider-buttons {
  display: flex;
  /* gap: 0 15px; */
  justify-content: space-between;
  row-gap: 15px;
  flex-wrap: wrap;
}
.social-provider-button {
  width: 110px;
  height: 45px;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #262626;

  cursor: pointer;
  flex-shrink: 0;
}
.social-provider-button > svg {
  width: 24px;
  height: 24px;
}
</style>
