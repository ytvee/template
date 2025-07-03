export enum DialogTemplateNames {
  /* common */
  PUT_YOU_COMPONENT_IDENTIFICATOR_HERE = "PUT_YOU_COMPONENT_IDENTIFICATOR_HERE",
  /* /common */

  /* auth */
  ACCESS_RIGHTS = "ACCESS_RIGHTS",
  /* /auth */

  /* /audioeditor */
  AI_CHAT = "AI_CHAT",
  IMPORTING_SEGMENT = "IMPORTING_SEGMENT",
  /* /audioeditor */
}

export const DialogTemplateComponents: Record<DialogTemplateNames, any> = {
  PUT_YOU_COMPONENT_IDENTIFICATOR_HERE: {
    // component: ()=>import("@/components/structure/modals/path-to-your-component"),
    // predefinedDialogTemplateProps: {
    //   default-props-for-this-component. These porpse will be passed to component via modalProps
    // },
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
