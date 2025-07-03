import { displayErrorModal, manageApplicationLoading } from "./utils/misc";
import { ErrorHandler, ActionError, Action } from "@/utils/types/api.types";
import type { App } from "vue";

function defaultErrorHandler(error: ActionError): void {
  if (error?.response) {
    console.error(error, error.metadata);
    displayErrorModal(error.response.data.error.message, null); //TODO: User modal plugin instead
  } else if (error?.message) {
    console.error(error, error.metadata);
    displayErrorModal(error.message, null);
  } else {
    console.error(error, error.metadata);
    displayErrorModal(error, null);
  }
}

function handleError(error: ActionError, errorHandler: ErrorHandler, isLoadingIndicated = false): void {
  manageApplicationLoading(false, isLoadingIndicated);
  if (errorHandler) {
    return errorHandler(error);
  } else {
    return defaultErrorHandler(error);
  }
}

async function runAction(action: Action, isLoadingIndicated: boolean) {
  manageApplicationLoading(true, isLoadingIndicated);
  await action();
  manageApplicationLoading(false, isLoadingIndicated);
}

export class LoadPlugin {
  static async load(action: Action, errorHandler?: ErrorHandler, isLoadingIndicated = true): Promise<object | void> {
    try {
      await runAction(action, isLoadingIndicated);
    } catch (error: ActionError) {
      manageApplicationLoading(false, isLoadingIndicated);
      handleError(error, errorHandler);
    }
  }
}

export default {
  install: (app: App): void => {
    app.config.globalProperties.$load = LoadPlugin.load;
  },
};
