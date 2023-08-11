import { message, notification } from 'ant-design-vue';
import { StringUtil } from "@/util/StringUtil";
import type { ILogger } from '@/model/core/ILogger';
import { MessageType, type Message } from '@/model/core/Message';
import type { i18nModel } from '@/translation/i18n';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { ERROR_UNKNOWN, RestfulUtil } from '@/util/RestfulUtil';
import { useMessageStore } from '@/stores/MessageStore';

const NOTIFICATION_DURATION_SEC = 3;
// const NOTIFICATION_DURATION_SEC = null; // forever

export interface MessageOptions {
  /**
   * extra data to be kept with the message.
   * (normally, not displayed)
   */
  extra: any;
}

export class MessageServiceImpl {

  debug = false;
  logger?: ILogger;

  private preferenceStore = usePreferenceStore();
  private messageStore = useMessageStore();

  constructor(options?: {
      debug?: boolean,
      logger?: ILogger,
    },
  ) {
    this.debug = options?.debug || false;
    this.logger = options?.logger;

    if (this.debug) this.logger?.log(`MessageService created.`);
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
      message: message
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
      message: message
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
      message: message
    }, options);
  }

  /**
   * sendMessage for error (if errorObject is provided, auto guess error message by it)
   * (如果有提供 errorObject，以错误码/类自动产生错误讯息)
   */
  public async errorMsg(viewVm: {viewName: string, i18nErrorPack?: string}, 
    errorObject: any|null = null,
    message: string,
    options: MessageOptions|null = null,
  ): Promise<void> {
    let i18n: i18nModel = this.preferenceStore.i18n;
    
    if (errorObject) {
      let converted = RestfulUtil.asError(errorObject, {includeTrace:true});
      if (converted?.code && converted.code != ERROR_UNKNOWN) {
        // if error code exists, display error message by it instead.
        // for generic error, use core error pack (instead of view depended pack)
        let translationPack = (converted?.statusCode ? 'error' : viewVm.i18nErrorPack || 'error');
        if (this.debug) this.logger?.log('converted =', converted);
        let messageByCode = i18n.t(translationPack, converted.code);
        if (converted.messageArguments?.length) {
          messageByCode = StringUtil.formatString(messageByCode, converted.messageArguments);
        }
        errorObject = converted;
        message = messageByCode;
      }
    }

    if (errorObject) {
      if (!options) {
        options = <MessageOptions>{};
      }
      options.extra = errorObject;
    }

    this.sendMessage({
      viewName: viewVm.viewName,
      type: MessageType.ERROR,
      message: message
    }, options);
  }

  /**
   * send local message (to messageStore)
   */
  public async sendMessage(message: Message,
    options: MessageOptions|null = null,
  ): Promise<void> {
    if (this.debug) this.logger?.log(
      `msg[${message.type}] view[${message.viewName}] :`, message.message);
    
    switch (message.type) {
      case MessageType.INFO:
        notification.info({
          class: (this.preferenceStore.darkTheme ? 'my my-antd-notification-dark':undefined),
          message: message.viewName,
          description: message.message,
          duration: NOTIFICATION_DURATION_SEC,
        });    
        break;
      case MessageType.WARN:
        notification.warn({
          class: (this.preferenceStore.darkTheme ? 'my my-antd-notification-dark':undefined),
          message: message.viewName,
          description: message.message,
          duration: NOTIFICATION_DURATION_SEC,
        });    
        break;
      case MessageType.ERROR:
        notification.error({
          class: (this.preferenceStore.darkTheme ? 'my my-antd-notification-dark':undefined),
          message: message.viewName,
          description: message.message,
          duration: NOTIFICATION_DURATION_SEC,
        });    
        break;
      case MessageType.GOOD:
        notification.success({
          class: (this.preferenceStore.darkTheme ? 'my my-antd-notification-dark':undefined),
          message: message.viewName,
          description: message.message,
          duration: NOTIFICATION_DURATION_SEC,
        });    
        break;
      default:
        this.logger?.warn(`MessageType not handled:[${message.type}]`);
    }
    
    await this.messageStore.addMessage({
      viewName: message.viewName,
      type: message.type,
      message: message.message,
      extra: message.extra || options?.extra,
    });
  }

  public async getMessage(offset: number, limit: number){
    return this.messageStore.messageList.slice(offset, offset+limit);
  }

}

class Singleton {
  static value: MessageServiceImpl;
}

/**
 * providing feedback/message to user (in GUI)
 */
export function MessageService() {
  if (!Singleton.value) {
    let debug: boolean = !!(+import.meta.env.VITE_MessageService_debug);
    Singleton.value = new MessageServiceImpl(
      {
        logger: console,
        debug: debug,
      }
    );
  }
  return Singleton.value;
}
