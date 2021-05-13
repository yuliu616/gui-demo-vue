<template>
  <div class="background" v-if="!loggedIn" 
    v-bind:class="{morning: isMorningTime, dayTime: isDayTime, night: isNightTime}">
    
    <a-card class="my login solo card" 
    :head-style="{
      'text-align': 'center',
    }"
    :title="i18n.message['sentence.systemName']">
      <a-form layout="inline"
      :wrapper-col="{ span: 24 }" 
      @submit.prevent="submittingLoginForm()">

        <a-form-item :label="i18n.model.LoginForm['field.username']" class="w100">
          <a-input v-model="username"
          :placeholder="i18n.model.LoginForm['field.username']" auto-focus />
        </a-form-item>
        <a-form-item :label="i18n.model.LoginForm['field.password']" class="w100">
          <a-input-password v-model="password"
          :placeholder="i18n.model.LoginForm['field.password']" />
        </a-form-item>

        <a-form-item style="margin-top: 1.4em;" class="w100">
          <a-button type="primary" html-type="submit">
            {{ i18n.word['action.login'] }}
          </a-button>
          <div class="my lead circular plain button sq40" 
          v-on:click="changeLocale(LocaleCode.zh)"
          style="font-size:85%; padding: 0; margin-left: 95px;">
            中文
          </div>
          <div class="my milk circular plain button sq40" 
          v-on:click="changeLocale(LocaleCode.en)"
          style="font-size:85%; padding: 0;">
            Eng
          </div>
        </a-form-item>

      </a-form>
    </a-card>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { MessageService } from '@/service/MessageService';
import { AuthProvider } from '@/service/AuthProvider';
import VueRouter, { Route } from 'vue-router';
import { LocaleCode } from './model/Locale';
import { i18nModel, PreferenceStoreState } from './stores/preferenceStore';

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
    viewName(): string{ return this.i18n.view['view.Login']},
    iMessageService: ()=>MessageService(),
    iAuthProvider: ()=>AuthProvider(),
    iPreferenceStore(): PreferenceStoreState {
      return this.$store.state.preferenceStore;
    },
    i18n(): i18nModel {
      return this.iPreferenceStore.i18n;
    },
    loggedIn(): boolean {
      return this.iAuthProvider.isLoggedIn();
    },
    LocaleCode: ()=>LocaleCode,
  },
  mounted: function(){
    this.refreshBackground();
  },
  methods: {
    refreshBackground(){
      let hourOfDay = new Date().getHours();
      this.isMorningTime = (hourOfDay >= 6 && hourOfDay <= 11);
      this.isDayTime = (hourOfDay > 11 && hourOfDay <= 19);
      this.isNightTime = (hourOfDay > 19 || hourOfDay < 6);
    },
    async submittingLoginForm(){
      try {
        await this.iAuthProvider.login({
          username: this.username, 
          password: this.password,
        });

      } catch(err){
        // for security reason, dont send error object to messageService
        await this.iMessageService.errorMsg(this, null,
          this.i18n.message['sentence.login.failed'],
        );
        return;
      }
      // clear fields after login successfully
      this.username = '';
      this.password = '';
    },
    changeLocale(locale: LocaleCode){
      this.$store.dispatch('preferenceStore/changeLocale', locale);
    },
  },
  components: {
  },
  watch: {
    loggedIn(newValue: boolean) {
      if (!newValue) {
        this.refreshBackground();
      }
    },
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
  background-image: url('/images/morning.jpg');
  background-position: -700px 0px;
  background-size: 220%;
}

div.background.dayTime {
  background-image: url('/images/afternoon.jpg');
  background-position: 0px 0px;
  background-size: 200%;
}

div.background.night {
  background-image: url('/images/night.jpg');
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
  max-width: 22em;
  margin: auto;
}
@media screen and (min-height: 530px) {
  /* tablet height */
  div.login.solo.card {
    margin: 10% auto;
  }
}
@media screen and (min-height: 900px) {
  /* desktop heigth */
  div.login.solo.card {
    margin: 30% auto;
  }
}

div.login.header {
  padding-top: 0.6em;
  padding-bottom: 1.2em;
}
</style>