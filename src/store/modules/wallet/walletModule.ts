import type { ActionContext } from "vuex";
import { State } from "@/store/store";

import { SignatureValidationFields, UnchangingWalletData, WalletData } from "@/lib/common/common";
import { waitingForMetamaskLoadOnNewTab, initializeMetamaskAccountsChangedListenerAndGetInitialAccountsAddresses, finishMetamaskAccountsChangedListener, getEthereumWalletBalance } from "@/lib/ethereumWalletLib/ethereumWalletLib";
import { connectEthereumWalletByWalletId, computeIsExtensionConnectedToSite, connectCardanoWalletByWalletId, parseLoadedFromBackendWalletsToUserWalletsInBlockchain, isWalletExcluded } from "./walletModuleFunctions";

import { BlockchainIdentifier, BlockchainIdentifiers, WalletIdentifiers } from "@/data/wallet/walletServiceConstants";
import walletMessages from "@/data/wallet/walletMessages";

import { walletsFromBackend } from "@/data/wallet/testData";
import { getCardanoWalletBalance } from "@/lib/cardanoWalletLib/cardanoWalletLib";
import { ApiPlugin } from "@/plugins/api/ApiPlugin";

export type WalletToConnect = {
  //some data come from user click or from wallet connect event
  blockchainIdentifier: BlockchainIdentifiers;
  walletIdentifier: WalletIdentifiers;
};

export type UserWalletsInBlockchain = {
  blockchainIdentifier: BlockchainIdentifiers;
  wallets: WalletData[];
};

export interface WalletState {
  currentWalletId?: number;

  metamaskAccountsAddresses: string[];
  accountsChangedCallback: any;

  userWallets: UserWalletsInBlockchain[];

  isWalletLoading: boolean;
  actionsInProgressCounter: number;
}
export type Context = ActionContext<WalletState, State>;

const walletModule = {
  namespaced: true as boolean,
  state: (): WalletState => ({
    currentWalletId: undefined,

    metamaskAccountsAddresses: [],
    accountsChangedCallback: null, //For on and off listener

    userWallets: [
      // {
      //   blockchainIdentifier: blockchainIdentifiers.EVM,
      //   wallets: [],
      // },
      // {
      //   blockchainIdentifier: blockchainIdentifiers.CARDANO,
      //   wallets: [],
      // }
    ],

    isWalletLoading: false,
    actionsInProgressCounter: 0,
  }),
  mutations: {
    updateWalletBalance(state: WalletState, { blockchainIdentifier, walletId, balance }: any) {
      const blockchainIndex: number = state.userWallets.findIndex((blockchain) => {
        return blockchain.blockchainIdentifier === blockchainIdentifier;
      });
      const walletIndex = state.userWallets[blockchainIndex].wallets.findIndex((wallet) => wallet.id === walletId);
      state.userWallets[blockchainIndex].wallets[walletIndex].balance = balance;
    },
    loadWalletsFromBackend(state: WalletState, payload: any) {
      state.currentWalletId = payload.currentWalletId;

      state.userWallets = payload.userWallets;

      computeIsExtensionConnectedToSite(state);
    },
    setMetamaskAccountsAddresses(state: WalletState, payload: string[]) {
      state.metamaskAccountsAddresses = [...payload];
      computeIsExtensionConnectedToSite(state);
    },
    setAccountsChangedCallback(state: WalletState, payload: any) {
      state.accountsChangedCallback = payload;
    },
    setLoading(state: WalletState, isActionInProgress: boolean) {
      if (isActionInProgress) {
        state.actionsInProgressCounter++;
        state.isWalletLoading = true;
      } else {
        if (state.actionsInProgressCounter > 0) {
          state.actionsInProgressCounter--;
        }
        if (state.actionsInProgressCounter == 0) {
          state.isWalletLoading = false;
        }
      }
    },
  },
  getters: {
    getCurrentWallet(state: WalletState) {
      for (const blockchain of state.userWallets) {
        const currentWallet = blockchain.wallets.find((wallet) => wallet.id === state.currentWalletId);
        if (currentWallet) {
          return {
            blockchainIdentifier: blockchain.blockchainIdentifier,
            wallet: currentWallet,
          };
        }
      }
      return undefined;
    },
    hasWallets(state: WalletState) {
      return state.userWallets.some((userWalletsInBlockchain) => userWalletsInBlockchain.wallets.length);
    },
  },
  actions: {
    async updateAllWalletsBalance(context: Context, options?: { excludedWalletIdentifiers: Array<WalletIdentifiers> }): Promise<void> {
      context.state.userWallets.forEach((blockchain) => {
        blockchain.wallets.forEach((wallet) => {
          if (!isWalletExcluded(wallet, options))
            context.dispatch("updateWalletBalance", {
              blockchainIdentifier: blockchain.blockchainIdentifier,
              wallet,
            });
        });
      });
    },
    async updateWalletBalance(context: Context, { blockchainIdentifier, wallet }: { blockchainIdentifier: BlockchainIdentifiers; wallet: any }) {
      try {
        let balance = undefined;
        switch (blockchainIdentifier) {
          case BlockchainIdentifiers.EVM: {
            balance = await getEthereumWalletBalance(context, wallet.walletExtensionIdentifier, wallet.address);
            break;
          }
          case BlockchainIdentifiers.CARDANO: {
            balance = await getCardanoWalletBalance(wallet.walletExtensionIdentifier, { address: wallet.address, stakeKey: wallet.stakeKey });
            break;
          }
        }
        context.commit("updateWalletBalance", {
          blockchainIdentifier,
          walletId: wallet.id,
          balance,
        });
      } catch (error) {
        console.error(error);
      }
    },

    async updateWeb3AuthWalletBalance(context: Context) {
      const web3AuthAddress = (await context.dispatch("web3auth/getAccounts", undefined, { root: true }))[0];
      const web3AuthWalletBalance = await context.dispatch("web3auth/getBalance", undefined, { root: true });
      const userWalletsInBlockchain = context.state.userWallets.find((userWalletsInBlockchain) => userWalletsInBlockchain.blockchainIdentifier === BlockchainIdentifiers.EVM);
      if (!userWalletsInBlockchain) {
        throw new Error(walletMessages.ERRORS.WEB3AUTH_BALANCE_NO_BLOCKCHAIN);
      }
      console.log("web3AuthAddress=", web3AuthAddress, "userWalletsInBlockchain=", userWalletsInBlockchain);

      const web3AuthWallet = userWalletsInBlockchain.wallets.find((wallet) => wallet.walletExtensionIdentifier === WalletIdentifiers.WEB3AUTH && wallet.address === web3AuthAddress);
      if (!web3AuthWallet) {
        throw new Error(walletMessages.ERRORS.WEB3AUTH_BALANCE_NO_WALLET);
      }
      const id = web3AuthWallet.id;
      context.commit("updateWalletBalance", { blockchainIdentifier: BlockchainIdentifiers.EVM, walletId: id, balance: web3AuthWalletBalance });
    },
    async loadWalletsFromBackend(context: Context): Promise<void> {
      try {
        context.commit("setLoading", true);

        const result = await ApiPlugin.getInstance().wallet.getUserWallets(); //TODO:
        const walletsFromBackend = result.data.data;

        const userWallets: UserWalletsInBlockchain[] = [];
        const blockchainIdentifiersArray = Object.keys(BlockchainIdentifiers);
        for (let i = 0; i < blockchainIdentifiersArray.length; i++) {
          const userWalletsInBlockchain = parseLoadedFromBackendWalletsToUserWalletsInBlockchain(walletsFromBackend, BlockchainIdentifiers[blockchainIdentifiersArray[i] as keyof typeof BlockchainIdentifiers]);
          userWallets.push(userWalletsInBlockchain);
        }
        const payload = {
          currentWalletId: walletsFromBackend[0]?.id ?? undefined, //TODO:
          userWallets,
        };
        context.commit("loadWalletsFromBackend", payload);
        context.dispatch("updateAllWalletsBalance", { excludedWalletIdentifiers: [WalletIdentifiers.WEB3AUTH] });
        context.dispatch("onWalletsLoadedFromBackend", undefined, { root: true });
      } catch (error) {
        console.error(error);
      } finally {
        context.commit("setLoading", false);
      }
    },
    async connectWallet(context: Context, { blockchainIdentifier, walletIdentifier }: WalletToConnect): Promise<void> {
      console.log("connectWallet: start");

      context.commit("setLoading", true);
      try {
        let walletsToAddToUserAccount: Array<{ unchangingWalletData: UnchangingWalletData; signatureValidationFields: SignatureValidationFields }>;
        switch (blockchainIdentifier) {
          case BlockchainIdentifiers.EVM: {
            const userWalletsInBlockchain = context.state.userWallets.find((blockchain) => blockchain.blockchainIdentifier === blockchainIdentifier);
            const alreadyConnectedToAccountWallets: WalletData[] = userWalletsInBlockchain ? userWalletsInBlockchain.wallets : [];
            walletsToAddToUserAccount = await connectEthereumWalletByWalletId(context, alreadyConnectedToAccountWallets, walletIdentifier);
            break;
          }
          case BlockchainIdentifiers.CARDANO: {
            const userWalletsInBlockchain = context.state.userWallets.find((blockchain) => blockchain.blockchainIdentifier === blockchainIdentifier);
            const alreadyConnectedToAccountWallets: WalletData[] = userWalletsInBlockchain ? userWalletsInBlockchain.wallets : [];
            const cardanoWalletToAdd = await connectCardanoWalletByWalletId(alreadyConnectedToAccountWallets, walletIdentifier);
            walletsToAddToUserAccount = [cardanoWalletToAdd];
            break;
          }
          default:
            throw new Error(walletMessages.ERRORS.UNKNOWN_BLOCKCHAIN_IDENTIFIER);
        }
        if (walletsToAddToUserAccount.length) {
          const payload = {
            blockchainIdentifier: blockchainIdentifier,
            wallets: [...walletsToAddToUserAccount],
          };
          await context.dispatch("sendAddedWalletsToBackendAndUpdateWallets", payload);
        }
      } catch (error) {
        console.error(error);
      }
      context.commit("setLoading", false);
    },
    async setCurrentWallet(context: Context, walletId: number) {
      context.commit("setLoading", true);
      //await api //TODO: send walletId and get updated wallets
      //context.commit("loadWalletsFromBackend", updatedWalletsPayload);
      context.commit("setLoading", false);
    },
    async disconnectWallet(context: Context, walletId: number) {
      context.commit("setLoading", true);
      await ApiPlugin.getInstance().wallet.deleteWallet(walletId);
      context.dispatch("loadWalletsFromBackend");
      context.commit("setLoading", false);
    },
    async disconnectAllWallets(context: Context) {
      context.commit("setLoading", true);
      //await api //TODO: call api and get updated wallets (supposed to be empty)
      //context.commit("loadWalletsFromBackend", updatedWalletsPayload);
      context.commit("setLoading", false);
    },
    async sendAddedWalletsToBackendAndUpdateWallets(context: Context, payload: { blockchainIdentifier: BlockchainIdentifiers; wallets: Array<{ unchangingWalletData: UnchangingWalletData; signatureValidationFields: SignatureValidationFields }> }): Promise<void> {
      context.commit("setLoading", true);

      const blockchainIdentifier = payload.blockchainIdentifier;
      const wallets = payload.wallets;
      console.log("wallets=", wallets);

      const wallet = wallets[0]; //TODO:

      const payloadForApi = {
        address: wallet.unchangingWalletData.address,
        signature: wallet.unchangingWalletData.signature,
        date: wallet.signatureValidationFields.date,
        // version: wallet.version.toString(),
        version: 1, //TODO:
        chain_id: wallet.unchangingWalletData.chainId?.toString(),
        provider_name: WalletIdentifiers[wallet.unchangingWalletData.walletExtensionIdentifier].toLowerCase(),
      };

      await ApiPlugin.getInstance().wallet.addWallet(payloadForApi);

      await context.dispatch("loadWalletsFromBackend");
      context.commit("setLoading", false);
    },
    async initializeMetamaskAccountsChangedListener(context: Context) {
      context.commit("setLoading", true);
      try {
        await waitingForMetamaskLoadOnNewTab();
        const accountsChangedHandler = (metamaskAccountsAddresses: string[]) => {
          context.commit("setMetamaskAccountsAddresses", metamaskAccountsAddresses);
        };
        const { accountsChangedCallback, metamaskAccountsAddresses } = await initializeMetamaskAccountsChangedListenerAndGetInitialAccountsAddresses(accountsChangedHandler);
        context.commit("setAccountsChangedCallback", accountsChangedCallback);
        context.commit("setMetamaskAccountsAddresses", metamaskAccountsAddresses);
      } catch (error) {
        console.error(error);
      }
      context.commit("setLoading", false);
    },
    finishMetamaskAccountsListener(context: Context) {
      try {
        finishMetamaskAccountsChangedListener(context.state.accountsChangedCallback);
        context.commit("setAccountsChangedCallback", null);
      } catch (error) {
        console.error(error);
      }
    },
    async initializeWallets(context: Context): Promise<void> {
      context.commit("setLoading", true);
      await context.dispatch("initializeMetamaskAccountsChangedListener");
      context.commit("setLoading", false);
    },
    finishWallets(context: Context): void {
      context.dispatch("finishMetamaskAccountsListener");
    },
    async testLoading(context: Context) {
      //For debug purposes only
      context.commit("setLoading", true);

      setTimeout(() => {
        context.commit("setLoading", false);
      }, 5000);
    },
  },
};
export default walletModule;
