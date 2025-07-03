import store from "@/store/store";
import { RouteNames } from "@/utils/types/router.types";
import { AccessScopes } from "@/utils/types/auth.types";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import modalPlugin from "@/data/plugins/modal/modalPlugin.json";

const authOnlyPages = [RouteNames.NEW_AUTHORIZATION];

function isTryingToAccessUnauthorized(to: RouteLocationNormalized, isLoggedIn: boolean): boolean {
  const { accessScopes } = to.meta;
  if (!accessScopes) return false;
  return accessScopes.includes(AccessScopes.LOGGED_IN) && !isLoggedIn;
}

function isTryingToAccessLoginAuthorized(to: RouteLocationNormalized, isLoggedIn: boolean): boolean {
  return authOnlyPages.includes(to.name as RouteNames) && isLoggedIn;
}

export function accessGuardMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const isLoggedIn = store.getters["user/isLoggedIn"] as boolean;

  store.dispatch(modalPlugin.MODAL_SET_MODAL_VISIBILITY, false);

  if (isTryingToAccessUnauthorized(to, isLoggedIn)) {
    next({ name: RouteNames.NEW_AUTHORIZATION });
    return;
  }

  if (isTryingToAccessLoginAuthorized(to, isLoggedIn)) {
    next({ name: RouteNames.SOUND_SPLITTER });
    return;
  }

  next();
}
