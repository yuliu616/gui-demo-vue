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

<script>
import { navigateToIfNeeded } from '../util/VueRouterHelper';
import { MessageType } from '../stores/messageStore';
import { message_text } from "../translation/en/message";
import { view_name_text } from "../translation/en/word";
import { sendMessage } from '../util/ViewCommonFunction';

export default {
  name: 'SystemMenu',
  data() {
    return {
      menuRoot: [
        { code: 'about', title: 'About', targetPath: '/about' },
        { code: 'logout', title: 'Logout', insertDivider: true },
      ],
    };
  },
  methods: {
    sendMessage,
    async navigateTo(targetPath, code){
      if (code === 'logout') {
        await this.$store.dispatch('authStore/doLogout');
        this.sendMessage({
          viewName: view_name_text['word.login'],
          type: MessageType.INFO,
          text: message_text['sentence.login.logoutDone'],
        });
        return;
      }
      navigateToIfNeeded(this.$router, targetPath);
    },
  },
  components: {
  },
};
</script>