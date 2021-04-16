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

<script lang="ts">
import Vue from 'vue';
import VueRouter from 'vue-router';
import { VueRouterHelper } from '../util/VueRouterHelper';
import { MenuItem, MenuStoreState } from '../stores/menuStore';

export default Vue.extend({
  name: 'MenuBar',
  data() {
    return {
    };
  },
  computed: {
    iMenuStore(): MenuStoreState {
      return this.$store.state.menuStore;
    },
    menuRoot(): MenuItem[] {
      return this.iMenuStore.menuRoot;
    },
  },
  methods: {
    navigateTo: function(targetPath: string){
      VueRouterHelper.navigateToIfNeeded(this.$router, targetPath);
    },
    badgeOfMenu: function(code: string){
      if (code == 'message') {
        return this.$store.getters['messageStore/messageCount'];
      } else {
        return 0;
      }
    },
  },
  components: {
  },
});
</script>

<style scoped>
#menubar {
  height: 100%;
}

div.ui.left.pointing.submenu.label {
  margin-left: 2em;
}
</style>