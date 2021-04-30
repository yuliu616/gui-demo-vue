<template>
  <div class="history my cards">
    
    <a-card hoverable class="history card"
    :body-style="{ 
      padding: '1.2em',
    }"
    v-for="it in historyList" :key="it.path"
    v-on:click="onCardClicked(it)">
      <a-card-meta class="view-name" :title="i18n.view['view.'+it.viewName]">
      </a-card-meta>
      <span class="my blue label">
        {{ it.cat }}
      </span>
      <span class="my olive label" v-for="tag in it.tags" :key="tag">
        {{ tag }}
      </span>
    </a-card>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { VueRouterHelper } from '../util/VueRouterHelper';
import { i18n } from '@/translation/i18n';

export default Vue.extend({
  name: 'HistoryList',
  data(): ViewStateModel {
    return {
      historyList: [
        // {viewName: "People List", cat: "People", path: "/people/list"},
        // {viewName: "People View", cat: "People", path: "/people/item/12/view"},
        // {viewName: "Message", cat: "People", path: "/message"},
      ],
    };
  },
  computed:{
    i18n:()=>i18n,
  },
  mounted(){
    this.addCurrentRouteToHistory();
  },
  methods: {
    onCardClicked(historyItem: HistoryItem){
      VueRouterHelper.navigateToIfNeeded(this.$router, historyItem.path);
    },
    addToHistoryList(route: HistoryItem){
      // if already exists, remove the existing before adding
      let found = this.historyList.findIndex(it=>it.path === route.path);
      if (found >= 0) {
        this.historyList.splice(found, 1);
      }
      this.historyList.push(route);
    },
    addCurrentRouteToHistory(){
      let router: VueRouter = this.$router;
      let firstMatchedRoute = router.currentRoute.matched[0];
      let routeParams = router.currentRoute.params;
      let lastMatchedRoute = 
        router.currentRoute.matched[router.currentRoute.matched.length-1];
      let currentRoutePath = VueRouterHelper.getExactPathForRouteWithParams(
        lastMatchedRoute.path, router.currentRoute.params);
      this.addToHistoryList({
        viewName: lastMatchedRoute.name || '',
        tags: routeParams ? Object.values(routeParams) : [],
        cat: firstMatchedRoute.name || '',
        path: currentRoutePath,
      });
    }
  },
  components: {
  },
  watch: {
    $route(to: Route, from: Route){
      this.addCurrentRouteToHistory();
    },
  },
});

interface ViewStateModel {
  historyList: HistoryItem[];
}

interface HistoryItem {
  viewName: string;
  tags: string[];
  cat: string;
  path: string;
}
</script>

<style scoped>
div.history.cards {
  margin-top: 10em;
  background-color: transparent;
}

div.history.card {
  width: 18em;
  font-size: 80%;
}
div.view-name {
  margin-bottom: 4px;
}
</style>