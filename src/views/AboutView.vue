<template>
  <div>
    <a-alert class="my antd-alert" show-icon type="info"
      :message="i18n.view['view.About']"
      :description="i18n.message['sentence.wellIHaveNothingToTellU']" 
    />
  </div>
</template>

<script lang="ts">
import { MessageService } from '@/service/MessageService';
import { usePreferenceStore } from '@/stores/PreferenceStore';
  
export default {
  computed: {
    viewName(): string { return this.i18n.view['view.About']},
    iMessageService: ()=>MessageService(),
    PreferenceStore: ()=>usePreferenceStore(),
    i18n: ()=>usePreferenceStore().i18n,
  },
};
</script>