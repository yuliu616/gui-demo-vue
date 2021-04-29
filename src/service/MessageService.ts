import { rootStore } from "@/stores";
import { Message, MessageType } from "@/stores/messageStore";
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
   * send local message (to messageStore)
   */
  public async sendMessage(message: Message): Promise<void> {
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
    });
  }

  public async removeMessageByIdList(messageIdList: number[]): Promise<void> {
    await this.rootStore.dispatch('messageStore/removeList', messageIdList);
  }

  public async clearMessage(): Promise<void> {
    await this.rootStore.dispatch('messageStore/removeAll');
  }

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
