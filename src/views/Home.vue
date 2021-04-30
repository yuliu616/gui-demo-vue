<template>
  <a-alert :message="i18n.word['word.hello']" 
    :description="i18n.message['sentence.helloThisIsADemoApp']"
    type="info" show-icon />
</template>

<script lang="ts">
import Vue from 'vue';
import { i18n } from '@/translation/i18n';

export default Vue.extend({
  name: 'Home',
  data() {
    return {
    };
  },
  computed: {
    i18n: ()=>i18n,
  },
  methods: {
  },
  components: {
  },
});
</script>
