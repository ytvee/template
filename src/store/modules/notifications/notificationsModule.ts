import notificationsMutations from "@/data/store/notifications/notificationsMutations.json";
import type { ActionContext } from "vuex";
import { State } from "@/store/store";
import { NotificationsTypes, type Notification } from "@/utils/types/notifications.types";

export interface NotificationsState {
  notifications: Notification[];
}

type Context = ActionContext<NotificationsState, State>;

const notificationsModule = {
  namespaced: true as boolean,
  state: (): NotificationsState => ({
    notifications: [],
  }),
  getters: {
    getNotification(state: NotificationsState, id: number): Notification | undefined {
      for (let index = 0; index < state.notifications.length; index++) {
        if (state.notifications[index].id === id) {
          return state.notifications[index];
        }
      }
    },
    getNotificationsCount(state: NotificationsState): number {
      return state.notifications?.length;
    },
  },
  mutations: {
    setNotifications(state: NotificationsState, notifications: Notification[]): void {
      state.notifications = notifications;
    },
    deleteNotification(state: NotificationsState, id: number): void {
      for (let index = 0; index < state.notifications.length; index++) {
        if (state.notifications[index].id === id) {
          state.notifications.splice(index, 1);
          break;
        }
      }
    },
    addNotification(state: NotificationsState, payload: Notification) {
      const length: number = state.notifications?.length;
      const lastNotificationId: number | undefined = length ? state.notifications[length - 1].id : 0;
      const newPayload: Notification = Object.assign({}, payload);
      newPayload.id = lastNotificationId + 1 ?? 0;
      state.notifications.push(payload);
    },
  },
  actions: {
    setNotifications(context: Context, payload: Notification[]): void {
      context.commit(notificationsMutations.SET_NOTIFICATIONS, payload);
    },
    deleteNotification(context: Context, payload: number): void {
      context.commit(notificationsMutations.DELETE_NOTIFICATION, payload);
    },
    addNotification(context: Context, payload: Notification): void {
      context.commit(notificationsMutations.ADD_NOTIFICATION, payload);
    },
  },
};

export default notificationsModule;
