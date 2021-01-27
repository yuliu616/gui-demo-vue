<template>
  <div id="app" v-show="loggedIn" class="ui pusher">

    <div class="banner">
    </div>

    <div class="rootPanel">
      <div class="mainPanel">

        <div class="headerSection">
          <div class="logo" v-on:click="navigateToHome()">
            <img alt="logo" src="./assets/logo.png"
              v-if="showProdLogo" v-bind:style="{ backgroundColor: logoBackgroundColor }" />
            <img alt="logo" src="./assets/logo-dev.png"
              v-if="showDevLogo" v-bind:style="{ backgroundColor: logoBackgroundColor }" />
          </div>
          <div class="menubar">
            <menu-bar />
          </div>
          <div class="breadcrumb">
            <breadcrumb />
          </div>
          <div class="toggleSideBarButton">
            <sidebar-toggle />
          </div>
          <div class="sysMenu">
            <system-menu />
          </div>
        </div>

        <div class="mainSection">
          <div class="contentView">
            <transition name="faded-slide">
              <router-view/>
            </transition>
          </div>
          <div class="footer">
            <page-footer />
          </div>
        </div>
        
        <div class="historyView">
          <history-list />
        </div>
        <div class="messageView">
          <message-log />
        </div>
      
      </div>
    </div>

  </div>
</template>

<script>
import Breadcrumb from './components/Breadcrumb.vue';
import HistoryList from './components/HistoryList.vue';
import MenuBar from './components/MenuBar.vue';
import MessageLog from './components/MessageLog.vue';
import PageFooter from './components/PageFooter.vue';
import SidebarToggle from './components/SidebarToggle.vue';
import SystemMenu from './components/SystemMenu.vue';
import { navigateToIfNeeded } from './util/VueRouterHelper';
import { fixSemanticUiDropdown } from './util/SemanticFix';

export default {
  data(){
    return {
      showProdLogo: process.env.VUE_APP_LOGO_USE=='PROD',
      showDevLogo: process.env.VUE_APP_LOGO_USE=='DEV',
      logoBackgroundColor: process.env.VUE_APP_LOGO_BG_COLOR,
    };
  },
  computed: {
    loggedIn: self=>self.$store.state.authStore.loggedIn,
  },
  components: {
    Breadcrumb,
    MenuBar,
    MessageLog,
    HistoryList,
    PageFooter,
    SystemMenu,
    SidebarToggle,
  },
  mounted(){
    // initialize code for Semantic UI javascript
    fixSemanticUiDropdown();
  },
  methods: {
    navigateToHome: function(){
      navigateToIfNeeded(this.$router, '/');
    },
  },
};
</script>

<style>
.faded-slide-enter-active,
.faded-slide-leave-enter {
  transform: translateX(0);
  transition: all .15s ease-in;
}
.faded-slide-enter,
.faded-slide-leave-to {
  transform: translateX(30%);
  opacity: 0;
}
</style>

<style scoped>

div.banner {
  width: 100%;
  height: 6em;
  background-image: url('./assets/banner.jpg');
  background-size: 65%;
}

div.rootPanel {
  width: 100%;
  height: calc(100% - 6em);
  background: black linear-gradient(90deg,
      rgba(0,20,60,1) 0%, 
      rgba(0,20,21,1) 20%,
      rgba(2,0,36,1) 50%,
      rgba(0,20,21,1) 80%,
      rgba(0,20,60,1) 100%);
}

div.mainPanel {
  max-width: 100em;
  height: 100%;
  margin: auto;
  display: grid;
  grid-template-columns: 14 auto 15;
  grid-template-rows: 8em auto;
}

div.headerSection {
  width: 71em;
  grid-column: 2 / 3;
  grid-row: 1 / 2;
  display: grid;
  grid-template-columns: 7.5em auto 4em 4em;
  grid-template-rows: 5em 3em;
}
div.logo {
  grid-column: 1;
  grid-row: 1/3;
}
div.breadcrumb {
  grid-column: 2;
  grid-row: 1;
}
div.menubar {
  grid-column: 2;
  grid-row: 2;
}
div.toggleSideBarButton {
  display: none;
  grid-column: 3;
  grid-row: 1 / 3;
  margin-top: 5em;
}
div.sysMenu {
  grid-column: 4;
  grid-row: 1 / 3;
  margin-top: 5em;
}

div.mainSection {
  width: 71em;
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 2;
  overflow: auto;
}

div.contentView {
  padding: 3px;
}

div.footer {
  margin-top: 2em;
  text-align: center;
  color: lightgrey;
  font-family: monospace;
  font-size: 0.8em;
  font-style: italic;
}

div.historyView {
  grid-column-start: 1;
  grid-column-end: 1;
  grid-row-start: 1;
  grid-row-end: 3;
  padding: 0.4em;
  overflow: hidden;
}

div.messageView {
  grid-column-start: 3;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 3;
  padding: 0.4em;
  overflow: hidden;
}

/* if not extra-wide view */
@media screen and (max-width: 1400px) {
  div.historyView {
    display: none;
  }
  div.messageView {
    display: none;
  }
}

/* mobile vertical view */
@media screen and (max-width: 1000px) {
  div.banner {
    display: none;
  }
  div.breadcrumb {
    display: none;
  }
  div.menubar {
    display: none;
  }
  div.toggleSideBarButton {
    display: block;
  }
  div.rootPanel {
    height: 100%;
  }
  div.headerSection {
    width: auto;
  }
  div.mainSection {
    width: auto;
  }
  div.logo {
    min-width: 3.5em;
    height: 3.5em;
  }
}
/* mobile landscape view */
@media screen and (max-height: 600px) {
  div.banner {
    display: none;
  }
  div.rootPanel {
    height: 100%;
  }
  div.mainPanel {
    display: block;
  }
  div.headerSection {
    display: none;
  }
  div.mainSection {
    height: 100%;
    margin: auto;
  }
}

/* mobile vertical view */
@media screen and (max-width: 1000px) {
  div.mainPanel {
    grid-template-columns: auto;
  }
}

#app {
  width: 100%;
  height: 100%;
}

.logo img {
  width: 90px;
  height: 90px;
  margin: 16px 6px;
}

</style>