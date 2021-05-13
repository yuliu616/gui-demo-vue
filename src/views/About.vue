<template>
<div>
    <a-alert :message="i18n.view['view.About']" style="min-width: 25em;"
    :description="i18n.message['sentence.wellIHaveNothingToTellU']"
    type="info" show-icon />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { i18nModel, PreferenceStoreState } from '@/stores/preferenceStore';

export default Vue.extend({
  name: 'About',
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
