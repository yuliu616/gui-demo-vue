import type { ILogger } from "@/model/core/ILogger";
import type { Message } from "@/model/core/Message";
import type { ILocalStorage } from "@/model/html/ILocalStorage";
import { BrowserApiUtil } from "@/util/BrowserApiUtil";
import { ObjectUtil } from "@/util/ObjectUtil";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

let debug = !!(+import.meta.env.VITE_MessageStore_debug);
const logger: ILogger = console;

const STORAGE_KEY = 'MessageStore.state';
const ID_FIRST_VALUE = 1;

export interface MessageStoreState {
  idCounter: Ref<number>;
  messageList: Ref<Message[]>;
  // count: number;
  // isEmpty: boolean;
  persistenceProvider: ILocalStorage;
}

let useMessageStore = defineStore('Message', {
  state: ()=><MessageStoreState>({
    idCounter: ref(ID_FIRST_VALUE),
    messageList: ref([]),
    persistenceProvider: BrowserApiUtil.getLocalStorage(),
  }),
  getters: {
    count: (state)=>state.messageList.length,
    isEmpty: (state)=>(state.messageList.length==0),
  },
  actions: {
    init(){
      let restoredStateJson = this.persistenceProvider.getItem(STORAGE_KEY);
      if (restoredStateJson != null) {
        let restoredState = JSON.parse(restoredStateJson);
        this.messageList = restoredState.messageList;
        if (this.messageList.length > 0) {
          this.idCounter = (this.messageList[this.messageList.length-1].id || 0)+1;
        } else {
          this.idCounter = ID_FIRST_VALUE;
        }
        // if (debug) logger?.log('MessageStore state restored ', JSON.stringify(this, null, 2));
        if (debug) logger?.log('MessageStore state restored, keys =', ObjectUtil.allFields(this));
      }
    },
    async addMessage(message: Message){
      if (debug) {
        logger?.log(`messageStore <${message.id}> message[${message.type}]: ${message.message}`);
        if (message.extra) {
          logger?.log(`messageStore <${message.id}> extra:`, message.extra);
        }
      }
      this.messageList.push(Object.assign(
        <Message>{}, 
        message, 
        <Message>{ 
          id: this.idCounter++,
          time: new Date(),
        },
      ));
      this.persistState();
    },
    async removeById(id: number, persist: boolean = true){
      if (debug) {
        logger?.log(`messageStore removing message with id=${id}.`);
      }
      let found = this.messageList.findIndex(m=>m.id==id);
      if (found >= 0) {
        this.messageList.splice(found, 1);
      }
      if (persist) this.persistState();
    },
    async removeList(idList: number[]){
      for (let id of idList) {
        await this.removeById(id, false);
      }
      await this.persistState();
    },
    async removeAll(){
      this.messageList.splice(0);
      await this.persistState();
    },
    async persistState(){
      this.persistenceProvider.setItem(STORAGE_KEY, JSON.stringify({
        messageList: this.messageList,
      }));
      if (debug) logger?.log('persistState: state.messageList=', this.messageList);
      if (debug) logger?.log(
        'MessageStore state persisted storage.length =', this.persistenceProvider.length);
    }
  },
});

export { useMessageStore };
