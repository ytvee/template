import userMutations from "@/data/store/user/userMutations.json";
import type { AccessScopes } from "@/utils/types/auth.types";
import type { User } from "@/utils/types/user.types";
import type { UserRole } from "@/utils/types/roles.types";
import type { State } from "@/store/store";
import type { ActionContext } from "vuex";
import { IAuthSession } from "@/services/authorizationService";

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
    getCurrentUserRoles(state: UserState): UserRole[] | undefined {
      return state.currentUser?.roles;
    },
    hasRole:
      (state: UserState) =>
      (userRole: string): boolean | undefined => {
        return state.currentUser?.roles?.includes(userRole);
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
  },
};

export default userModule;
