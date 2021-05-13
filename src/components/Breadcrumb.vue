<template>
  <div>
    <a-breadcrumb class="breadcrumb">
      <span slot="separator">
        <a-icon type="caret-right" class="breadcrumb-separator" />
      </span>
      <a-breadcrumb-item href="">
        <a-icon type="home" class="breadcrumb-home icon" 
        v-on:click="navigateToHome()" />
      </a-breadcrumb-item>
      <a-breadcrumb-item :key="node.name"
      v-for="node in nodeListExceptLast">
        <span class="breadcrumb-text"
        v-on:click="navigateTo(node.path)">
          {{ i18n.t('view', 'view.'+node.name) }}
        </span>
      </a-breadcrumb-item>
      <a-breadcrumb-item>
        <span class="last breadcrumb-text">
          {{ i18n.t('view', 'view.'+lastNodeName) }}
        </span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Route } from 'vue-router';
import { i18nModel, PreferenceStoreState } from '@/stores/preferenceStore';

import { VueRouterHelper } from '../util/VueRouterHelper';

export default Vue.extend({
  name: 'Breadcrumb',
  data(): ViewStateModel {
    return {
      currentLocationNodeList: [],
    };
  },
  computed: {
    iPreferenceStore(): PreferenceStoreState {
      return this.$store.state.preferenceStore;
    },
    i18n(): i18nModel {
      return this.iPreferenceStore.i18n;
    },
    nodeListExceptLast(): PathNode[] {
      if (this.currentLocationNodeList.length > 1) {
        return this.currentLocationNodeList.slice(0, 
          this.currentLocationNodeList.length-1);
      } else {
        return [];
      }
    },
    lastNodeName(): string {
      if (this.currentLocationNodeList.length > 0) {
        return this.currentLocationNodeList[this.currentLocationNodeList.length-1].name;
      } else {
        return 'Home';
      }
    }
  },
  mounted(){
    this.rebuildCurrentRouteNodeList();
  },
  methods: {
    navigateToHome: function(){
      VueRouterHelper.navigateToIfNeeded(this.$router, '/');
    },
    navigateTo: function(targetPath: string){
      VueRouterHelper.navigateToIfNeeded(this.$router, targetPath);
    },
    rebuildCurrentRouteNodeList(){
      let itemIndex = this.$router.currentRoute.matched.length-1;
      let lastMatchedRoute =
        this.$router.currentRoute.matched[itemIndex];
      let stackOfCurrentRoute: {name:string, path:string}[] = [];
      VueRouterHelper.buildCurrentRouteStack(lastMatchedRoute, this.$router.currentRoute.params, stackOfCurrentRoute);
      stackOfCurrentRoute = stackOfCurrentRoute.reverse();
      this.currentLocationNodeList = stackOfCurrentRoute;
    },
  },
  components: {
  },
  watch: {
    $route(to: Route, from: Route){
      this.rebuildCurrentRouteNodeList();
    },
  },
});

interface ViewStateModel {
  currentLocationNodeList: PathNode[];
}

interface PathNode {
  name:string;
  path:string;
}
</script>

<style scoped>
.breadcrumb {
  margin: 4px 4px 4px 4px;
}
.breadcrumb-home.icon {
  color: black;
}
.breadcrumb-separator {
  color: rgb(31, 31, 31);
}
.breadcrumb-text {
  color: black;
  cursor: pointer;
}
.last.breadcrumb-text {
  color: grey;
  cursor: default;
}
</style>