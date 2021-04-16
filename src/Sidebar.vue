<template>
  <div id="sidebar" v-show="loggedIn" class="ui vertical menu sidebar">
    <div class="item" v-on:click="navigateToHome()">
      <img class="ui mini image" src="./assets/logo.png">
    </div>
    <template v-for="menuItem in menuRoot">
      <div class="item" 
        v-if="menuItem.children">
        <div class="header">
          {{ menuItem.title }}
        </div>
        <div class="ui teal left pointing label" v-if="badgeOfMenu(menuItem.code)">
          {{ badgeOfMenu(menuItem.code) }}
        </div>
        <div class="menu" v-if="menuItem.children">
          <a class="item"
            v-for="child in menuItem.children"
            v-bind:key="child.title"
            v-on:click="navigateTo(child.targetPath)">
            {{ child.title }}
            <div class="ui teal left pointing label" v-if="badgeOfMenu(child.code)">
              {{ badgeOfMenu(child.code) }}
            </div>
          </a>
        </div>
      </div>
      <a class="item"
        v-if="!menuItem.children"
        v-on:click="navigateTo(menuItem.targetPath)">
        {{ menuItem.title }}
        <div class="ui teal left pointing label" v-if="badgeOfMenu(menuItem.code)">
          {{ badgeOfMenu(menuItem.code) }}
        </div>
      </a>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VueRouter from 'vue-router';
import { AuthStoreState } from './stores/authStore';
import { MenuItem, MenuStoreState } from './stores/menuStore';
import { VueRouterHelper } from './util/VueRouterHelper';

export default Vue.extend({
  name: 'Sidebar',
  data() {
    return {
    };
  },
  computed: {
    iAuthStore(): AuthStoreState {
      return this.$store.state.authStore;
    },
    iMenuStore(): MenuStoreState {
      return this.$store.state.menuStore;
    },
    loggedIn(): boolean {
      return this.iAuthStore.loggedIn;
    },
    menuRoot(): MenuItem[] {
      return this.iMenuStore.menuRoot;
    },
  },
  methods: {
    navigateToHome: function(){
      VueRouterHelper.navigateToIfNeeded(this.$router, '/');
    },
    navigateTo: function(targetPath: string){
      VueRouterHelper.navigateToIfNeeded(this.$router, targetPath);
    },
    badgeOfMenu: function(code: string): number {
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

</style>
