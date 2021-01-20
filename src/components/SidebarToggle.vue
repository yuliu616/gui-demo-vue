<template>
  <button class="ui icon button" v-on:click="onTogglePressed()">
    <i class="list alternate outline icon"></i>
  </button>
</template>

<script>
export default {
  name: 'SidebarToggle',
  data() {
    return {};
  },
  methods: {
    onTogglePressed: function(){
      window.$('.ui.sidebar').sidebar('toggle');
    },
  },
  components: {
  },
};
</script>
