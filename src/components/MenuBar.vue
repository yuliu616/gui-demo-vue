<template>
<div>
  <a-menu class="menubar" mode="horizontal">
    <template v-for="menuItem in menuRoot">

      <a-menu-item 
        v-if="!menuItem.children"
        v-bind:key="(menuItem.code)"
        v-on:click="navigateTo(menuItem.targetPath)"
      >
        {{ menuItem.title }}
        <span class="my danger label"
        v-if="badgeOfMenu(menuItem.code)">
          {{ badgeOfMenu(menuItem.code) }}
        </span>
      </a-menu-item>
      
      <a-sub-menu
      v-if="menuItem.children"
      :key="(menuItem.code+'-sub')">
        <span slot="title" class="submenu-title-wrapper">
          {{ menuItem.title }}
        </span>
        <a-menu-item v-for="child in menuItem.children" 
          v-bind:key="child.title"
          v-on:click="navigateTo(child.targetPath)"
        >
          {{ child.title }}
        </a-menu-item>
      </a-sub-menu>

    </template>
  </a-menu>
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
    async navigateTo(targetPath: string){
      VueRouterHelper.navigateToIfNeeded(this.$router, targetPath);
    },
    badgeOfMenu(code: string){
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
.menubar {
  height: 100%;
}

div.ui.left.pointing.submenu.label {
  margin-left: 2em;
}
</style>