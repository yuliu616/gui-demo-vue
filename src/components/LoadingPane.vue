<template>
  <div class='my lead panel'>
    <a-spin size="large" style="width:100%; margin: auto;" />
    <div style="width:100%; text-align: center; margin-top: 3px;">
      {{ i18n.message['sentence.loading'] }} ...
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { i18nModel, PreferenceStoreState } from '@/stores/preferenceStore';

export default Vue.extend({
  name: 'LoadingPane',
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
