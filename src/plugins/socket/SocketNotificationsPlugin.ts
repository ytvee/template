import type { App } from "vue";
import { SocketModule } from "./instance/instance";

export default {
  install: (app: App) => {
    const webSocket = new SocketModule();
    app.config.globalProperties.$notificationsSocket = webSocket;
  },
};
