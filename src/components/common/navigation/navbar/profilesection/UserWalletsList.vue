<template>
  <div class="user-wallets-list">
    <button v-for="(wallet, index) in userWalletsAll" :key="index" class="button button-svg-transition profile-popup-panel-item" @click="setCurrentWalletButtonHandler(wallet.id)">
      <div class="popup-panel-item-icon">
        <img :src="getExtensionInformation(wallet.walletExtensionIdentifier).logo" :alt="getExtensionInformation(wallet.walletExtensionIdentifier).name" />
      </div>
      <div class="user-wallet-balance">
        {{ displayNumberValue(wallet.balance, getBlockchainInformationByBlockchainIdentifier(wallet.blockchainIdentifier)?.coinDesignation) }}
      </div>
      <div class="svg-button danger svg-button-in-button" title="disconnect wallet from platform" @click="disconnectWalletFromPlatformButtonHandler($event, wallet.id)">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.5 11.7C3.6335 11.7 1.3 9.3665 1.3 6.5C1.3 3.6335 3.6335 1.3 6.5 1.3C9.3665 1.3 11.7 3.6335 11.7 6.5C11.7 9.3665 9.3665 11.7 6.5 11.7ZM6.5 0C5.64641 0 4.80117 0.168127 4.01256 0.494783C3.22394 0.821439 2.50739 1.30023 1.90381 1.90381C0.684819 3.12279 0 4.77609 0 6.5C0 8.22391 0.684819 9.87721 1.90381 11.0962C2.50739 11.6998 3.22394 12.1786 4.01256 12.5052C4.80117 12.8319 5.64641 13 6.5 13C8.22391 13 9.87721 12.3152 11.0962 11.0962C12.3152 9.87721 13 8.22391 13 6.5C13 5.64641 12.8319 4.80117 12.5052 4.01256C12.1786 3.22394 11.6998 2.50739 11.0962 1.90381C10.4926 1.30023 9.77606 0.821439 8.98744 0.494783C8.19883 0.168127 7.35359 0 6.5 0ZM3.25 7.15H9.75V5.85H3.25" fill="#1D2227" />
        </svg>
      </div>
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { getBlockchainInformationByBlockchainIdentifier, getExtensionInformationByWalletIdentifier, displayNumberValue } from "@/utils/wallet/wallet";
import { WalletIdentifiers, BlockchainIdentifiers } from "@/data/wallet/walletServiceConstants.ts";

export default {
  name: "UserWalletsList",
  components: {},
  data() {
    return {
      testCurrentUserWallets: [{ icon: "testSvg" }, { icon: "testSvg" }],
      BlockchainIdentifiers,
      WalletIdentifiers,
    };
  },
  computed: {
    /* wallet module wallets */
    ...mapState("wallet", { userWallets: (state) => state.userWallets }),
    userWalletsAll() {
      const userWalletList = this.userWallets.reduce((accumulator, currentBlockchain) => {
        return (accumulator = accumulator.concat(
          currentBlockchain.wallets.map((wallet) => ({
            blockchainIdentifier: currentBlockchain.blockchainIdentifier,
            ...wallet,
          }))
        ));
      }, []);

      console.log("userWalletList=", userWalletList);
      return userWalletList;
    },
    /* /wallet module wallets */

    ...mapState("web3auth", {
      web3authWallet: (state) => state.web3authWallet,
    }),
    ...mapGetters("web3auth", ["isWeb3AuthLoggedIn"]),
  },
  methods: {
    /* wallet module wallets */
    ...mapActions("wallet", ["setCurrentWallet", "disconnectWallet"]),
    getExtensionInformation(walletIdentifier) {
      return getExtensionInformationByWalletIdentifier(walletIdentifier);
    },
    setCurrentWalletButtonHandler(walletId) {
      this.setCurrentWallet(walletId);
    },
    disconnectWalletFromPlatformButtonHandler(event, walletId) {
      this.disconnectWallet(walletId);
      event.stopPropagation();
    },
    displayNumberValue,
    getBlockchainInformationByBlockchainIdentifier,
    /* /wallet module wallets */
  },
};
</script>

<style scoped>
.profile-popup-panel-item {
  border-radius: var(--button-border-radius);

  font-size: var(--regular-font-size);
  font-weight: var(--large-font-weight);
  color: var(--color-dark);

  margin: var(--margin-zero-auto);
  margin-bottom: 10px;
  width: 150px !important;
  height: var(--button-height-small);

  padding: 0 0.625rem !important;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}

.profile-popup-panel-item > * {
  display: flex;
  align-items: center;
}

.popup-panel-item-icon {
  height: 25px;
  width: 25px;
}

.popup-panel-item-icon > * {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.svg-button-in-button path {
  fill: var(--color-dark);
  transition: none;
}

.user-wallet-balance {
  flex-grow: 1;
  margin: 0 5px;

  /* font-size: var(--regular-font-size); */
  font-size: var(--small-font-size);
  font-weight: var(--large-font-weight);
  white-space: nowrap;
}
</style>
