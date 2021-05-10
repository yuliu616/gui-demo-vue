import { rootStore } from "@/stores";
import { MessageType } from "@/stores/messageStore";
import { Store } from "vuex";
import { notification } from 'ant-design-vue';

const DEFAULT_ROOT_STORE = rootStore;

export class MessageServiceImpl {

  public rootStore: Store<any>;

  debug = false;

  constructor(rootStore: Store<any> = DEFAULT_ROOT_STORE){
    this.rootStore = rootStore;
  }

  async init(){
    this.rootStore.dispatch('messageStore/init');
  }

  /**
   * shorthand version of sendMessage(MessageType.GOOD)
   */
  public async good(viewVm: {viewName: string}, message: string, 
    options: MessageOptions|null = null,
  ): Promise<void> {
    this.sendMessage({
      viewName: viewVm.viewName,
      type: MessageType.GOOD,
      text: message
    }, options);
  }

  /**
   * shorthand version of sendMessage(MessageType.INFO)
   */
  public async info(viewVm: {viewName: string}, message: string, 
    options: MessageOptions|null = null,
  ): Promise<void> {
    this.sendMessage({
      viewName: viewVm.viewName,
      type: MessageType.INFO,
      text: message
    }, options);
  }

  /**
   * shorthand version of sendMessage(MessageType.WARN)
   */
  public async warn(viewVm: {viewName: string}, message: string, 
    options: MessageOptions|null = null,
  ): Promise<void> {
    this.sendMessage({
      viewName: viewVm.viewName,
      type: MessageType.WARN,
      text: message
    }, options);
  }

  /**
   * shorthand version of sendMessage(MessageType.ERROR)
   */
  public async errorMsg(viewVm: {viewName: string}, 
    errorObject: any|null = null,
    message: string,
    options: MessageOptions|null = null,
  ): Promise<void> {
    if (errorObject) {
      if (options) {
        options.extra = errorObject;
      } else {
        options = {
          extra: errorObject,
        };
      }
    }
    this.sendMessage({
      viewName: viewVm.viewName,
      type: MessageType.ERROR,
      text: message
    }, options);
  }

  /**
   * send local message (to messageStore)
   */
  public async sendMessage(message: Message,
    options: MessageOptions|null = null,
  ): Promise<void> {
    if (this.debug) console.log(`msg[${message.type}] view[${message.viewName}] :`, message.text);
    switch (message.type) {
      case MessageType.INFO:
        notification.info({
          message: message.viewName,
          description: message.text,
        });    
        break;
      case MessageType.WARN:
        notification.warn({
          message: message.viewName,
          description: message.text,
        });    
        break;
      case MessageType.ERROR:
        notification.error({
          message: message.viewName,
          description: message.text,
        });    
        break;
      case MessageType.GOOD:
        notification.success({
          message: message.viewName,
          description: message.text,
        });    
        break;
      default:
        console.warn(`MessageType not handled:[${message.type}]`);
    }
    await this.rootStore.dispatch('messageStore/add', {
      viewName: message.viewName,
      type: message.type,
      text: message.text,
      extra: message.extra || options?.extra,
    });
  }

  public async removeMessageByIdList(messageIdList: number[]): Promise<void> {
    await this.rootStore.dispatch('messageStore/removeList', messageIdList);
  }

  public async clearMessage(): Promise<void> {
    await this.rootStore.dispatch('messageStore/removeAll');
  }

}

export interface Message {
  id?: number;
  time?: Date;
  type: MessageType;
  text: string;
  viewName: string;
  extra?: any;
}

export interface MessageOptions {
  /**
   * extra data to be kept with the message.
   * (normally, not displayed)
   */
  extra: any;
}


class Singleton {
  static value: MessageServiceImpl;
}

export function MessageService(debug = false) {
  if (!Singleton.value) {
    Singleton.value = new MessageServiceImpl();
  }
  Singleton.value.debug = debug;
  return Singleton.value;
}
