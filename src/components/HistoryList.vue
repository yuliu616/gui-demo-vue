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
import { navigateToIfNeeded } from '../util/VueRouterHelper';

export default {
  name: 'HistoryList',
  data() {
    return {
      historyList: [
        {viewName: "People List", cat: "People", path: "/people/list"},
        {viewName: "People View", cat: "People", path: "/people/item/12/view"},
        {viewName: "Message", cat: "People", path: "/message"},
      ],
    };
  },
  methods: {
    onCardClicked(historyItem){
      navigateToIfNeeded(this.$router, historyItem.path);
    },
  },
  components: {
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