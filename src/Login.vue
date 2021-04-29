<template>
  <div class="background" v-if="!loggedIn" 
    v-bind:class="{morning: isMorningTime, dayTime: isDayTime, night: isNightTime}">
    
    <a-card class="my login solo card" 
    :head-style="{
      'text-align': 'center',
    }"
    title="GUI Demo">
      <a-form layout="inline"
      :wrapper-col="{ span: 24 }" 
      @submit.prevent="submittingLoginForm()">

        <a-form-item label="User Name">
          <a-input v-model="username"
          placeholder="User Name" auto-focus />
        </a-form-item>
        <a-form-item label="Password">
          <a-input-password v-model="password"
            placeholder="input password" />
        </a-form-item>

        <a-form-item style="margin-top: 1.4em;">
          <a-button type="primary" html-type="submit">
            Login
          </a-button>
        </a-form-item>

      </a-form>
    </a-card>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { MessageType } from './stores/messageStore';
import { message_text } from "./translation/en/message";
import { word_text } from "./translation/en/word";
import { MessageService } from '@/service/MessageService';
import { AuthProvider } from '@/service/AuthProvider';

export default Vue.extend({
  name: 'Login',
  data(): ViewStateModel {
    return {
      username: '',
      password: '',
      isMorningTime: false,
      isDayTime: false,
      isNightTime: true,
    };
  },
  computed: {
    iMessageService: ()=>MessageService(),
    iAuthProvider: ()=>AuthProvider(),
    loggedIn(): boolean {
      return this.iAuthProvider.isLoggedIn();
    },
  },
  mounted: function(){
    let hourOfDay = new Date().getHours();
    this.isMorningTime = (hourOfDay >= 6 && hourOfDay <= 11);
    this.isDayTime = (hourOfDay > 11 && hourOfDay <= 19);
    this.isNightTime = (hourOfDay > 19 || hourOfDay < 6);
  },
  methods: {
    async submittingLoginForm(){
      try {
        await this.iAuthProvider.login({
          username: this.username, 
          password: this.password,
        });

      } catch(err){
        await this.iMessageService.sendMessage({
          viewName: word_text['word.login'],
          type: MessageType.ERROR,
          text: message_text['sentence.login.failed'],
        });
        return;
      }
      // clear fields after login successfully
      this.username = '';
      this.password = '';
    },
  },
  components: {
  },
});

interface ViewStateModel {
  username: string;
  password: string;
  isMorningTime: boolean;
  isDayTime: boolean;
  isNightTime: boolean;
}
</script>

<style scoped>
div.background {
  width: 100%;
  height: 100%;
  padding: 1px;
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

div.login.solo.card {
  max-width: 24em;
  margin: 25% auto;
}

div.login.header {
  padding-top: 0.6em;
  padding-bottom: 1.2em;
}
</style>