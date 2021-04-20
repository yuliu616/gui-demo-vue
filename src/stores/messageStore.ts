import { Store } from 'vuex';

export const messageStore = {
  namespaced: true,
  state: <MessageStoreState>{
    debug: false,
    messageList: [],
  },
  mutations: {
    addMessage(state: MessageStoreState, message: Message){
      if (state.debug) {
        console.log(`messageStore message[${message.type}]: ${message.text}`);
      }
      state.messageList.push(message);
    },
    removeById(state: MessageStoreState, id: number){
      if (state.debug) {
        console.log(`messageStore removing message with id=${id}.`);
      }
      let found = state.messageList.findIndex(m=>m.id==id);
      if (found >= 0) {
        state.messageList.splice(found, 1);
      }
    },
    removeAll(state: MessageStoreState){
      state.messageList = [];
    },
  },
  getters: {
    messageCount: (state: MessageStoreState)=>state.messageList.length,
    lastMessage: (state: MessageStoreState)=>state.messageList && state.messageList.length ?
      state.messageList[state.messageList.length-1] : null,
  },
  actions: {
    async init(store: Store<MessageStoreState>){
      let messageStoreJsonStr = localStorage.getItem('messageStore');
      if (messageStoreJsonStr) {
        let messageStoreJson = <{messageList: Message[]}>JSON.parse(messageStoreJsonStr);
        messageStoreJson.messageList.forEach(m=>store.commit('addMessage', m));
      }
    },
    async persist(store: Store<MessageStoreState>){
      let messageStoreJson = {
        messageList: store.state.messageList,
      };
      localStorage.setItem('messageStore', JSON.stringify(messageStoreJson));
    },
    async add(store: Store<MessageStoreState>, message: Message){
      let getters: MessageStoreGetters = store.getters;
      let copy = Object.assign({}, message);
      copy.id = (getters.lastMessage && getters.lastMessage.id ? getters.lastMessage.id : 1000) + 1;
      copy.time = new Date();
      store.commit('addMessage', copy);
      await store.dispatch('persist');
    },
    async removeList(store: Store<MessageStoreState>, idList: number[]){
      idList.forEach(id=>store.commit('removeById', id));
      await store.dispatch('persist');
    },
    async removeAll(store: Store<MessageStoreState>){
      store.commit('removeAll');
      await store.dispatch('persist');
    },
  },
};

export interface MessageStoreState {
  debug: boolean;
  messageList: Message[];
}

interface MessageStoreGetters {
  messageCount: number;
  lastMessage: Message|null;
}

export interface Message {
  id?: number;
  time?: Date;
  type: MessageType;
  text: string;
  viewName: string;
}

export enum MessageType {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  GOOD ='GOOD',
}
