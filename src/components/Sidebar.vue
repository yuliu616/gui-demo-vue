<template>
  <div style="padding-top: 18px;">
    <div class="item" v-on:click="navigateToHome()">
      <img class="ui mini image" src="/images/logo.png"
        v-if="iPreferenceStore.showProdLogo" 
        v-bind:style="{ backgroundColor: iPreferenceStore.logoBackgroundColor }" />
      <img class="ui mini image" src="/images/logo-dev.png"
        v-if="iPreferenceStore.showDevLogo" 
        v-bind:style="{ backgroundColor: iPreferenceStore.logoBackgroundColor }" />
    </div>
    <a-menu style="width: 100%" mode="inline">
      <!-- app-menu -->
      <template v-for="menuItem in menuRoot">

        <a-menu-item 
          v-if="!menuItem.children"
          v-bind:key="(menuItem.code)"
          v-on:click="navigateTo(menuItem.targetPath, menuItem.code)"
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
            v-bind:key="child.code"
            v-on:click="navigateTo(child.targetPath, child.code)"
          >
            {{ child.title }}
          </a-menu-item>
        </a-sub-menu>

      </template>
      
      <!-- sys-menu -->
      <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper">
          {{ sysMenuRoot.title }}
        </span>
        <a-menu-item v-for="child in sysMenuRoot.children"
          v-bind:key="child.code"
          v-on:click="navigateTo(child.targetPath, child.code)"
        >
          {{ child.title }}
        </a-menu-item>
      </a-sub-menu>

    </a-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueRouterHelper } from '../util/VueRouterHelper';
import { MenuItem, MenuStoreState } from '../stores/menuStore';
import { AuthProvider } from '@/service/AuthProvider';
import { i18nModel, PreferenceStoreState } from '@/stores/preferenceStore';

export default Vue.extend({
  name: 'Sidebar',
  computed: {
    iAuthProvider: ()=>AuthProvider(),
    iMenuStore(): MenuStoreState {
      return this.$store.state.menuStore;
    },
    iPreferenceStore(): PreferenceStoreState {
      return this.$store.state.preferenceStore;
    },
    i18n(): i18nModel {
      return this.iPreferenceStore.i18n;
    },
    menuRoot(): MenuItem[] {
      return this.iMenuStore.menuRoot;
    },
    sysMenuRoot(): MenuItem {
      return this.iMenuStore.sysMenuRoot;
    },
  },
  methods: {
    navigateToHome(){
      VueRouterHelper.navigateToIfNeeded(this.$router, '/');
    },
    async navigateTo(targetPath: string, code: string){
      if (code === 'logout') {
        await this.iAuthProvider.logout();
        VueRouterHelper.navigateToIfNeeded(this.$router, '/');
        return;
      }
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
</script>
