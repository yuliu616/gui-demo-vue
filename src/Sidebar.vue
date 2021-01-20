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

<script>
import { navigateToIfNeeded } from './util/VueRouterHelper';

export default {
  name: 'Sidebar',
  data() {
    return {
    };
  },
  computed: {
    loggedIn: self=>false,
    menuRoot: self=>self.$store.state.menuStore.menuRoot,
  },
  methods: {
    navigateToHome: function(){
      navigateToIfNeeded(this.$router, '/');
    },
    navigateTo: function(targetPath){
      navigateToIfNeeded(this.$router, targetPath);
    },
    badgeOfMenu: function(code){
      if (code == 'message') {
        return this.$store.getters['messageStore/messageCount'];
      } else {
        return 0;
      }
    },
  },
  components: {
  },
};
</script>

<style scoped>

</style>
