<template>
  <div id="breadcrumb">
    <div class="ui breadcrumb">
      <a class="section" v-on:click="navigateToHome()">
        Home
      </a>
      <template v-for="node in currentLocationNodeList">
        <i class="right chevron circular inverted icon divider"></i>
        <a class="section" v-on:click="navigateTo(node.path)">
          {{ node.name }}
        </a>
      </template>
    </div>
  </div>
</template>

<script>
import { navigateToIfNeeded, buildCurrentRouteStack } from '../util/VueRouterHelper';

export default {
  name: 'Breadcrumb',
  data() {
    return {
      currentLocationNodeList: [],
    };
  },
  mounted(){
    this.rebuildCurrentRouteNodeList();
  },
  methods: {
    navigateToHome: function(){
      navigateToIfNeeded(this.$router, '/');
    },
    navigateTo: function(targetPath){
      navigateToIfNeeded(this.$router, targetPath);
    },
    rebuildCurrentRouteNodeList(){
      let lastMatchedRoute = this.$router.currentRoute.matched[this.$router.currentRoute.matched.length-1];
      let stackOfCurrentRoute = [];
      buildCurrentRouteStack(lastMatchedRoute, this.$router.currentRoute.params, stackOfCurrentRoute);
      stackOfCurrentRoute = stackOfCurrentRoute.reverse();
      this.currentLocationNodeList = stackOfCurrentRoute;
    },
  },
  components: {
  },
  watch: {
    $route(to, from){
      this.rebuildCurrentRouteNodeList();
    },
  },
};

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
</style>