import { ActionContext, createStore } from "vuex";
// import VuexPersistence from "vuex-persist";
import storeModules from "@/data/store/storeModules.json";
import userModule, { UserState } from "./modules/user/userModule";
import applicationModule, { ApplicationState } from "./modules/application/applicationModule";
import modalModule, { ModalState } from "./modules/modal/modalModule";
import dataModule, { DataState } from "./modules/data/dataModule";
import notificationsModule, { NotificationsState } from "./modules/notifications/notificationsModule";
import localNotificationsModule, { NotificationsState as LocalNotificationsState } from "./modules/localnotifications/notificationsModule";
import _ from "lodash";

import audioEditorModule, { AudioEditorState } from "@audioeditor/store/modules/audioEditorModule";
import routerPaths from "@/data/router/path/routerPaths.json";
import router from "@/router";

export interface State {
  user: UserState;
  application: ApplicationState;
  modal: ModalState;
  data: DataState;
  notifications: NotificationsState;
  localNotification: LocalNotificationsState;
  audioEditor: AudioEditorState;
}
export type Context = ActionContext<State, State>;

const initialStoreModules = {
  user: userModule,
  application: applicationModule,
  modal: modalModule,
  data: dataModule,
  notifications: notificationsModule,
  localNotifications: localNotificationsModule,
  audioEditor: audioEditorModule,
};

function fillModulesStatesWithInitialValues(context: Context) {
  _.forOwn(initialStoreModules, (value, key) => {
    const stateModule = typeof value.state === "function" ? value.state() : value.state;
    // TODO fix
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    context.state[key] = _.cloneDeep(stateModule);
  });
}

const store = createStore<State>({
  modules: _.cloneDeep(initialStoreModules),
  //WARNING: VuexPersistence does not work with Map (even in modules that are not stored via this plugin). It breaks work of AudioEditor module. Be careful! https://github.com/robinvdvleuten/vuex-persistedstate/issues/210
  // plugins: [vuexCacheCookie.plugin],
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
    /* /Application initialization */
  },
});

export default store;
