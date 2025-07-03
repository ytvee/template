import { defineAsyncComponent, type App, type Component } from "vue";
import { DialogTemplateNames, DialogTemplateComponents } from "@/data/modal/constants";
import store from "@/store/store";

export type ModalOptions = {
  isNonClosableByClickOnPeriphery?: boolean;
  // useLazyLoadForComponent?: boolean; //TODO:
};
export class ModalPlugin {
  static instance: ModalPlugin | null = null;
  constructor() {
    if (ModalPlugin.instance) {
      return ModalPlugin.instance;
    }
    ModalPlugin.instance = this;
    return ModalPlugin.instance;
  }
  public openModalWithComponent(modalComponent: () => Promise<Component>, modalComponentProps?: unknown, options?: ModalOptions) {
    const component = defineAsyncComponent(modalComponent);

    const modalPayload = {
      modalComponent: component,
      modalComponentProps,
      modalOptions: options,
    };

    store.dispatch("modal/openModal", modalPayload);
  }
  public openModalWithName(dialogTemplateName: DialogTemplateNames, dialogTemplateProps?: object, options?: ModalOptions) {
    console.log("openModalWithName: start");
    const dialogTemplate = DialogTemplateComponents[dialogTemplateName];
    const predefinedDialogTemplateProps = dialogTemplate.predefinedDialogTemplateProps;

    this.openModalWithComponent(dialogTemplate.component, { ...predefinedDialogTemplateProps, ...dialogTemplateProps }, options);
  }
  public close() {
    store.dispatch("modal/closeModal");
  }
}
export default {
  install: (app: App): void => {
    app.config.globalProperties.$modal = new ModalPlugin();
  },
};
