import store from "@/store/store";
import applicationPlugin from "@/data/plugins/application/applicationPlugin.json";
import InformationMessage from "@/components/common/info/informationMessage/InformationMessage.vue";
import modalPlugin from "@/data/plugins/modal/modalPlugin.json";
import type { Modal } from "@/utils/types/modal.types";
import type { HandleFunction } from "@/utils/types/api.types";

export function manageApplicationLoading(isLoadingOn: boolean, isLoadingIndicated = false): void {
  isLoadingIndicated && store.dispatch(applicationPlugin.APPLICATION_SET_IS_LOADING, isLoadingOn);
}

export function displayErrorModal(withMessage: string, handleFunction: HandleFunction | null): void {
  const modal: Modal = {
    displayedComponent: InformationMessage,
    displayedComponentProps: {
      message: withMessage,
    },
  };

  if (handleFunction && modal.displayedComponentProps) {
    modal.displayedComponentProps["handleFunction"] = handleFunction;
  }

  store.dispatch(modalPlugin.MODAL_SET_MODAL, modal);
  store.dispatch(modalPlugin.MODAL_SET_MODAL_VISIBILITY, true);
}
