import { createRouter, createWebHistory } from "vue-router";
import { loadLayoutMiddleware } from "@/router/middleware/loadLayout.middleware";
import { RouteNames } from "@/utils/types/router.types";
import { AppLayouts } from "@/utils/types/layouts.types";
import { AccessScopes } from "@/utils/types/auth.types";
import routerPaths from "@/data/router/path/routerPaths.json";
import NProgress from "nprogress";

NProgress.configure({ minimum: 0.1, showSpinner: false });

const authRoutes = [
  {
    path: routerPaths.NEW_AUTHORIZATION,
    name: RouteNames.NEW_AUTHORIZATION,
    component: () => import("@/pages/newAuth/Authorization.vue"),
    meta: {
      layout: AppLayouts.AUTH,
      accessScopes: [AccessScopes.ARTIST_CREATE],
    },
  },
];

const applicationRoutes = [
  {
    path: routerPaths.SOUND_SPLITTER,
    name: RouteNames.SOUND_SPLITTER,
    component: () => import("@/pages/soundsplitter/SoundSplitterPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      // AccessScopes: [AccessScopes.LOGGED_IN],
    },
  },
  {
    path: routerPaths.AICHAT,
    name: RouteNames.AICHAT,
    component: () => import("@/pages/aiChat/AiChatPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      // AccessScopes: [AccessScopes.LOGGED_IN],
    },
  },
];

const errorRoutes = [
  {
    path: routerPaths.PATH_MATCH,
    name: RouteNames.NOT_FOUND,
    component: () => import("@/pages/error/NotFoundPage.vue"),
    meta: {
      layout: AppLayouts.ERROR,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    ...applicationRoutes,
    ...authRoutes,
    ...errorRoutes,
  ],
});

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    NProgress.start();
  }
  next();
});
// router.beforeEach(accessGuardMiddleware);
router.beforeEach(loadLayoutMiddleware);
router.afterEach(() => {
  NProgress.done();
});
export default router;
