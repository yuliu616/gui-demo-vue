<template>
  <div class='my lead panel'>
    <a-spin size="large" style="width:100%; margin: auto;" />
    <div style="width:100%; text-align: center; margin-top: 3px;">
      Loading ...
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LoadingPane',
});
</script>
