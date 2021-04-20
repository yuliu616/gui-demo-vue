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
    <a-button style="margin-left: 8px">
      <a-icon type="dash" />
    </a-button>
  </a-dropdown>
</template>

<script lang="ts">
import Vue from 'vue';
import VueRouter from 'vue-router';
import { VueRouterHelper } from '../util/VueRouterHelper';
import { MessageType } from '../stores/messageStore';
import { message_text } from "../translation/en/message";
import { word_text } from "../translation/en/word";
import { MenuItem } from '../stores/menuStore';
import { AuthProvider, AuthProviderImpl } from '@/service/AuthProvider';
import { MessageService, MessageServiceImpl } from '@/service/MessageService';

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