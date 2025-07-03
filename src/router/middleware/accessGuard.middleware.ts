import store from "@/store/store";
import { RouteNames } from "@/utils/types/router.types";
import { AccessScopes } from "@/utils/types/auth.types";
import type { RouteLocationNormalized } from "vue-router";
import modalPlugin from "@/data/plugins/modal/modalPlugin.json";

const authOnlyPages = [RouteNames.LOGIN, RouteNames.SIGN_UP];

function isTryingToAccessUnathorized(to: RouteLocationNormalized, isLoggedIn: boolean) {
  const { accessScopes } = to.meta;
  if (!accessScopes) return;
  return accessScopes.includes(AccessScopes.LOGGED_IN) && !isLoggedIn;
}

function isTryingToAccessLoginAuthorized(to: RouteLocationNormalized, isLoggedIn: boolean) {
  const { name } = to;
  const isPageNameEqual = (pageName: string) => {
    return pageName === name;
  };
  return authOnlyPages.some(isPageNameEqual) && isLoggedIn;
}

// export async function accessGuardMiddleware(to: RouteLocationNormalized) {
//   //INFO: we prevent to trigger Amlify end of auth flow when we call the oidc provider (our OIDC wrapper) on the same domain as our application.
//   console.log("accessGuardMiddleware window.location=", window.location, "to=", to);
//   const isLoggedIn = Boolean((await completeInflightFlowAndGetTokensFromAmplify()).idToken);
//   // const isLoggedIn = store.getters["user/isLoggedIn"];

//   // const isLoggedIn = false;

//   store.dispatch(modalPlugin.MODAL_SET_MODAL_VISIBILITY, false);

//   if (isTryingToAccessUnathorized(to, isLoggedIn)) {
//     return { name: RouteNames.LOGIN };
//   }
//   if (isTryingToAccessLoginAuthorized(to, isLoggedIn)) {
//     return { name: RouteNames.ARTISTS };
//   }

//   return;
// }
