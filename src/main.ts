import { createApp } from "vue";
import VueCookies from "vue-cookies";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store/store";
import RoundPlugin from "@/plugins/round/RoundPlugin";
import ApiPlugin from "@/plugins/api/ApiPlugin";
import LoadPlugin from "@/plugins/load/LoadPlugin";
import EventBusPlugin from "@/plugins/eventBus/EventBusPlugin";
import SocketNotificationsPlugin from "@/plugins/socket/SocketNotificationsPlugin";
import ModalPlugin from "./plugins/modal/ModalPlugin";
import loggerPlugin from "./plugins/logger/loggerPlugin";
import notificationsPlugin from "./plugins/notifications/notificationsPlugin";
import loggerNotificationsPlugin from "./plugins/loggerNotifications/loggerNotificationsPlugin";

// import { initializeAmplify } from "./utils/cognito/cognitoUtils";

import "@/services/amplifyConfig";

const app = createApp(App);
const globals = app.config.globalProperties;
export { globals };

app.use(router);
app.use(VueCookies);
app.use(store);
app.use(loggerPlugin);
app.use(notificationsPlugin);
app.use(loggerNotificationsPlugin);
app.use(RoundPlugin);
app.use(ApiPlugin);
app.use(LoadPlugin);
app.use(EventBusPlugin);
app.use(SocketNotificationsPlugin);
app.use(ModalPlugin);
// initializeAmplify();
app.mount("#app");
