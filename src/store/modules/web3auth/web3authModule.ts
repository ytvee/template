import type { ActionContext } from "vuex";
import { State } from "@/store/store";

import { BN } from "bn.js";
import { Web3AuthMPCCoreKit, IdTokenLoginParams, TssShareType, parseToken, getWebBrowserFactor, generateFactorKey, COREKIT_STATUS, keyToMnemonic, mnemonicToKey, UserInfo, MPCKeyDetails } from "@web3auth/mpc-core-kit";
import { EthereumSigningProvider } from "@web3auth/ethereum-mpc-provider";

import Web3 from "web3";

import { WEB3AUTH_CLIENT_ID, WEB3AUTH_VERIFIER, WEB3AUTH_NETWORK_ID, EVM_CHAIN_CONFIG } from "@/data/web3auth/constants";
import { getIdTokenFromSocialProvider, getSocialMFAFactorKey } from "./web3authModuleFunctions";

import store from "@/store/store";

let coreKitInstance: Web3AuthMPCCoreKit | null = null;
let evmProvider: EthereumSigningProvider | null = null;

type Web3AuthWallet = {
  accounts: Array<string> | null;
  balance: string | null;
  signedMessage: string | null;
};

export interface Web3AuthState {
  initializePromise: Promise<COREKIT_STATUS> | null;
  coreKitStatus: COREKIT_STATUS | null;
  userInfo: UserInfo | null;
  keyDetails: MPCKeyDetails | null;
  deviceFactor: string | null;
  lastObtainedFactor: string | null; //the last obtained factor in hex
  lastObtainedMnemonic: string | null;
  //backupFactors: Array<string>;

  web3authWallet: Web3AuthWallet;
}
export type Context = ActionContext<Web3AuthState, State>;

const getInitialState = (): Web3AuthState => {
  return {
    initializePromise: null,
    coreKitStatus: null,
    userInfo: null,
    keyDetails: null,
    deviceFactor: null,
    lastObtainedFactor: null,
    lastObtainedMnemonic: null,
    // backupFactors: []

    web3authWallet: {
      accounts: null,
      balance: null,
      signedMessage: null,
    },
  };
};

const web3authModule = {
  namespaced: true as boolean,
  state: (): Web3AuthState => getInitialState(),
  getters: {
    isWeb3AuthLoggedIn(state: Web3AuthState) {
      return state.coreKitStatus === COREKIT_STATUS.LOGGED_IN;
    },
    isWeb3AuthRequiredShare(state: Web3AuthState) {
      return state.coreKitStatus === COREKIT_STATUS.REQUIRED_SHARE;
    },
  },
  mutations: {
    setInitializePromise(state: Web3AuthState, initializePromise: Promise<COREKIT_STATUS>) {
      state.initializePromise = initializePromise;
    },
    resetWeb3AuthState(state: Web3AuthState) {
      Object.assign(state, getInitialState());
    },
    setCoreKitStatus(state: Web3AuthState, statusToSet: COREKIT_STATUS | null) {
      state.coreKitStatus = statusToSet;
    },
    setUserInfo(state: Web3AuthState, userInfoToSet: UserInfo | null) {
      state.userInfo = userInfoToSet;
    },
    setKeyDetails(state: Web3AuthState, keyDetailsToSet: MPCKeyDetails | null) {
      state.keyDetails = keyDetailsToSet;
    },
    setDeviceFactor(state: Web3AuthState, deviceFactorToSet: string | null) {
      state.deviceFactor = deviceFactorToSet;
    },
    setLastObtainedFactor(state: Web3AuthState, lastObtainedFactorToSet: string | null) {
      state.lastObtainedFactor = lastObtainedFactorToSet;
    },
    setLastObtainedMnemonic(state: Web3AuthState, lastObtainedMnemonicToSet: string | null) {
      state.lastObtainedMnemonic = lastObtainedMnemonicToSet;
    },
    setWalletAccounts(state: Web3AuthState, accounts: Array<string>) {
      state.web3authWallet.accounts = accounts;
    },
    setWalletBalance(state: Web3AuthState, balance: string) {
      state.web3authWallet.balance = balance;
    },
    setWalletSignedMessage(state: Web3AuthState, signedMessage: string) {
      state.web3authWallet.signedMessage = signedMessage;
    },
  },
  actions: {
    /* initialization and destruction */
    async initialize(context: Context): Promise<COREKIT_STATUS> {
      if (context.state.coreKitStatus) {
        context.dispatch("onWeb3AuthLoggedIn", undefined, { root: true });
        return context.state.coreKitStatus;
      }

      store.subscribe((mutation, state) => {
        switch (mutation.type) {
          case "web3auth/setCoreKitStatus": {
            if (context.state.coreKitStatus === COREKIT_STATUS.LOGGED_IN) {
              context.dispatch("getBalance"); //INFO: async call. Be careful!
              context.dispatch("getAccounts"); //INFO: async call. Be careful!
              context.dispatch("onWeb3AuthLoggedIn", undefined, { root: true });
            }
            break;
          }
          default:
            break;
        }
      });
      coreKitInstance = new Web3AuthMPCCoreKit({
        web3AuthClientId: WEB3AUTH_CLIENT_ID,
        web3AuthNetwork: WEB3AUTH_NETWORK_ID,
        setupProviderOnInit: false, // needed to skip the provider setup
        manualSync: true,

        // sessionTime: 10, //seconds
      });

      evmProvider = new EthereumSigningProvider({
        config: { chainConfig: EVM_CHAIN_CONFIG },
      });
      evmProvider.setupProvider(coreKitInstance);

      await coreKitInstance.init();
      context.commit("setCoreKitStatus", coreKitInstance.status);

      return coreKitInstance.status;
    },
    finish(context: Context) {
      coreKitInstance = null;
      evmProvider = null;
      context.commit("resetWeb3AuthState");
    },
    /* /initialization and destruction */

    /* login and required more shares to login section */
    async loginWithIdToken(context: Context, idToken: string) {
      if (!coreKitInstance) {
        throw new Error();
      }
      const parsedToken = parseToken(idToken);
      const idTokenLoginParams: IdTokenLoginParams = {
        verifier: WEB3AUTH_VERIFIER,
        verifierId: parsedToken.email,
        idToken,
      };
      



      console.log("idTokenLoginParams=", idTokenLoginParams);
      
      
      
      try {
        await coreKitInstance.loginWithJWT(idTokenLoginParams);
        if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
          await coreKitInstance.commitChanges(); // Needed for new accounts
        }
        context.commit("setCoreKitStatus", coreKitInstance.status);
        if (coreKitInstance.status === COREKIT_STATUS.REQUIRED_SHARE) {
          await context.dispatch("inputDeviceFactorIfExists");
        }
        if (coreKitInstance.status === COREKIT_STATUS.REQUIRED_SHARE) {
          //TODO: handle on ui
          console.warn("required more shares, please enter your backup factor key, or reset account [unrecoverable once reset, please use it with caution]");
        }
      }
      catch (error) {
        console.error(error);
      }
    },
    async loginWithSocialProvider(context: Context, socialProviderName: string) {
      const idToken = await getIdTokenFromSocialProvider(socialProviderName);

      await context.dispatch("loginWithIdToken", idToken);
    },
    async loginWithGoogleButtonCallback(context: Context, response: any) {
      //callback for one tap google button
      await context.dispatch("loginWithIdToken", response.credential);
    },
    async inputBackupFactorKey(context: Context, backupFactorKey: string) {
      //this function is used when web3auth requires more factors for login
      if (!coreKitInstance) {
        throw new Error();
      }
      if (!backupFactorKey) {
        throw new Error("backupFactorKey is empty!");
      }
      const factorKey = new BN(backupFactorKey, "hex");
      await coreKitInstance.inputFactorKey(factorKey);
      if (coreKitInstance.status === COREKIT_STATUS.REQUIRED_SHARE) {
        console.warn("required more shares even after inputing backup factor key, please enter your backup/ device factor key, or reset account [unrecoverable once reset, please use it with caution]");
      }
      context.commit("setCoreKitStatus", coreKitInstance.status);
    },
    async getDeviceFactor(context: Context) {
      //to display the factor to the user
      if (!coreKitInstance) {
        throw new Error();
      }
      const factorKey = await getWebBrowserFactor(coreKitInstance);
      context.commit("setDeviceFactor", factorKey);
      context.commit("setLastObtainedFactor", factorKey);
    },
    async inputDeviceFactor(context: Context) {
      //to send factor to web3auth when web3auth requesting factor for login
      await context.dispatch("getDeviceFactor");
      await context.dispatch("inputBackupFactorKey", context.state.deviceFactor);
    },
    async inputDeviceFactorIfExists(context: Context) {
      await context.dispatch("getDeviceFactor");
      if (context.state.deviceFactor) {
        await context.dispatch("inputBackupFactorKey", context.state.deviceFactor);
      } else {
        console.log("Tried to input device factor. Device factor does not exist! Use another share to login!");
      }
    },
    async getSocialFactor(context: Context, socialProviderName: string): Promise<string> {
      const socialFactor = await getSocialMFAFactorKey(socialProviderName);
      context.commit("setLastObtainedFactor", socialFactor);
      return socialFactor;
    },
    async inputSocialFactor(context: Context, socialProviderName: string) {
      const socialFactor = await context.dispatch("getSocialFactor", socialProviderName);
      await context.dispatch("inputBackupFactorKey", socialFactor);
    },
    //TODO: email phone factors
    mnemonicToHex(context: Context, mnemonicPhrase: string) {
      //TODO: maybe move to functions
      if (!coreKitInstance) {
        throw new Error();
      }
      const factorKey = mnemonicToKey(mnemonicPhrase);
      context.commit("setLastObtainedFactor", factorKey);
      return factorKey;
    },
    async inputMnemonicFactor(context: Context, mnemonicPhrase: string) {
      const factorKey = context.dispatch("mnemonicToHex", mnemonicPhrase);
      await context.dispatch("inputBackupFactorKey", factorKey);
    },
    async getBackupFactor(context: Context) {
      //TODO: user will be able to choose any factor them prefer
      const factorKey = await context.dispatch("getSocialFactor");
      context.commit("setLastObtainedFactor", factorKey);
      return factorKey;
    },
    /* /login and required more shares to login section */

    /* web3auth user account section */
    /* account information */
    getUserInfo(context: Context) {
      if (!coreKitInstance) {
        throw new Error();
      }
      const userInfo: UserInfo = coreKitInstance.getUserInfo();
      context.commit("setUserInfo", userInfo);
    },
    getKeyDetails(context: Context) {
      if (!coreKitInstance) {
        throw new Error();
      }
      const keyDetails: MPCKeyDetails = coreKitInstance.getKeyDetails();
      context.commit("setKeyDetails", keyDetails);
    },
    /* /account information */

    /* account actions */
    async enableMultiFactorAuthentication(context: Context) {
      if (!coreKitInstance) {
        throw new Error("coreKitInstance is not set");
      }
      const backupFactor = await context.dispatch("getBackupFactor");
      const factorKey = new BN(backupFactor, "hex");
      await coreKitInstance.enableMFA({ factorKey });

      if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
        await coreKitInstance.commitChanges();
      }
      console.log("MFA enabled, device factor stored in local store, deleted hashed cloud key, your backup factor key is associated with the firebase email password account in the app"); //TODO: display for user on ui
      context.commit("setCoreKitStatus", coreKitInstance.status);
      context.dispatch("getDeviceFactor");
    },
    async addAdditionalBackupFactor(context: Context, factorKey: string) {
      if (!coreKitInstance) {
        throw new Error();
      }
      await coreKitInstance.createFactor({
        shareType: TssShareType.RECOVERY,
        factorKey: new BN(factorKey, "hex"),
      });
      if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
        await coreKitInstance.commitChanges();
      }
      context.commit("setCoreKitStatus", coreKitInstance.status);
    },
    async addSocialFactor(context: Context) {
      const factorKey = await context.dispatch("getSocialFactor");
      context.dispatch("addAdditionalBackupFactor", factorKey);
    },
    async addMnemonicFactor(context: Context) {
      const factorKey = generateFactorKey();
      const factorKeyPrivate = factorKey.private.toString("hex");
      const factorKeyPrivateMnemonic = keyToMnemonic(factorKeyPrivate);
      context.commit("setLastObtainedFactor", factorKey);
      context.commit("setLastObtainedMnemonic", factorKeyPrivateMnemonic);
      await context.dispatch("addAdditionalBackupFactor", factorKeyPrivate);
    },
    async logout(context: Context) {
      if (!coreKitInstance) {
        throw new Error();
      }
      await coreKitInstance.logout();
      context.commit("setCoreKitStatus", coreKitInstance.status);
    },
    async criticalResetAccount(context: Context) {
      if (!coreKitInstance) {
        throw new Error("coreKitInstance is not set");
      }
      // if (selectedNetwork === WEB3AUTH_NETWORK.MAINNET) {
      //   throw new Error("reset account is not recommended on mainnet");
      // }
      await coreKitInstance.tKey.storageLayer.setMetadata({
        // eslint-disable-next-line
        privKey: new BN(coreKitInstance.metadataKey!, "hex"),
        input: { message: "KEY_NOT_FOUND" },
      });
      if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
        await coreKitInstance.commitChanges();
      }
      await context.dispatch("logout");
    },
    /* /account actions */
    /* /web3auth user account section */

    /* web3auth user wallet section */
    async getAccounts(context: Context): Promise<Array<string>> {
      if (!coreKitInstance || !evmProvider) {
        throw new Error();
      }
      const web3 = new Web3(evmProvider);

      // Get user's Ethereum public address
      const accounts = await web3.eth.getAccounts(); //TODO: save address in storage
      context.commit("setWalletAccounts", accounts);
      return accounts;
    },
    async getBalance(context: Context) {
      if (!coreKitInstance || !evmProvider) {
        throw new Error();
      }
      const web3 = new Web3(evmProvider);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0]; //TODO: not only the first one

      // Get user's balance in ether
      const balanceInWei = await web3.eth.getBalance(address); // Balance is in wei
      const balance = web3.utils.fromWei(balanceInWei, "ether");
      context.commit("setWalletBalance", balance);
      return balance;
    },
    async getChainId(context: Context): Promise<number> {
      if (!coreKitInstance || !evmProvider) {
        throw new Error();
      }
      const web3 = new Web3(evmProvider);
      const chainId = await web3.eth.getChainId();
      return Number(chainId);
    },
    async signMessage(context: Context, messageToSign: string): Promise<string> {
      console.log("web3authModule: signMessage: start");

      if (!coreKitInstance || !evmProvider) {
        throw new Error();
      }
      const web3 = new Web3(evmProvider);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const msgHash = web3.eth.accounts.hashMessage(messageToSign);
      const signedMessage = await web3.eth.sign(msgHash, fromAddress);

      context.commit("setWalletSignedMessage", signedMessage);
      return signedMessage as string;
    },
    /* /web3auth user wallet section */
  },
};
export default web3authModule;
