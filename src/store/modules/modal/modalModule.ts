import modalMutations from "@/data/store/modal/modalMutations.json";
import type { State } from "@/store/store";
import type { Modal } from "@/utils/types/modal.types";
import { Component, markRaw, Raw, ShallowRef, shallowRef } from "vue";
import type { ActionContext } from "vuex";

export type ModalOptions = {
  //TODO: remove
  isNonClosableByClickOnPeriphery?: boolean;
};

export interface ModalState {
  isNonClosableByClickOnPeriphery: boolean;
  isVisible: boolean;

  modalOptions: ModalOptions | null;

  modal: ShallowRef<Modal> | null; //TODO: remove
}
function getInitialState(): ModalState {
  return {
    isNonClosableByClickOnPeriphery: false,
    isVisible: false,

    modalOptions: null,

    modal: shallowRef({}) as ShallowRef<Modal>,
  };
}

type Context = ActionContext<ModalState, State>;

const modalModule = {
  namespaced: true as boolean,
  state: (): ModalState => getInitialState(),
  mutations: {
    resetState(state: ModalState) {
      Object.assign(state, getInitialState());
    },

    /* old */
    setIsModalNonClosableByClickOnPeriphery(state: ModalState, isNonClosableByClickOnPeriphery: boolean): void {
      state.isNonClosableByClickOnPeriphery = isNonClosableByClickOnPeriphery;
    },
    setModalVisibility(state: ModalState, isVisible: boolean): void {
      state.isVisible = isVisible;
    },
    setModal(state: ModalState, modal: Modal): void {
      state.modal = shallowRef(modal);
    },
    /* /old */
  },
  actions: {
    /* public acitons */
    /**
     * Do not use directly unless necessary. Use it via modal plugin instead
     * @param context
     * @param param1
     */
    openModal(context: Context, { modalComponent, modalComponentProps, modalOptions }: { modalComponent: Component; modalComponentProps?: unknown; modalOptions?: ModalOptions }) {
      const modalPayload = {
        displayedComponent: modalComponent,
        displayedComponentProps: modalComponentProps,
      };
      context.commit(modalMutations.SET_MODAL, modalPayload);
      if (modalOptions?.isNonClosableByClickOnPeriphery) {
        context.commit(modalMutations.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY, true);
      }
      context.commit(modalMutations.SET_MODAL_VISIBILITY, true);
    },
    closeModal(context: Context) {
      context.commit("resetState");
    },
    /* /public acitons */

    setIsModalNonClosableByClickOnPeriphery(context: Context, payload: boolean): void {
      //TODO: remove. Do not use! Use openModal closeModal actions instead!
      context.commit(modalMutations.SET_IS_MODAL_NON_CLOSABLE_BY_CLICK_ON_PERIPHERY, payload);
    },
    setModalVisibility(context: Context, payload: boolean): void {
      //TODO: remove. Do not use! Use openModal closeModal actions instead!
      context.commit(modalMutations.SET_MODAL_VISIBILITY, payload);
    },
    setModal(context: Context, payload: Modal): void {
      //TODO: remove. Do not use! Use openModal closeModal actions instead!
      context.commit(modalMutations.SET_MODAL, payload);
    },
  },
};

export const constructModalPropsObject = (component: Component, comonentProps: object): Modal => {
  return {
    displayedComponent: component,
    displayedComponentProps: comonentProps,
  };
};

export default modalModule;
