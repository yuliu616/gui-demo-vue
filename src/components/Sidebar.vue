<template>
  <div style="padding-top: 18px;">
    <div class="item" v-on:click="navigateToHome()">
      <img class="ui mini image" src="../assets/logo.png"
        v-if="showProdLogo" v-bind:style="{ backgroundColor: logoBackgroundColor }" />
      <img class="ui mini image" src="../assets/logo-dev.png"
        v-if="showDevLogo" v-bind:style="{ backgroundColor: logoBackgroundColor }" />
    </div>
    <a-menu style="width: 100%" mode="inline">
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
import { VueRouterHelper } from '../util/VueRouterHelper';
import { MenuItem, MenuStoreState } from '../stores/menuStore';

export default Vue.extend({
  name: 'Sidebar',
  data(): ViewStateModel {
    return {
      showProdLogo: process.env.VUE_APP_LOGO_USE=='PROD',
      showDevLogo: process.env.VUE_APP_LOGO_USE=='DEV',
      logoBackgroundColor: process.env.VUE_APP_LOGO_BG_COLOR,
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
    navigateToHome: function(){
      VueRouterHelper.navigateToIfNeeded(this.$router, '/');
    },
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
});

interface ViewStateModel {
  showProdLogo: boolean;
  showDevLogo: boolean;
  logoBackgroundColor: string;
}
</script>
