import NProgress from "nprogress";
import routerPaths from "@/data/router/path/routerPaths.json";
import accessGuardMiddleware from "./middleware/accessGuard.middleware";
import { loadLayoutMiddleware } from "@/router/middleware/loadLayout.middleware";
import { createRouter, createWebHistory } from "vue-router";
import { AppLayouts } from "@/utils/types/layouts.types";
import { RouteNames } from "@/utils/types/router.types";
import { AccessScopes } from "@/utils/types/auth.types";

NProgress.configure({ minimum: 0.1, showSpinner: false });

const authRoutes = [
  {
    path: routerPaths.START_PAGE,
    name: RouteNames.STARTPAGE,
    component: () => import("@/pages/startpage/LandingPage.vue"),
    meta: {
      layout: AppLayouts.STARTPAGE,
    },
  },
  {
    path: routerPaths.NEW_AUTHORIZATION,
    name: RouteNames.NEW_AUTHORIZATION,
    component: () => import("@/pages/newAuth/Authorization.vue"),
    meta: {
      layout: AppLayouts.AUTH,
    },
  },
];

const JGOIDCRoutes = [
  {
    path: routerPaths.JG_TWITTER_OIDC_AUTHORIZATION,
    name: RouteNames.JG_TWITTER_OIDC_AUTHORIZATION,
    component: () => import("@/pages/jgoidc/JGTwitterOIDCAuthorizationPage.vue"),
    meta: {
      layout: AppLayouts.AUTH,
      category: "JGOIDCRoutes",
    },
  },
  {
    path: routerPaths.JG_TWITTER_OIDC_CALLBACK,
    name: RouteNames.JG_TWITTER_OIDC_CALLBACK,
    component: () => import("@/pages/jgoidc/JGTwitterOIDCCallbackPage.vue"),
    meta: {
      layout: AppLayouts.AUTH,
      category: "JGOIDCRoutes",
    },
  },
  {
    path: routerPaths.JG_METAMASK_OIDC_AUTHORIZATION,
    name: RouteNames.JG_METAMASK_OIDC_AUTHORIZATION,
    component: () => import("@/pages/jgoidc/JGMetamaskOIDCAuthorizationPage.vue"),
    meta: {
      layout: AppLayouts.AUTH,
      category: "JGOIDCRoutes",
    },
  },
];
export const JGOIDCRoutesPaths = JGOIDCRoutes.map((route) => route.path);

const artistRoutes = [
  {
    path: "/",
    name: RouteNames.AICHAT,
    component: () => import("@/pages/aiChat/AiChatPage/AiChatPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      AccessScopes: [AccessScopes.LOGGED_IN],
    },
  },
  {
    path: routerPaths.ARTIST_ID,
    name: RouteNames.ARTIST,
    component: () => import("@/pages/artist/ArtistPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      accessScopes: [AccessScopes.LOGGED_IN],
    },
  },
  {
    path: routerPaths.ARTIST_NEW,
    name: RouteNames.SETTINGS_ARTIST,
    component: () => import("@/pages/artist/SettingsArtistPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      accessScopes: [AccessScopes.LOGGED_IN],
    },
  },
  {
    path: routerPaths.ARTIST_EDIT_ID,
    name: RouteNames.SETTINGS_ARTIST_EDIT,
    component: () => import("@/pages/artist/SettingsArtistPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      accessScopes: [AccessScopes.LOGGED_IN],
    },
  },
  {
    path: routerPaths.PROFILE_PAGE_EDIT,
    name: RouteNames.SETTINGS_CREATOR,
    component: () => import("@/pages/user/SettingsUserPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      accessScopes: [AccessScopes.LOGGED_IN],
    },
  },
  {
    path: routerPaths.ARTISTS,
    name: RouteNames.ARTISTS,
    component: () => import("@/pages/artist/ArtistsPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      accessScopes: [AccessScopes.LOGGED_IN],
    },
  },
  {
    path: routerPaths.PROFILE_PAGE,
    name: RouteNames.PROFILE_PAGE,
    component: () => import("@/pages/user/SettingsUserPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      accessScopes: [AccessScopes.LOGGED_IN],
    },
  },
  {
    path: routerPaths.MY_TEAMS,
    name: RouteNames.MY_TEAMS,
    component: () => import("@/pages/artist/CreatorTeams.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      accessScopes: [AccessScopes.LOGGED_IN],
    },
  },
];

const forumRoutes = [
  {
    path: routerPaths.FORUM_ID,
    name: RouteNames.FORUM_THREAD,
    component: () => import("@/pages/forum/ForumThreadPage.vue"),
    meta: {
      layout: AppLayouts.FORUM_TOPIC,
      accessScopes: [AccessScopes.LOGGED_IN],
    },
  },
];

const adminPanelRoutes = [
  {
    path: routerPaths.ADMIN_PANEL,
    name: RouteNames.ADMIN_PANEL,
    component: () => import("@/pages/adminPanel/AdminPanelPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      accessScopes: [AccessScopes.LOGGED_IN],
    },
  },
];

const soundSplitterRoutes = [
  {
    path: routerPaths.SOUND_SPLITTER,
    name: RouteNames.SOUND_SPLITTER,
    component: () => import("@/pages/soundsplitter/SoundSplitterPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      AccessScopes: [AccessScopes.LOGGED_IN],
    },
  },
];

const aiChatRoutes = [
  {
    path: routerPaths.AICHAT,
    name: RouteNames.AICHAT,
    component: () => import("@/pages/aiChat/AiChatPage/AiChatPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      AccessScopes: [AccessScopes.LOGGED_IN],
    },
  },
];

const audioStreamRoutes = [
  {
    path: routerPaths.AUDIO_STREAM,
    name: RouteNames.AUDIO_STREAM,
    component: () => import("@/pages/audioStream/AudioStreamPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      AccessScopes: [AccessScopes.LOGGED_IN],
    },
  },
];

const web3authRoutes = [
  {
    path: routerPaths.WEB3AUTH,
    name: RouteNames.WEB3AUTH,
    component: () => import("@/pages/web3auth/Web3AuthPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
      AccessScopes: [AccessScopes.LOGGED_IN],
    },
  },
];

const errorRoutes = [
  {
    path: routerPaths.ACCESS_ERROR,
    name: RouteNames.ACCESS_ERROR,
    component: () => import("@/pages/auth/LoginPage.vue"),
    meta: {
      layout: AppLayouts.ERROR,
    },
  },
  {
    path: routerPaths.PATH_MATCH,
    name: RouteNames.NOT_FOUND,
    component: () => import("@/pages/error/NotFoundPage.vue"),
    meta: {
      layout: AppLayouts.ERROR,
    },
  },
];

const testRoutes = [
  {
    path: routerPaths.TEST,
    name: RouteNames.TEST,
    component: () => import("@/pages/test/TestPage.vue"),
    meta: {
      layout: AppLayouts.DEFAULT,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [...authRoutes, ...JGOIDCRoutes, ...artistRoutes, ...forumRoutes, ...soundSplitterRoutes, ...aiChatRoutes, ...audioStreamRoutes, ...errorRoutes, ...testRoutes, ...adminPanelRoutes, ...web3authRoutes],
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});
router.beforeEach(accessGuardMiddleware);
router.beforeEach(loadLayoutMiddleware);
router.afterEach(() => {
  NProgress.done();
});
export default router;
