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
    async navigateTo(targetPath, code){
      navigateToIfNeeded(this.$router, targetPath);
    },
  },
  components: {
  },
};
</script>