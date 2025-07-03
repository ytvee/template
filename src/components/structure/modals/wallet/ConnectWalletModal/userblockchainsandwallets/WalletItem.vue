<template>
  <div class="wallet-item">
    <div class="wallet-icon-holder">
      <img :src="getExtensionInformation(wallet.walletExtensionIdentifier).logo" :alt="getExtensionInformation(wallet.walletExtensionIdentifier).name" />
    </div>
    <div ref="walletAddressHolder" class="wallet-address-holder">
      {{ getStringWithEllipsis(wallet.address, elementWidth) }}
    </div>
    <SetCurrentWalletButton :is-current-wallet="isCurrentWallet(wallet.id, getCurrentWallet)" @set-current="setCurrentWalletButtonHandler(wallet.id)" />
    <div class="svg-button accent" title="copy address" @click="copyAddressButtonHandler(wallet.address)">
      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.59961 9.39745C3.59961 6.67122 3.59961 5.30811 4.44315 4.46119C5.28669 3.61426 6.64435 3.61426 9.35966 3.61426H12.2397C14.955 3.61426 16.3126 3.61426 17.1562 4.46119C17.9997 5.30811 17.9997 6.67123 17.9997 9.39745V14.2168C17.9997 16.943 17.9997 18.3061 17.1562 19.153C16.3126 20 14.955 20 12.2397 20H9.35966C6.64435 20 5.28669 20 4.44315 19.153C3.59961 18.3061 3.59961 16.943 3.59961 14.2168V9.39745Z" fill="url(#paint0_linear_5194_6399)" />
        <path opacity="0.5" d="M1.17158 1.17158C-1.1921e-07 2.34317 0 4.2288 0 8.00008V10.0001C0 13.7713 -1.1921e-07 15.6571 1.17158 16.8286C1.78915 17.4462 2.60512 17.7382 3.79109 17.8763C3.59964 17.0355 3.59964 15.8798 3.59964 14.2168V9.39749C3.59964 6.67126 3.59964 5.30815 4.44318 4.46122C5.28672 3.6143 6.64438 3.6143 9.35969 3.6143H12.2397C13.8916 3.6143 15.041 3.6143 15.8779 3.80498C15.7405 2.61149 15.4485 1.79156 14.8285 1.17158C13.657 1.1921e-07 11.7713 0 8.00008 0C4.2288 0 2.34317 1.1921e-07 1.17158 1.17158Z" fill="url(#paint1_linear_5194_6399)" />
        <defs>
          <linearGradient id="paint0_linear_5194_6399" x1="2.26245" y1="3.06807" x2="20.0094" y2="5.75054" gradientUnits="userSpaceOnUse">
            <stop stop-color="#74DE6F" />
            <stop offset="0.859375" stop-color="#CDE768" />
          </linearGradient>
          <linearGradient id="paint1_linear_5194_6399" x1="-1.47437" y1="-0.595877" x2="18.0844" y2="2.39202" gradientUnits="userSpaceOnUse">
            <stop stop-color="#74DE6F" />
            <stop offset="0.859375" stop-color="#CDE768" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div class="svg-button accent danger" title="disconnect wallet from platform" @click="disconnectWalletFromPlatformButtonHandler(wallet.id)">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM12.59 6L10 8.59L7.41 6L6 7.41L8.59 10L6 12.59L7.41 14L10 11.41L12.59 14L14 12.59L11.41 10L14 7.41L12.59 6Z" fill="url(#paint0_linear_5194_6398)" />
        <defs>
          <linearGradient id="paint0_linear_5194_6398" x1="-1.85714" y1="-0.666668" x2="22.63" y2="3.54493" gradientUnits="userSpaceOnUse">
            <stop stop-color="#74DE6F" />
            <stop offset="0.859375" stop-color="#CDE768" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script>
const letterWidth = 7.4; //px

import { mapGetters, mapActions } from "vuex";
import { getExtensionInformationByWalletIdentifier } from "@/utils/wallet/wallet";
import SetCurrentWalletButton from "./walletitem/SetCurrentWalletButton.vue";
export default {
  name: "WalletItem",
  components: {
    SetCurrentWalletButton,
  },
  props: {
    wallet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      elementWidth: undefined,
    };
  },
  computed: {
    ...mapGetters("wallet", { getCurrentWallet: "getCurrentWallet" }),
  },
  mounted() {
    this.$nextTick(() => {
      this.elementWidth = this.$refs.walletAddressHolder.clientWidth;
    });
  },
  methods: {
    ...mapActions("wallet", ["setCurrentWallet", "disconnectWallet"]),
    getExtensionInformation(walletIdentifier) {
      return getExtensionInformationByWalletIdentifier(walletIdentifier);
    },
    getStringWithEllipsis(string, elementWidth) {
      const elementCapacity = elementWidth / letterWidth;
      if (string.length <= elementCapacity) {
        return string;
      } else {
        const hiddenLettersCount = string.length - elementCapacity;
        const startLettersCount = Math.floor((string.length - hiddenLettersCount) / 2);
        return `${string.substr(0, startLettersCount)}...${string.substr(startLettersCount + hiddenLettersCount)}`;
      }
    },
    isCurrentWallet(walletId, getCurrentWallet) {
      return walletId === getCurrentWallet?.wallet.id;
    },
    setCurrentWalletButtonHandler(walletId) {
      this.setCurrentWallet(walletId);
    },
    copyAddressButtonHandler(walletAddress) {
      window.navigator.clipboard.writeText(walletAddress);
    },
    disconnectWalletFromPlatformButtonHandler(walletId) {
      this.disconnectWallet(walletId);
    },
  },
};
</script>

<style scoped>
.wallet-item {
  display: flex;
  align-items: center;
  overflow: hidden;
}
.wallet-item > *:not(:first-child):not(:last-child) {
  margin-right: 0.4rem;
}
.wallet-icon-holder {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  margin-right: 0.9375rem;
}
.wallet-icon-holder > * {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.wallet-address-holder {
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;

  font-size: var(--small-font-size);
  font-weight: var(--regular-font-weight);
  color: var(--color-gray);
}
</style>
