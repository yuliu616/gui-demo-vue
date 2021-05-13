<template>
  <div style="text-align: center;">
    -----
    <br/><br/>
    <p>{{ i18n.message['sentence.thisSiteIsForDemoPurpose'] }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { i18nModel, PreferenceStoreState } from '@/stores/preferenceStore';

export default Vue.extend({
  name: 'PageFooter',
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

<style scoped>
</style>