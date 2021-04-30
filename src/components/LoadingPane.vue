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
import { i18n } from '@/translation/i18n';

export default Vue.extend({
  name: 'LoadingPane',
  computed: {
    i18n:()=>i18n,
  },
});
</script>
