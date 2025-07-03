type NotificationType = string;

type Notification = {
  id: number;
  type: NotificationType;
  message?: string;
};

export const enum NotificationsTypes {
  SUCCESS = "success",
  FAILURE = "failure",
  REQUEST = "request",
}

export type { Notification, NotificationType };
