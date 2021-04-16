<template>
  <div class="ui floating icon dropdown button">
    <i class="th icon"></i>
    <div class="menu">
      <template v-for="menu in menuRoot">
        <div class="divider" v-if="menu.insertDivider"></div>
        <div class="item" v-on:click="navigateTo(menu.targetPath, menu.code)">
          {{ menu.title }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VueRouter from 'vue-router';
import { VueRouterHelper } from '../util/VueRouterHelper';
import { MessageType } from '../stores/messageStore';
import { message_text } from "../translation/en/message";
import { word_text } from "../translation/en/word";
// import { sendMessage } from '../util/ViewCommonFunction';
import { MenuItem } from '../stores/menuStore';

export default Vue.extend({
  name: 'SystemMenu',
  data(): ViewStateModel {
    let menuList: MenuItem[] = [
      { code: 'about', title: 'About', targetPath: '/about' },
      { code: 'logout', title: 'Logout', insertDivider: true },
    ];
    return {
      menuRoot: menuList,
    };
  },
  methods: {
    // sendMessage,
    async navigateTo(targetPath: string, code: string){
      // let router: VueRouter = this.$router;
      if (code === 'logout') {
        await this.$store.dispatch('authStore/doLogout');
        await this.$store.dispatch('messageStore/add', {
          viewName: word_text['word.login'],
          type: MessageType.INFO,
          text: message_text['sentence.login.logoutDone'],
        });
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