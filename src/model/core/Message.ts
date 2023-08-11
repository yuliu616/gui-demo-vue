export enum MessageType {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  GOOD ='GOOD',
}

export interface Message {
  id?: number;
  time?: Date|string;
  type: MessageType;
  message: string;
  viewName: string;
  extra?: any;
}
