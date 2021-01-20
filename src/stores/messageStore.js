import * as toastr from 'toastr/build/toastr.min.js';

const messageStore = {
  namespaced: true,
  state: {
    debug: false,
    messageList: [],
  },
  mutations: {
    addMessage(state, message){
      if (state.debug) {
        console.log(`messageStore message[${message.type}]: ${message.text}`);
      }
      state.messageList.push(message);
    },
    removeById(state, id){
      if (state.debug) {
        console.log(`messageStore removing message with id=${id}.`);
      }
      let found = state.messageList.findIndex(m=>m.id==id);
      if (found >= 0) {
        state.messageList.splice(found, 1);
      }
    },
    removeAll(state){
      state.messageList = [];
    },
  },
  getters: {
    messageCount: state=>state.messageList.length,
    lastMessage: state=>state.messageList && state.messageList.length ?
      state.messageList[state.messageList.length-1] : null,
  },
  actions: {
    async init({ commit }){
      let messageStoreJsonStr = localStorage.getItem('messageStore');
      if (messageStoreJsonStr) {
        let messageStoreJson = JSON.parse(messageStoreJsonStr);
        messageStoreJson.messageList.forEach(m=>commit('addMessage', m));
      }
    },
    async persist({ state }){
      let messageStoreJson = {
        messageList: state.messageList,
      };
      localStorage.setItem('messageStore', JSON.stringify(messageStoreJson));
    },
    async add({ getters, commit, dispatch }, message){
      let copy = Object.assign({}, message);
      copy.id = (getters.lastMessage ? getters.lastMessage.id || 1000 : 1000) + 1;
      copy.time = new Date();
      commit('addMessage', copy);
      await dispatch('persist');
      if (copy.type == MessageType.INFO) {
        toastr.info(copy.text, copy.viewName);
      } else if (copy.type == MessageType.WARN) {
        toastr.warning(copy.text, copy.viewName);
      } else if (copy.type == MessageType.ERROR) {
        toastr.error(copy.text, copy.viewName);
      } else if (copy.type == MessageType.GOOD) {
        toastr.success(copy.text, copy.viewName);
      } else {
        toastr.info(copy.text, copy.viewName);
      }
    },
    async removeList({ commit, dispatch }, idList){
      idList.forEach(id=>commit('removeById', id));
      await dispatch('persist');
    },
    async removeAll({ commit, dispatch }){
      commit('removeAll');
      await dispatch('persist');
    },
  },
};

const MessageType = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  GOOD: 'GOOD',
};

export { 
  messageStore, 
  MessageType, 
};
