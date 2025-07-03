export const enum AppLayouts {
  DEFAULT = "DEFAULT",
  AUTH = "AUTH",
  ERROR = "ERROR",
  STARTPAGE = "STARTPAGE",
  FORUM_TOPIC = "FORUM_TOPIC",
}

export const AppLayoutToFileMap: Record<AppLayouts, string> = {
  DEFAULT: "default/AppLayoutDefault.vue",
  AUTH: "auth/AppLayoutAuth.vue",
  ERROR: "error/AppLayoutError.vue",
  STARTPAGE: "startpage/AppLayoutLanding.vue",
  FORUM_TOPIC: "forum/AppLayoutTopic.vue",
};
