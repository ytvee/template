<template>
  <div ref="connectWalletModal" class="connect-wallet-modal">
    <div class="connect-wallet-modal-title">
      <h3>Connect my wallet for platform</h3>
      <CloseModalButton />
    </div>
    <div class="connect-wallet-description">Connect your wallets to your account on the platform</div>
    <div class="chose-wallet-to-connect-section">
      <h4>Add wallet</h4>
      <AvailableToConnectBlockchainsAndExtensions />
    </div>
    <div v-if="userWallets.length" class="user-wallets-section">
      <ExtendableContainerResizeObserver :dropdown-container-max-height="availableHeightToExpand" usage-variant="wallet-section">
        <template #header>
          <h4 class="user-wallets-section-title">My wallets</h4>
        </template>
        <template #headerAdditional>
          <div class="remove-all-user-wallets-button svg-button accent danger" title="disconnect all wallets from platform" @click="disconnectAllUserWalletsButtonHandler">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6Z" fill="url(#paint0_linear_5194_6390)" />
              <defs>
                <linearGradient id="paint0_linear_5194_6390" x1="-1.85714" y1="-0.666668" x2="22.63" y2="3.54493" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#74DE6F" />
                  <stop offset="0.859375" stop-color="#CDE768" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </template>
        <template #content>
          <div class="indent-wrapper">
            <UserBlockchainsAndWallets />
          </div>
        </template>
      </ExtendableContainerResizeObserver>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CloseModalButton from "@/components/common/navigation/buttons/CloseModalButton.vue";
import AvailableToConnectBlockchainsAndExtensions from "./ConnectWalletModal/AvailableToConnectBlockchainsAndExtensions.vue";

import ExtendableContainerResizeObserver from "@/components/common/navigation/dropdowns/ExtendableContainerResizeObserver.vue";
import UserBlockchainsAndWallets from "./ConnectWalletModal/UserBlockchainsAndWallets.vue";

import { IS_MODAL_VISIBLE } from "@/components/common/modal/ModalWindow.vue";

export default {
  name: "ConnectWalletModal",
  components: {
    CloseModalButton,
    AvailableToConnectBlockchainsAndExtensions,
    ExtendableContainerResizeObserver,
    UserBlockchainsAndWallets,
  },
  inject: [IS_MODAL_VISIBLE],
  data() {
    return {
      availableHeightToExpand: 0,
      isExtendableContainerAdjusted: false,
    };
  },
  computed: {
    ...mapState("wallet", { userWallets: (state) => state.userWallets }),
    IS_MODAL_VISIBLE() {
      return this[IS_MODAL_VISIBLE];
    },
  },
  mounted() {
    this.$nextTick(() => {
      const modalHeightBeforeExtendableContainerActiveted = this.$refs.connectWalletModal.offsetHeight;
      const windowHeight = window.innerHeight;
      this.availableHeightToExpand = windowHeight - modalHeightBeforeExtendableContainerActiveted;
    });
  },
  methods: {
    ...mapActions("wallet", ["disconnectAllWallets"]),
    disconnectAllUserWalletsButtonHandler(event) {
      this.disconnectAllWallets();
      event.stopPropagation();
    },
  },
};
</script>

<style scoped>
h4 {
  color: var(--color-gray);
}
.connect-wallet-modal {
  padding: 1.25rem 1.875rem;
  background: var(--color-dark);
  width: 635px;
  max-width: 100vw;
  /* max-height: 100vh; */
  border-radius: var(--regular-border-radius);
  border: 2px solid var(--color-accent-primary);
  box-shadow: 12px 11px 15px 0px var(--transparent-accent-10);
}
.connect-wallet-modal-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.connect-wallet-modal-title > h3 {
  background: var(--gradient-card-dark);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.connect-wallet-description {
  color: var(--color-gray);
  font-size: var(--regular-font-size);
  margin-bottom: 1rem;
}
.user-wallets-section-title {
  /* margin-bottom: 1rem; be **CAREFUL!** with margins in extensable containers. Margins usually are not sumed in scrollHeight/width calculation  */
  margin-right: 1.875rem;
}
.remove-all-user-wallets-button {
  margin-right: var(--size-of-scrollbar); /* align this button to buttons in wallets-list */
}
.indent-wrapper {
  padding-left: 0.781rem;
  padding-top: 1rem;
}
</style>
