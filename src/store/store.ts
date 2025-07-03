import { ActionContext, createStore } from "vuex";
import storeModules from "@/data/store/storeModules.json";
import userModule, { UserState } from "./modules/user/userModule";
import applicationModule, { ApplicationState } from "./modules/application/applicationModule";
import modalModule, { ModalState } from "./modules/modal/modalModule";
import dataModule, { DataState } from "./modules/data/dataModule";
import notificationsModule, { NotificationsState } from "./modules/notifications/notificationsModule";
import localNotificationsModule, { NotificationsState as LocalNotificationsState } from "./modules/localnotifications/notificationsModule";
import _ from "lodash";

import walletModule, { WalletState, WalletToConnect } from "./modules/wallet/walletModule";
import audioEditorModule, { AudioEditorState } from "@audioeditor/store/modules/audioEditorModule";
import web3authModule, { Web3AuthState } from "./modules/web3auth/web3authModule";
import { BlockchainIdentifiers, WalletIdentifiers } from "@/data/wallet/walletServiceConstants";
import routerPaths from "@/data/router/path/routerPaths.json";
import router from "@/router";

export interface State {
  user: UserState;
  application: ApplicationState;
  modal: ModalState;
  data: DataState;
  notifications: NotificationsState;
  localNotification: LocalNotificationsState;
  wallet: WalletState;
  audioEditor: AudioEditorState;
  web3auth: Web3AuthState;
}
export type Context = ActionContext<State, State>;

const initialStoreModules = {
  user: userModule,
  application: applicationModule,
  modal: modalModule,
  data: dataModule,
  notifications: notificationsModule,
  localNotifications: localNotificationsModule,
  wallet: walletModule,
  audioEditor: audioEditorModule,
  web3auth: web3authModule,
};

function fillModulesStatesWithInitialValues(context: Context) {
  _.forOwn(initialStoreModules, (value, key) => {
    const stateModule = typeof value.state === "function" ? value.state() : value.state;
    context.state[key] = _.cloneDeep(stateModule);
  });
}

const store = createStore<State>({
  modules: _.cloneDeep(initialStoreModules),
  actions: {
    /* public actions */
    async initializeState(context: Context) {
      /* call here actions of mudules to initialize them */
      context.dispatch("wallet/initializeWallets"); //INFO: async call. Be careful!
      await context.dispatch("user/initializeUser");
    },
    async finishState(context: Context) {
      /* call here actions of mudules before store will be cleared */
      try {
        await context.dispatch("user/finishUser");
      } catch (error) {
        console.error(error);
      }
      try {
        await context.dispatch("wallet/finishWallets");
      } catch (error) {
        console.error(error);
      }
      try {
        await context.dispatch("web3auth/finish");
      } catch (error) {
        console.error(error);
      }
    },
    async reInitializeState(context: Context) {
      await context.dispatch("finishState");
      window.localStorage.clear(); //TODO: remake
      window.sessionStorage.clear();
      fillModulesStatesWithInitialValues(context);
      await context.dispatch("initializeState");
    },
    /* /public actions */

    /* event like actions. Helpful for connection sustenance between store modules */

    /* Application initialization */
    async afterAuthentication(context: Context, { idToken }: { idToken: string }) {
      await context.dispatch("user/afterAuthentication");
    },
    async onUserObtainedFromBackend(context: Context) {
      context.dispatch("wallet/loadWalletsFromBackend");
    },
    async onWeb3AuthLoggedIn(context: Context) {
      console.log("onWeb3AuthLoggedIn: start");
      const payload: WalletToConnect = {
        blockchainIdentifier: BlockchainIdentifiers.EVM,
        walletIdentifier: WalletIdentifiers.WEB3AUTH,
      };
      await context.dispatch("wallet/connectWallet", payload); //INFO: Async call! //TODO: uncomment after debug
      context.dispatch("wallet/updateWeb3AuthWalletBalance");
    },
    /* /Application initialization */

    /* Application finishing */
    async beforeUserSignOut(context: Context) {
      if (context.state.web3auth.coreKitStatus) {
        await context.dispatch("web3auth/logout");
      }
    },
    async afterUserSignOut(context: Context) {
      await context.dispatch("reInitializeState");
      router.push(routerPaths.LOGIN);
    },
    /* /Application finishing */
    /* /event like actions */

    /* helpers */

    /* /helpers */
  },
});

export default store;
