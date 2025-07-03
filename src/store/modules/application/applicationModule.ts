import { Themes, type Theme } from "@/utils/types/themes.types";
import type { ActionContext } from "vuex";
import type { State } from "@/store/store";
import applicationMutations from "@/data/store/application/applicationMutations.json";
export const signUpValues = { AFTER_SIGNUP: "AFTER_SIGNUP" };
export interface ApplicationState {
  isLoading: boolean; //TODO: rename to isLoadingOverlayVisible
  selectedTheme: Theme;
  flags: any;
  activePage: string;
}

type Context = ActionContext<ApplicationState, State>;

const applicationModule = {
  namespaced: true as boolean,
  state: (): ApplicationState => ({
    isLoading: false,
    selectedTheme: Themes.DEFAULT,
    flags: {
      signUp: null,
    },
    activePage: "AICHAT", // todo: from what page app must be started?
  }),
  mutations: {
    setSelectedTheme(state: ApplicationState, theme: Theme): void {
      state.selectedTheme = theme;
    },
    setIsLoading(state: ApplicationState, payload: boolean): void {
      state.isLoading = payload;
    },
    setFlag(state: ApplicationState, { flagName, flagValue }: { flagName: string; flagValue: any }) {
      state.flags[flagName] = flagValue;
    },
    setActivePage(state: ApplicationState, { pageName }: { pageName: string }): void {
      state.activePage = pageName;
    }
  },
  actions: {
    setSelectedTheme(context: Context, payload: Theme): void {
      context.commit(applicationMutations.SET_SELECTED_THEME, payload);
    },
    async setIsLoading(context: Context, payload: boolean): Promise<void> {
      context.commit(applicationMutations.SET_IS_LOADING, payload);
    },
    setFlag(context: Context, { flagName, flagValue }: { flagName: string; flagValue: any }) {
      context.commit(applicationMutations.SET_FLAG, { flagName, flagValue });
    },
    setActivePage(context: Context, pageName: string): void {
      context.commit(applicationMutations.SET_ACTIVE_PAGE, { pageName });
    }
  },
};

export default applicationModule;
