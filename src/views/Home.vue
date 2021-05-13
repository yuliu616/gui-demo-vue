<template>
  <a-alert :message="i18n.word['word.hello']" 
    :description="i18n.message['sentence.helloThisIsADemoApp']"
    type="info" show-icon />
</template>

<script lang="ts">
import Vue from 'vue';
import { i18nModel, PreferenceStoreState } from '@/stores/preferenceStore';

export default Vue.extend({
  name: 'Home',
  computed: {
    iPreferenceStore(): PreferenceStoreState {
      return this.$store.state.preferenceStore;
    },
    i18n(): i18nModel {
      return this.iPreferenceStore.i18n;
    },
  },
});
</script>
