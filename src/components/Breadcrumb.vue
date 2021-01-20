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
import { navigateToIfNeeded } from '../util/VueRouterHelper';

export default {
  name: 'Breadcrumb',
  data() {
    return {
      currentLocationNodeList: [
        { name: 'Second' },
        { name: 'Third' },
      ],
    };
  },
  methods: {
    navigateToHome: function(){
      navigateToIfNeeded(this.$router, '/');
    },
    navigateTo: function(targetPath){
      navigateToIfNeeded(this.$router, targetPath);
    },
  },
  components: {
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