export class Notify {
  type: NotifyType;
  message: string;
}


export enum NotifyType {
  success,
  error,
  info,
  warning
}
