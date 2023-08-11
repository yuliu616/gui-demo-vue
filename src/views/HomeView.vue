<template>
  <main>
    <a-alert class="my antd-alert" show-icon type="info"
      :message="i18n.word['word.hello']"
      :description="i18n.message['sentence.helloThisIsADemoApp']" 
    />
  </main>
</template>

<script lang="ts">
import { MessageService } from '@/service/MessageService';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { ref } from 'vue';

export default {
  computed: {
    viewName(): string { return this.i18n.view['view.Home']},
    iMessageService: ()=>MessageService(),
    PreferenceStore: ()=>usePreferenceStore(),
    i18n: ()=>usePreferenceStore().i18n,
  },
};
</script>
