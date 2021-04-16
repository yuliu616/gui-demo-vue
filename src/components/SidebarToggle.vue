<template>
  <button class="ui icon button" v-on:click="onTogglePressed()">
    <i class="list alternate outline icon"></i>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SidebarToggle',
  data() {
    return {};
  },
  methods: {
    onTogglePressed: function(){
      // window.$('.ui.sidebar').sidebar('toggle'); // TODO: re-implement with antd
      console.log('onTogglePressed !!');
    },
  },
  components: {
  },
});
</script>
