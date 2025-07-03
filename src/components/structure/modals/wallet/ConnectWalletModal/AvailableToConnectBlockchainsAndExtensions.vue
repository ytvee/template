<template>
  <div class="available-to-connect-blockchains-and-extensions">
    <div v-for="blockchain in blockchainWallets" :key="blockchain.identifier" class="blockchain-item">
      <div class="blockchain-name">
        <span class="blockchain-name-background-holder">{{ blockchain.name }}</span>
      </div>
      <div class="extensions-list">
        <div v-for="wallet in blockchain.wallets" :key="wallet.identifier" class="extensions-list-item" @click="extensionItemClickHandler(blockchain.identifier, wallet.identifier)">
          <div class="icon-container">
            <div class="icon-background-holder"></div>
            <div class="icon-holder">
              <img draggable="false" :src="wallet.logo" alt="" />
            </div>
          </div>
          <div class="wallet-name">
            <span class="wallet-name-background-holder">
              {{ wallet.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { blockchainWallets } from "@/data/wallet/walletServiceConstants.ts";
import { mapActions } from "vuex";
import store from "@/store/store";

export default {
  name: "AvailableToConnectBlockchainsAndExtensions",
  data() {
    return {
      blockchainWallets: blockchainWallets.map((blockchain) => ({
        ...blockchain,
        wallets: blockchain.wallets.filter((wallet) => !wallet.hideFromConnectionModal),
      })),
    };
  },
  methods: {
    ...mapActions("wallet", ["connectWallet"]),
    extensionItemClickHandler(blockchainIdentifier, walletIdentifier) {
      store.dispatch("wallet/connectWallet", {
        blockchainIdentifier: blockchainIdentifier,
        walletIdentifier: walletIdentifier,
      });
    },
  },
};
</script>

<style scoped>
.available-to-connect-extensions-list {
}
.blockchain-item {
  margin-bottom: 10px;

  display: flex;
  flex-direction: column;
}
.blockchain-name {
  margin-bottom: 5px;
}
.blockchain-name-background-holder {
  font-weight: var(--medium-font-weight);

  background: var(--gradient-card-dark);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.extensions-list {
  display: flex;
}
.extensions-list-item {
  width: 105px;
  display: flex;
  flex-direction: column;
  align-items: center;

  cursor: pointer;
  user-select: none;

  transition: var(--default-transition);
}

.extensions-list-item:active {
  transform: scale(0.9);
  transition: var(--default-transition);
}

/* extension list item */

.icon-container {
  position: relative;
  width: 75px;
  height: 75px;
  border: 1px solid var(--color-accent-primary);
  border-radius: var(--large-border-radius-2);
  box-shadow: 0px 4px 15px 0px var(--transparent-accent-30);
  margin-bottom: 5px;

  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  user-drag: none;
  -webkit-user-drag: none;

  transition: var(--default-transition);
}
.icon-background-holder {
  position: absolute;
  border-radius: var(--large-border-radius-2);
  background: var(--gradient-primary);
  opacity: 0;
  width: 100%;
  height: 100%;
  transition: var(--default-transition);
}
.extensions-list-item:hover .icon-background-holder {
  opacity: 1;
  transition: var(--default-transition);
}
.icon-holder {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: var(--default-padding);
}
.icon-holder > * {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.wallet-name {
  width: 130%;
  display: flex;
}
.wallet-name-background-holder {
  margin: var(--margin-zero-auto);

  text-align: center;
  font-weight: var(--medium-font-weight);

  background: var(--gradient-card-dark);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* user-select: none; */
}
/* /extension element */
</style>
