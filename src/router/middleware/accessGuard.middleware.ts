import store from "@/store/store";
import storeModules from "@/data/store/storeModules.json";
import routerPaths from "@/data/router/path/routerPaths.json";
import AuthorizationService from "@/services/authorizationService";
import type { RouteLocationNormalized } from "vue-router";
import { RouteNames } from "@/utils/types/router.types";

const accessGuardMiddleware = async (to: RouteLocationNormalized) => {
  console.log("accessGuardMiddleware window.location=", window.location, "to=", to);

  const isLoggedIn: boolean = store.getters[`${storeModules.USER}/isLoggedIn`];

  if (isLoggedIn || to.path === routerPaths.NEW_AUTHORIZATION) {
    await store.dispatch(`${storeModules.APPLICATION}/setActivePage`, to.name);

    return;
  }

  try {
    await store.dispatch(`${storeModules.APPLICATION}/setIsLoading`, true);

    const authSession = await AuthorizationService.getCurrentAuthSession();

    await store.dispatch(`${storeModules.APPLICATION}/setActivePage`, to.name);
    store.commit(`${storeModules.USER}/updateUserSession`, authSession);
  } catch (error: any) {
    console.error(error.message);

    store.commit(`${storeModules.USER}/resetSession`);

    await store.dispatch(`${storeModules.APPLICATION}/setActivePage`, RouteNames.NEW_AUTHORIZATION);

    return {
      name: RouteNames.NEW_AUTHORIZATION,
    };
  } finally {
    await store.dispatch(`${storeModules.APPLICATION}/setIsLoading`, false);
  }
};

export default accessGuardMiddleware;
