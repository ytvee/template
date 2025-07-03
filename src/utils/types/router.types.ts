import type { VueElement } from "vue";
import type { AppLayouts } from "@/utils/types/layouts.types";
import type { AccessScopes } from "@/utils/types/auth.types";

declare module "vue-router" {
  interface RouteMeta {
    layout?: AppLayouts;
    layoutComponent?: VueElement;
    accessScopes?: AccessScopes[];
  }
}

export const enum RouteNames {
  NOT_FOUND = "NOT_FOUND",
  SOUND_SPLITTER = "SOUND_SPLITTER",
  AICHAT = "AICHAT",
  NEW_AUTHORIZATION = "NEW_AUTHORIZATION",
}
