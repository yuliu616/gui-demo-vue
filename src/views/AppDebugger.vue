<template>
  <div class="debuggerDiv">
    <a-alert class="my antd-alert" show-icon type="info"
      :message="i18n.view['view.AppDebugger']"
      :description="message" 
    />
    <div class="button-bar">
      <a-button class="my antd-btn"
        @click="sendDummyMessage(1)"
        :ghost="PreferenceStore.darkTheme">Dummy Message</a-button>
      <a-button class="my antd-btn"
        @click="sendDummyMessage(8)"
        :ghost="PreferenceStore.darkTheme">Dummy Message (x8)</a-button>
      <a-button class="my antd-btn"
        @click="sendDummyMessage(2, dict.MessageType.WARN)"
        :ghost="PreferenceStore.darkTheme">Dummy Message (WARN x2)</a-button>
      <a-button class="my antd-btn"
        @click="sendDummyMessage(2, dict.MessageType.ERROR)"
        :ghost="PreferenceStore.darkTheme">Dummy Message (ERROR x2)</a-button>
      <a-button class="my antd-btn"
        @click="sendDummyMessage(2, dict.MessageType.GOOD)"
        :ghost="PreferenceStore.darkTheme">Dummy Message (GOOD x2)</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import type { ILogger } from '@/model/core/ILogger';
import { MessageType } from '@/model/core/Message';
import { MessageService } from '@/service/MessageService';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { ref, type Ref } from 'vue';

const logger: ILogger = console;
  
interface ViewModel {
  message: Ref<string>,
}

export default {
  computed: {
    viewName(): string { return this.i18n.view['view.AppDebugger']},
    iMessageService: ()=>MessageService(),
    PreferenceStore: ()=>usePreferenceStore(),
    i18n: ()=>usePreferenceStore().i18n,
    dict: ()=>({
      MessageType: MessageType,
    }),
  },
  data(){
    return <ViewModel>{
      message: ref(''),
    };
  },
  mounted() {
    this.message = this.i18n.message['sentence.thisViewIsForDebuggingUseOnly'];
  },
  methods: {
    sendDummyMessage(count: number, type?: MessageType) {
      for (let i=0; i<count; i++){
        if (!type) {
          this.iMessageService.info(this, 'testing 123');
        } else if (type == MessageType.INFO) {
          this.iMessageService.info(this, 'testing 123');
        } else if (type == MessageType.WARN) {
          this.iMessageService.warn(this, 'testing 123');
        } else if (type == MessageType.ERROR) {
          this.iMessageService.errorMsg(this, null, 'testing 123');
        } else if (type == MessageType.GOOD) {
          this.iMessageService.good(this, 'testing 123');
        } else {
          this.iMessageService.info(this, 'testing 123');
        }
      }
    }
  }
};
</script>

<style scoped>
div.debuggerDiv div.button-bar {
  margin-top: 1.4em;

  .my.antd-btn {
    margin-left: 0.4em;
  }
}
</style>