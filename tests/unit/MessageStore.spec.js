import { expect } from 'chai';
import { messageStore } from '../../src/stores/messageStore';

describe('messageStore', function(){

  it('simply works', function(){
    let state = {
      messageList:[
        {id: 400, viewName: 'People Admin', text: "People record created."},
        {id: 401, viewName: 'People Admin', text: "Record updated."},
      ],
    };
    expect(messageStore.getters.messageCount(state)).eq(2);
    expect(messageStore.getters.lastMessage(state).id).eq(401);
    expect(messageStore.getters.lastMessage(state).viewName).eq('People Admin');
    expect(messageStore.getters.lastMessage(state).text).eq('Record updated.');
  });

  it('messageCount works', function(){
    let state = {
      messageList:[
        {id: 400, viewName: 'People Admin', text: "People record created."},
        {id: 401, viewName: 'People Admin', text: "Record updated."},
      ],
    };
    expect(messageStore.getters.messageCount(state)).eq(2);
  });

  it('lastMessage return null if no message', function(){
    let state = {
      messageList:[
      ],
    };
    expect(messageStore.getters.messageCount(state)).eq(0);
    expect(messageStore.getters.lastMessage(state)).to.be.null;
  });

  it('lastMessage works', function(){
    let state = {
      messageList:[
        {id: 400, viewName: 'People Admin', text: "People record created."},
        {id: 401, viewName: 'People Admin', text: "Record updated."},
      ],
    };
    expect(messageStore.getters.lastMessage(state).id).eq(401);
    expect(messageStore.getters.lastMessage(state).viewName).eq('People Admin');
    expect(messageStore.getters.lastMessage(state).text).eq('Record updated.');
  });

  it('could add message with mutation', function(){
    let state = {
      messageList:[
        {id: 400, viewName: 'People Admin', text: "People record created."},
        {id: 401, viewName: 'People Admin', text: "Record updated."},
      ],
    };
    expect(messageStore.getters.messageCount(state)).eq(2);
    let m = {
      id: 402, 
      viewName: 'Region Admin', 
      text: "Please specify a home address."
    };
    messageStore.mutations.addMessage(state, m);
    expect(messageStore.getters.lastMessage(state).id).eq(402);
    expect(messageStore.getters.lastMessage(state).viewName).eq('Region Admin');
    expect(messageStore.getters.lastMessage(state).text).eq('Please specify a home address.');

  });

});
