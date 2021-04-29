<template>
  <a-dropdown>
    <a-menu slot="overlay">
      <template v-for="menu in menuRoot">
        <a-menu-divider v-bind:key="(menu.code+'-div')" v-if="menu.insertDivider" />
        <a-menu-item v-bind:key="menu.code" 
        v-on:click="navigateTo(menu.targetPath, menu.code)">
          {{ menu.title }}
        </a-menu-item>
      </template>
    </a-menu>
    <a-button size="large">
      <a-icon type="dash" />
    </a-button>
  </a-dropdown>
</template>

<script lang="ts">
import Vue from 'vue';
import { VueRouterHelper } from '../util/VueRouterHelper';
import { MenuItem } from '../stores/menuStore';
import { AuthProvider } from '@/service/AuthProvider';
import { MessageService } from '@/service/MessageService';

export default Vue.extend({
  name: 'SystemMenu',
  data(): ViewStateModel {
    return {
      menuRoot: [
        { code: 'about', title: 'About', targetPath: '/about' },
        { code: 'logout', title: 'Logout', insertDivider: true },
      ],
    };
  },
  computed: {
    iAuthProvider: ()=>AuthProvider(),
    iMessageService: ()=>MessageService(),
  },
  methods: {
    async navigateTo(targetPath: string, code: string){
      if (code === 'logout') {
        await this.iAuthProvider.logout();
        return;
      }
      VueRouterHelper.navigateToIfNeeded(this.$router, targetPath);
    },
  },
  components: {
  },
});

interface ViewStateModel {
  menuRoot: MenuItem[];
}
</script>