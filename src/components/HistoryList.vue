<template>
  <div class="history ui link cards">

    <div class="history card" v-for="it in historyList" :key="it.path"
      v-on:click="onCardClicked(it)">
      <div class="content">
        <div class="history description">
          {{ it.viewName }}
          <span class="ui right floated blue cat small label">
            {{ it.cat }}
          </span>
        </div>      
      </div>
  </div>

  </div>
</template>

<script>
import { navigateToIfNeeded, getExactPathForRouteWithParams } from '../util/VueRouterHelper';

export default {
  name: 'HistoryList',
  data() {
    return {
      historyList: [
        // {viewName: "People List", cat: "People", path: "/people/list"},
        // {viewName: "People View", cat: "People", path: "/people/item/12/view"},
        // {viewName: "Message", cat: "People", path: "/message"},
      ],
    };
  },
  mounted(){
    this.addCurrentRouteToHistory();
  },
  methods: {
    onCardClicked(historyItem){
      navigateToIfNeeded(this.$router, historyItem.path);
    },
    addToHistoryList(route){
      // if already exists, remove the existing before adding
      let found = this.historyList.findIndex(it=>it.path === route.path);
      if (found >= 0) {
        this.historyList.splice(found, 1);
      }
      this.historyList.push(route);
    },
    addCurrentRouteToHistory(){
      let firstMatchedRoute = this.$router.currentRoute.matched[0];
      let lastMatchedRoute = 
        this.$router.currentRoute.matched[this.$router.currentRoute.matched.length-1];
      let currentRoutePath = getExactPathForRouteWithParams(
        lastMatchedRoute.path, this.$router.currentRoute.params);
      this.addToHistoryList({
        viewName: lastMatchedRoute.name,
        cat: firstMatchedRoute.name,
        path: currentRoutePath,
      });
    }
  },
  components: {
  },
  watch: {
    $route(to, from){
      this.addCurrentRouteToHistory();
    },
  },
};
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
</style>