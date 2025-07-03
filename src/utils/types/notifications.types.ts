type NotificationType = string;

type Notification = {
  id: number;
  type: NotificationType;
  message?: string;
};

export type { Notification, NotificationType };
