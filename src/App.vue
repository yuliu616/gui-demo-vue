<template>
<a-config-provider :locale="antdLocale">
  <div class="appDiv" v-if="loggedIn">

    <a-drawer class="sidebar-drawer"
      placement="left"
      v-bind:body-style="{
        'padding':0,
      }"
      v-on:close="onSidebarDrawerClose"
      v-bind:closable="false"
      mask-closable
      v-bind:visible="sidebarVisible">
      <sidebar></sidebar>
    </a-drawer>

    <div class="header-pane">
      <a-button class="sidebar-menu-button" 
        v-on:click="toggleSidebar()"
        shape="circle" icon="menu"
      />
      <breadcrumb class="breadcrumb" />
      <menu-bar class="menu-bar" />
      <a-button class="message-menu-button" 
        v-on:click="navigateTo('/message')"
        shape="circle" icon="message"
      />
      <system-menu class="sys-menu" />

      <div class="header-logo" v-on:click="navigateToHome()">
        <div class="header-logo-wrapper"
        v-bind:style="{ backgroundColor: iPreferenceStore.logoBackgroundColor }">
          <img class="ui mini image" src="/images/logo.png"
            v-if="iPreferenceStore.showProdLogo" v-bind:style="{ backgroundColor: iPreferenceStore.logoBackgroundColor }" />
          <img class="ui mini image" src="/images/logo-dev.png"
            v-if="iPreferenceStore.showDevLogo" v-bind:style="{ backgroundColor: iPreferenceStore.logoBackgroundColor }" />
        </div>
      </div>
    </div>

    <div class="body-pane">
      <transition name="faded-slide">
        <router-view class="view-wrapper" />
      </transition>
      <page-footer class="page-footer"></page-footer>
    </div>

  </div>
</a-config-provider>
</template>

<script lang="ts">
import Vue from 'vue';
import Breadcrumb from './components/Breadcrumb.vue';
import HistoryList from './components/HistoryList.vue';
import MenuBar from './components/MenuBar.vue';
import MessageLog from './components/MessageLog.vue';
import PageFooter from './components/PageFooter.vue';
import SystemMenu from './components/SystemMenu.vue';
import Sidebar from './components/Sidebar.vue';
import { VueRouterHelper } from './util/VueRouterHelper';
import { AuthProvider } from '@/service/AuthProvider';
import { getAntdLocale } from '@/model/Locale';
import { i18nModel, PreferenceStoreState } from './stores/preferenceStore';

export default Vue.extend({
  data(): ViewStateModel {
    return {
      sidebarVisible: false,
    };
  },
  computed: {
    iAuthProvider:()=>AuthProvider(),
    iPreferenceStore(): PreferenceStoreState {
      return this.$store.state.preferenceStore;
    },
    i18n(): i18nModel {
      return this.iPreferenceStore.i18n;
    },
    antdLocale(): any {
      return getAntdLocale(this.iPreferenceStore.locale);
    },
    loggedIn(): boolean {
      return this.iAuthProvider.isLoggedIn();
    },
  },
  components: {
    Breadcrumb,
    MenuBar,
    MessageLog,
    HistoryList,
    PageFooter,
    SystemMenu,
    Sidebar,
  },
  methods: {
    navigateToHome(){
      VueRouterHelper.navigateToIfNeeded(this.$router, '/');
    },
    async navigateTo(targetPath: string){
      VueRouterHelper.navigateToIfNeeded(this.$router, targetPath);
    },
    toggleSidebar(){
      this.sidebarVisible = !this.sidebarVisible;
    },
    onSidebarDrawerClose(){
      this.sidebarVisible = false;
    },
  },
});

interface ViewStateModel {
  sidebarVisible: boolean;
}
</script>

<style scoped>
/*** layout styles ***/
/* div.appDiv {} */
div.header-pane {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 0 5px 2px 5px;
  background-color: white;
}
div.body-pane {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px;
}
div.body-pane > div {
  max-width: 1200px;
  overflow: hidden;
}
/* .page-footer {} */

/*** component styles ***/
.breadcrumb {
  display: inline-block;
}
.menu-bar {
  display: inline-block;
  flex-grow: 1; 
  align-self: stretch;
}
.message-menu-button {
  display: block;
}
.sys-menu {
  display: block;
}
.header-logo {
  display: none;
  margin: 2px;
  padding: 2px;
}
.header-logo-wrapper {
  display: inline-block;
  padding: 4px;
  border-radius: 16px;
}
.sidebar-menu-button {
  display: none;
}
/* .view-wrapper {} */


/*** responsive overriding ***/
@media screen and (max-width: 1024px) {
  div.header-pane {
    flex-direction: row-reverse;
    background-color: silver;
  }
  .breadcrumb {
    display: none;
  }
  .menu-bar {
    display: none;
  }
  .sys-menu {
    display: none;
  }
  .header-logo {
    display: block;
    flex-grow: 1;
  }
  .sidebar-menu-button {
    display: block;
  }
}
</style>