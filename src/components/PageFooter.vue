<template>
  <div>
    -----
    <br/><br/>
    <p>{{ i18n.message['sentence.thisSiteIsForDemoPurpose'] }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { i18n } from '@/translation/i18n';

export default Vue.extend({
  name: 'PageFooter',
  data() {
      return {};
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

<style scoped>
</style>