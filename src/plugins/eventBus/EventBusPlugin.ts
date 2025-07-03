import type { App } from "vue";
import mitt from "mitt";

export const EventBusInstance = mitt();

export default {
  install: (app: App): void => {
    app.config.globalProperties.$eventBus = EventBusInstance;
  },
};
