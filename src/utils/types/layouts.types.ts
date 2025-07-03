export const enum AppLayouts {
  DEFAULT = "DEFAULT",
  AUTH = "AUTH",
  ERROR = "ERROR",
}

export const AppLayoutToFileMap: Record<AppLayouts, string> = {
  DEFAULT: "default/AppLayoutDefault.vue",
  AUTH: "auth/AppLayoutAuth.vue",
  ERROR: "error/AppLayoutError.vue",
};
