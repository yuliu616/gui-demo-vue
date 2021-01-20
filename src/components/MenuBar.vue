<template>
  <div id="menubar" class="ui menu">
    <div class="ui dropdown item" 
      v-for="menuItem in menuRoot" 
      v-bind:key="menuItem.code"
      v-on:click="navigateTo(menuItem.targetPath)">
      {{ menuItem.title }}
      <div class="ui teal left pointing label" v-if="badgeOfMenu(menuItem.code)">
        {{ badgeOfMenu(menuItem.code) }}
      </div>
      <i class="dropdown icon" v-if="menuItem.children"></i>
      <div class="menu" v-if="menuItem.children">
        <a class="item" 
          v-for="child in menuItem.children" 
          v-bind:key="child.title"
          v-on:click="navigateTo(child.targetPath)"
          >
          {{ child.title }}
          <div class="ui teal left pointing submenu label" v-if="badgeOfMenu(child.code)">
            {{ badgeOfMenu(child.code) }}
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { navigateToIfNeeded } from '../util/VueRouterHelper';

export default {
  name: 'MenuBar',
  data() {
    return {
    };
  },
  computed: {
    menuRoot: self=>self.$store.state.menuStore.menuRoot,
  },
  methods: {
    navigateTo: function(targetPath){
      navigateToIfNeeded(this.$router, targetPath);
    },
    badgeOfMenu: function(code){
      if (code == 'message') {
        return this.$store.getters['messageStore/messageCount'];
      } else {
        return 0;
      }
    },
  },
  components: {
  },
};
</script>

<style scoped>
#menubar {
  height: 100%;
}

div.ui.left.pointing.submenu.label {
  margin-left: 2em;
}
</style>