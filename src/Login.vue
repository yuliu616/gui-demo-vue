<template>
  <div class="background" v-show="!loggedIn" 
    v-bind:class="{morning: isMorningTime, dayTime: isDayTime, night: isNightTime}">
    
    <div class="ui basic segment">
      <div class="ui login card">

        <div class="content">
          <div class="center aligned login header">GUI Demo</div>
          <form class="ui form" v-on:submit.prevent="submittingLoginForm()">

            <div class="field">
              <label>User Name</label>
              <input type="text" v-model="username"
                placeholder="User Name" autofocus>
            </div>
            <div class="field">
              <label>Password</label>
              <input type="password" v-model="password">
            </div>
            <div class="field">
              <input class="ui primary button" type="submit" value="Login">
            </div>
            
          </form>    
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { MessageType } from './stores/messageStore';
import { message_text } from "./translation/en/message";
import { view_name_text } from "./translation/en/word";
import { sendMessage } from './util/ViewCommonFunction';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      isMorningTime: false,
      isDayTime: false,
      isNightTime: true,
    };
  },
  computed: {
    loggedIn: self=>false,
  },
  mounted: function(){
    let hourOfDay = new Date().getHours();
    this.isMorningTime = (hourOfDay >= 6 && hourOfDay <= 11);
    this.isDayTime = (hourOfDay > 11 && hourOfDay <= 19);
    this.isNightTime = (hourOfDay > 19 || hourOfDay < 6);
  },
  methods: {
    sendMessage,
    async submittingLoginForm(){
    },
  },
  components: {
  },
};
</script>

<style scoped>
div.background {
  width: 100%;
  height: 100%;
}

div.background.morning {
  background-image: url('./assets/morning.jpg');
  background-position: -700px 0px;
  background-size: 220%;
}

div.background.dayTime {
  background-image: url('./assets/afternoon.jpg');
  background-position: 0px 0px;
  background-size: 200%;
}

div.background.night {
  background-image: url('./assets/night.jpg');
  background-position: -240px 0px;
  background-size: 200%;
}

@media screen and (max-width: 480px) {
  
  div.background.morning {
    background-position: -800px 0px;
    background-size: 650%;
  }
  div.background.dayTime {
    background-position: 0px 0px;
    background-size: 550%;
  }
  div.background.night {
    background-position: -800px 0px;
    background-size: 550%;
  }

}

@media screen and (min-width: 480px) and (max-width: 600px) {
  
  div.background.morning {
    background-position: -800px 0px;
    background-size: 440%;
  }
  div.background.dayTime {
    background-position: 0px -200px;
    background-size: 440%;
  }
  div.background.night {
    background-position: -800px 0px;
    background-size: 400%;
  }

}

@media screen and (min-width: 600px) and (max-width: 1000px) {
  
  div.background.morning {
    background-position: -600px 0px;
    background-size: 340%;
  }
  div.background.dayTime {
    background-size: 300%;
  }
  div.background.night {
    background-position: -740px 0px;
    background-size: 300%;
  }

}

div.login.card {
  margin: 25% auto;
}

div.login.header {
  padding-top: 0.6em;
  padding-bottom: 1.2em;
}
</style>