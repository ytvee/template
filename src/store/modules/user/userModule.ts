import userMutations from "@/data/store/user/userMutations.json";
import type { AccessScopes } from "@/utils/types/auth.types";
import type { User } from "@/utils/types/user.types";
import type { UserRole } from "@/utils/types/roles.types";
import type { State } from "@/store/store";
import type { ActionContext } from "vuex";

// import { ApiPlugin } from "@/plugins/api/ApiPlugin";
import { LoadPlugin } from "@/plugins/load/LoadPlugin";
// import { completeInflightFlowAndGetTokensFromAmplify, refreshCognitoTokens, signOutWithCognito } from "@/utils/cognito/cognitoUtils";
import { CognitoLocalStorageSubEntryName, getLocalStorageSubEntry, LocalStorageEntryName } from "@/utils/browserStorages/browserStoragesUtils";
import routerPaths from "@/data/router/path/routerPaths.json";
import router from "@/router";
import { IAuthSession } from "@/services/authorizationService";
// const apiPlugin = ApiPlugin.getInstance();

type SignUpStep = { name: string; data: object };

export interface UserState {
  isLoggedIn: boolean;
  token: string;
  currentUser: User;
  rights: AccessScopes[];
  isNeedFinalSignUp: boolean;
  finalSignUpSteps: SignUpStep[];
  isAfterArtistCreation: boolean;
}

type Context = ActionContext<UserState, State>;

const userModule = {
  namespaced: true as boolean,
  state: (): UserState => ({
    isLoggedIn: false,
    token: "",
    currentUser: {},
    rights: [],
    isNeedFinalSignUp: false,
    finalSignUpSteps: {} as SignUpStep[],
    isAfterArtistCreation: false,
  }),
  getters: {
    isLoggedIn(state: UserState): boolean {
      return state.isLoggedIn;
    },
    getEmail(state: UserState): string | undefined {
      return state.currentUser.email;
    },
    getUserId(state: UserState): number | undefined {
      return state.currentUser?.id;
    },
    getUserToken(state: UserState): string {
      return state.token;
    },
    getCurrentUserName(state: UserState): string | undefined {
      return state.currentUser?.name;
    },
    getCurrentUserPreviewImage(state: UserState): string {
      return state.currentUser?.logoURI || "";
    },
    getCurrentUserTeam(state: UserState): User[] | undefined {
      return state.currentUser?.members;
    },
    getCurrentUserBioInformation(state: UserState): string | undefined {
      return state.currentUser?.description;
    },
    getCurrentUserLinks(state: UserState): object[] | undefined {
      return state.currentUser?.links;
    },
    getCurrentUserRoles(state: UserState): UserRole[] | undefined {
      return state.currentUser?.roles;
    },
    hasRole:
      (state: UserState) =>
      (userRole: string): boolean | undefined => {
        return state.currentUser?.roles?.includes(userRole);
      },
    getIsNeedFinalSignUp(state: UserState): boolean {
      return state.isNeedFinalSignUp;
    },
    getFinalSignUpSteps(state: UserState): SignUpStep[] {
      return state.finalSignUpSteps;
    },
  },
  mutations: {
    updateUserSession(state: UserState, payload: IAuthSession): void {
      state.isLoggedIn = true;

      state.currentUser.email = payload.email;
      state.token = payload.token;
    },
    resetSession(state: UserState): void {
      state.isLoggedIn = false;
      state.token = "";
      state.currentUser = {};
    },
    setEmail(state: UserState, email: string): void {
      console.log("UPDATE USER EMAIL: ", email);
      
      state.currentUser.email = email;
    },
    setCurrentUser(state: UserState, user: User): void {
      state.currentUser = user;
    },
    setIsLoggedIn(state: UserState, isLoggedIn: boolean) {
      state.isLoggedIn = isLoggedIn;
    },
    setIsNeedFinalSignUp(state: UserState, isNeedFinalSignUp: boolean): void {
      state.isNeedFinalSignUp = isNeedFinalSignUp;
    },
    setFinalSignUpSteps(state: UserState, finalSignUpSteps: SignUpStep[]): void {
      state.finalSignUpSteps = finalSignUpSteps;
    },
    setIsAfterArtistCreation(state: UserState, payload: boolean): void {
      state.isAfterArtistCreation = payload;
    },
  },
  actions: {
    /* initialization and finishing */
    // async initializeUser(context: Context): Promise<boolean> {
    //   console.log("initializeUser: start");

    //   const isLoggedIn = Boolean((await completeInflightFlowAndGetTokensFromAmplify()).idToken);
    //   console.log("isLoggedIn=", isLoggedIn);

    //   if (isLoggedIn) {
    //     await context.dispatch("afterAuthentication");
    //   } else {
    //     await context.dispatch("afterUnAuthentication");
    //   }
    //   // context.dispatch(userActions.INITIALIZE_VARS);
    //   console.log("initializeUser: end");
    //   return context.state.isLoggedIn;
    // },
    // async signOutUser(context: Context): Promise<void> {
    //   await context.dispatch("beforeUserSignOut", undefined, { root: true });
    //   await signOutWithCognito();
    //   await context.dispatch("afterUserSignOut", undefined, { root: true });
    // },
    async finishUser(context: Context) {
      //in this action you can cleanly terminate the user module before the storage is reset
    },
    /* /initialization and finishing */

    /* auth */
    // async afterAuthentication(context: Context) {
    //   console.log("afterAuthentication: start");

    //   context.dispatch("setIsLoggedIn", true);
    //   await apiPlugin.autoConfigure();
    //   await context.dispatch("getUserFromBackend");
    // },
    async afterUnAuthentication(context: Context) {
      context.dispatch("setIsLoggedIn", false);
    },
    /* /auth */

    /* network interaction */
    // async getUserFromBackend(context: Context) {
    //   try {
    //     await LoadPlugin.load(async () => {
    //       const resdata = await apiPlugin.user.getCurrentUser();
    //       const user = resdata.data.data.user;
    //       context.commit("setCurrentUser", user);
    //     });
    //     context.dispatch("onUserObtainedFromBackend", undefined, {
    //       root: true,
    //     });
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    /* /network interaction */

    /**
     * The purpose of the action is to update the user after editing. Calling this action instead of the user update endpoint will ensure that the user changes on frontend is not missed.
     */
    // async editUser(context: Context, payload: any) {
    //   await ApiPlugin.getInstance().user.editUser(payload);
    //   await context.dispatch("getUserFromBackend");
    // },

    setIsLoggedIn(context: Context, payload: boolean): void {
      //TODO: maybe remove
      context.commit(userMutations.SET_IS_LOGGED_IN, payload);
    },
    setIsNeedFinalSignUp(context: Context, payload: boolean): void {
      //TODO: remove depricated
      context.commit(userMutations.SET_IS_NEED_FINAL_SIGN_UP, payload);
    },
    setFinalSignUpSteps(context: Context, payload: SignUpStep[]): void {
      //TODO: remove depricated
      context.commit(userMutations.SET_FINAL_SIGN_UP_STEPS, payload);
    },
    setIsAfterArtistCreation(context: Context, payload: boolean): void {
      //TODO: maybe remove
      context.commit(userMutations.SET_IS_AFTER_ARTIST_CREATION, payload);
    },
  },
};

export default userModule;
