<template>
  <div class="user-blockchains-and-wallets">
    <div v-for="blockchain in userWallets" :key="blockchain.blockchainIdentifier" class="blockchain-item">
      <ExtendableContainerResizeObserver usage-variant="blockchain-wallets" debug-prefix="">
        <template #header>
          <div class="blockchain-item-tltle">
            <div class="blockchain-icon-holder">
              <img :src="getBlockchainInformation(blockchain.blockchainIdentifier).logo" :alt="getBlockchainInformation(blockchain.blockchainIdentifier).name" />
            </div>
            <div class="blockchain-name-holder">
              {{ getBlockchainInformation(blockchain.blockchainIdentifier).name }}
            </div>
          </div>
        </template>
        <template #content>
          <div class="indent-wrapper">
            <div class="wallets-list">
              <WalletItem v-for="wallet in blockchain.wallets" :key="wallet.id" :wallet="wallet" />
            </div>
          </div>
        </template>
      </ExtendableContainerResizeObserver>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ExtendableContainerResizeObserver from "@/components/common/navigation/dropdowns/ExtendableContainerResizeObserver.vue";
import WalletItem from "./userblockchainsandwallets/WalletItem.vue";
import { getBlockchainInformationByBlockchainIdentifier } from "@/utils/wallet/wallet";
export default {
  name: "UserBlockchainsAndWallets",
  components: {
    ExtendableContainerResizeObserver,
    WalletItem,
  },
  computed: {
    ...mapState("wallet", { userWallets: (state) => state.userWallets }),
  },
  methods: {
    getBlockchainInformation(blockchainIdentifier) {
      return getBlockchainInformationByBlockchainIdentifier(blockchainIdentifier);
    },
  },
};
</script>

<style scoped>
.blockchain-item:not(:last-child) {
  margin-bottom: 20px;
}
.blockchain-item-tltle {
  display: flex;
  align-items: center;
  margin-right: 0.3125rem;
}

.blockchain-icon-holder {
  width: 50px;
  height: 50px;
  margin-right: 0.781rem;
}
.blockchain-icon-holder > * {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.blockchain-name-holder {
  font-size: var(--regular-font-size);
  font-weight: var(--regular-font-weight);

  background: var(--gradient-card-dark);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.indent-wrapper {
  padding-left: 3.906rem;
  padding-top: 0.8125rem;
}
</style>
