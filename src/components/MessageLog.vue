<template>
  <div class="message my cards">

    <a-card class="message small-gap card"
    :body-style="{ 
      padding: '1.2em',
    }"
    v-for="m in messageList" :key="m.id">
      <a-card-meta class="view-name" 
        :title="m.viewName" :description="m.text">
      </a-card-meta>
    </a-card>

  </div>
</template>

<script lang="ts">
import { Message } from '@/service/MessageService';
import Vue from 'vue';
import { MessageStoreState } from '../stores/messageStore';

export default Vue.extend({
  name: 'MessageLog',
  data() {
    return {
    };
  },
  computed: {
    iMessageStore(): MessageStoreState {
      return this.$store.state.messageStore;
    },
    // last 4 items in messageList
    messageList(): Message[] {
      return this.iMessageStore.messageList
        .slice().reverse().slice(0, 4).reverse();
    },
  },
  methods: {
  },
  components: {
  },
});
</script>

<style scoped>
div.message.cards {
  max-height: 40em;
  margin-top: 10em;
  background-color: transparent;
}

div.message.card {
  width: 18em;
  font-size: 90%;
}
</style>