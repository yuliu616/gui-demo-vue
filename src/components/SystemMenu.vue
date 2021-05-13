<template>
  <a-dropdown>
    <a-menu slot="overlay">
      <template v-for="menu in sysMenuRoot.children">
        <a-menu-divider v-bind:key="(menu.code+'-div')" v-if="menu.insertDivider" />
        <a-menu-item v-bind:key="menu.code" style="padding: 0 1em 0 1em;"
        v-on:click="navigateTo(menu.targetPath, menu.code)">
          {{ menu.title }}
        </a-menu-item>
      </template>
    </a-menu>
    <a-button shape="circle">
      <a-icon type="dash" />
    </a-button>
  </a-dropdown>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueRouterHelper } from '../util/VueRouterHelper';
import { MenuItem, MenuStoreState } from '../stores/menuStore';
import { AuthProvider } from '@/service/AuthProvider';
import { MessageService } from '@/service/MessageService';

export default Vue.extend({
  name: 'SystemMenu',
  computed: {
    iAuthProvider: ()=>AuthProvider(),
    iMessageService: ()=>MessageService(),
    iMenuStore(): MenuStoreState {
      return this.$store.state.menuStore;
    },
    sysMenuRoot(): MenuItem {
      return this.iMenuStore.sysMenuRoot;
    },
  },
  methods: {
    async navigateTo(targetPath: string, code: string){
      if (code === 'logout') {
        await this.iAuthProvider.logout();
        VueRouterHelper.navigateToIfNeeded(this.$router, '/');
        return;
      }
      VueRouterHelper.navigateToIfNeeded(this.$router, targetPath);
    },
  },
  components: {
  },
});
</script>