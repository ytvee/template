import type { ActionContext } from "vuex";
import type { State } from "@/store/store";
import { NotificationLevel, NotificationOptions } from "@/plugins/notifications/notificationsPlugin";
import { appConfig } from "@/data/appConfig";
import { generateUniqueId } from "@/utils/common";

export type Notification = {
  id: string;
  notificationLevel: NotificationLevel;
  message: string;
}

export interface NotificationsState {
  notifications: Array<Notification>;
}
function getInitialState(): NotificationsState {
  return {
    notifications: [],
  };
}

type Context = ActionContext<NotificationsState, State>;

const notificationsModule = {
  namespaced: true as boolean,
  state: (): NotificationsState => getInitialState(),
  mutations: {
    resetState(state: NotificationsState) {
      Object.assign(state, getInitialState());
    },
    addToNotifications(state: NotificationsState, notification: Notification) {
      state.notifications.push(notification);
      if(state.notifications.length > appConfig.notifications.maxCount) state.notifications.splice(0, state.notifications.length-appConfig.notifications.maxCount);
    },
    removeFromNotifications(state: NotificationsState, notificationId: string) {
      const index = state.notifications.findIndex((notification) => notification.id === notificationId);
      if(index !== -1) {
        state.notifications.splice(index, 1);
      }
    }

  },
  actions: {
    notify(context: Context, {notificationLevel, message, options}:{notificationLevel: NotificationLevel, message: any, options?: Partial<NotificationOptions>}) {
      const duration = options?.duration || appConfig.notifications.duration;
      const notification: Notification = {
        id: generateUniqueId(),
        notificationLevel,
        message,
      }
      context.commit("addToNotifications", notification);
      
      if(duration !== -1) {
        setTimeout(() => {
          context.commit("removeFromNotifications", notification.id);
        }, duration);
      }
    }
  },
};

export default notificationsModule;
