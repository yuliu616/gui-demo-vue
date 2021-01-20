<template>
  <div class="message ui cards">

    <div class="message card" v-for="m in messageList" :key="m.id">
      <div class="content">
        <div class="message header">
          {{ m.viewName }}
        </div>
        <div class="message description">
          {{ m.text }}
        </div>      
      </div>
  </div>

  </div>
</template>

<script>
export default {
  name: 'MessageLog',
  data() {
    return {
    };
  },
  computed: {
    messageList: ()=>[
      { id: 10, viewName: 'dummy', text: 'hello' },
      { id: 11, viewName: 'dummy', text: 'hello' },
    ],
  },
  methods: {
  },
  components: {
  },
};
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