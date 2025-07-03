export enum DialogTemplateNames {
  /* common */
  INFORMATION_MESSAGE = "INFORMATION_MESSAGE",
  PUT_YOU_COMPONENT_IDENTIFICATOR_HERE = "PUT_YOU_COMPONENT_IDENTIFICATOR_HERE",
  /* /common */

  /* auth */
  RESET_PASSWORD = "RESET_PASSWORD",
  FILL_USER_NAME_MODAL = "FILL_USER_NAME_MODAL",
  TERMS_USE = "TERMS_USE",
  PRIVACY_POLICY = "PRIVACY_POLICY",
  ACCESS_RIGHTS = "ACCESS_RIGHTS",
  /* /auth */

  /* /audioeditor */
  AI_CHAT = "AI_CHAT",
  IMPORTING_SEGMENT = "IMPORTING_SEGMENT",
  /* /audioeditor */
}

export const DialogTemplateComponents: Record<DialogTemplateNames, any> = {
  INFORMATION_MESSAGE: {
    component: () => import("@/components/common/info/informationMessage/InformationMessage.vue"),
    predefinedDialogTemplateProps: {},
  },
  PUT_YOU_COMPONENT_IDENTIFICATOR_HERE: {
    // component: ()=>import("@/components/structure/modals/path-to-your-component"),
    // predefinedDialogTemplateProps: {
    //   default-props-for-this-component. These porpse will be passed to component via modalProps
    // },
  },
  RESET_PASSWORD: {
    component: () => import("@/components/structure/modals/auth/ResetPasswordModal.vue"),
    predefinedDialogTemplateProps: {},
  },
  FILL_USER_NAME_MODAL: {
    component: () => import("@/components/structure/modals/user/FillUserNameModal.vue"),
  },
  TERMS_USE: {
    component: () => import("@/components/structure/modals/info/TermsUse.vue"),
  },
  PRIVACY_POLICY: {
    component: () => import("@/components/structure/modals/info/PrivacyPolicy.vue"),
  },
  AI_CHAT: {
    component: () => import ("@/audioeditor/components/modals/AIChat.vue"),
  },
  IMPORTING_SEGMENT: {
    component: () => import ("@/audioeditor/components/modals/aichat/SegmentImportToDaw.vue"),
  },
  ACCESS_RIGHTS: {
    component: () => import("@audioeditor/components/modals/AccessRightsForm.vue"),
  },
};
