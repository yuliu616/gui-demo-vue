<template>
  <div id="breadcrumb">
    <a-breadcrumb>
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
          {{ node.name }}
        </span>
      </a-breadcrumb-item>
      <a-breadcrumb-item>
        <span class="last breadcrumb-text">{{ lastNodeName }}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Route } from 'vue-router';
import { i18n } from '@/translation/i18n';

import { VueRouterHelper } from '../util/VueRouterHelper';

export default Vue.extend({
  name: 'Breadcrumb',
  data(): ViewStateModel {
    return {
      currentLocationNodeList: [],
    };
  },
  computed: {
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
        return i18n.view['view.Home'];
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
#breadcrumb {
  display: flex;
  height: 100%;
  padding: 8px 8px;
}
#breadcrumb > div {
  align-self: flex-end;
}
.breadcrumb-home.icon {
  color: white;
}
.breadcrumb-separator {
  color: white;
}
.breadcrumb-text {
  color: white;
  cursor: pointer;
}
.last.breadcrumb-text {
  color: grey;
  cursor: default;
}
</style>