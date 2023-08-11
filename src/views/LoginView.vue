<template>
  <main class="LoginViewBase"
    :class="{ morningBG: isMorningTime, dayTimeBG: isDayTime, nightTimeBG: isNightTime }"
  >
    <div class="my antd-solo-card holder LoginView">
      <div class="my LoginView wrapper">
        <a-spin :spinning="postInProgress"
        :tip="(i18n.word['word.processing']+' ...')">
          <template #indicator>
            <font-awesome-icon icon="cog" spin />
          </template>
          <a-card class="my solo-card LoginView"
            :title="i18n.message['sentence.systemName']"
            :head-style="{
              backgroundColor: '#ffffff80',
              color: PreferenceStore.colorPalette.fgColor,
            }"
          >
            <a-form @submit.prevent="(!postInProgress && doLogin())"
              layout="horizontal"
              :label-col="{ span: 24 }"
              :wrapper-col="{ span: 24 }"
            >
              <a-form-item :label="i18n.model.LoginForm['field.username']">
                <a-input v-model:value="username" autofocus allow-clear
                  :placeholder="i18n.model.LoginForm['field.username']"
                />
              </a-form-item>
              <a-form-item :label="i18n.model.LoginForm['field.password']">
                <a-input-password v-model:value="password"
                  :placeholder="i18n.model.LoginForm['field.password']"
                />
              </a-form-item>
              <a-form-item :wrapper-col="{ offset: 0 }">
                <a-space>
                  <a-button class="my antd-btn" type="primary" html-type="submit"
                    v-if="!AuthStore.loggedIn"
                    :ghost="PreferenceStore.darkTheme"
                  >
                    <template #icon>
                      <font-awesome-icon style="margin-right: 0.2em;" icon="key" />
                    </template>
                    {{ i18n.word['action.login'] }}
                  </a-button>
                  <a-button class="my antd-btn" danger
                    v-if="AuthStore.loggedIn" 
                    @click="doLogout()"
                    :ghost="PreferenceStore.darkTheme"
                  >
                    {{ i18n.word['action.logout'] }}
                  </a-button>
                  <a-select v-model:value="locale"
                    class="my antd-select"
                    :dropdownClassName="(PreferenceStore.darkTheme ? 'my antd-dropdown-menu-dark':'')"
                    style="min-width: 8em;"
                    :options="LocaleOptions"
                    allow-clear
                    :placeholder="i18n.message['sentence.chooseLanguage']">
                  </a-select>
                  <a-switch v-model:checked="isDarkTheme"
                    :checked-children="i18n.word['word.theme.dark']"
                    :un-checked-children="i18n.word['word.theme.light']"
                  />
                </a-space>
              </a-form-item>
            </a-form>
          </a-card>
        </a-spin>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { LocaleCode } from '@/model/LocaleCode';
import { AuthProvider } from '@/service/AuthProvider';
import { MessageService } from '@/service/MessageService';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { type KeyValueAndLabel } from '@/model/antd/KeyValueAndLabel';
import { i18nBundles, type i18nModel } from "@/translation/i18n";
import { ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useAuthStore } from '@/stores/AuthStore';
import type { ILogger } from '@/model/core/ILogger';
import { BrowserApiUtil } from '@/util/BrowserApiUtil';

let debug = !!(+import.meta.env.VITE_LoginForm_debug);
const logger: ILogger = console;

let localeRef = ref(LocaleCode.en);
let isDarkThemeRef = ref(false);

export default {
  computed: {
    viewName(): string { return this.i18n.view['view.Login']},
    iMessageService: ()=>MessageService(),
    PreferenceStore: ()=>usePreferenceStore(),
    iAuthProvider: ()=>AuthProvider(),
    AuthStore: ()=>useAuthStore(),
    i18n: ()=>usePreferenceStore().i18n,
    LocaleOptions: ()=>{
      let list = <KeyValueAndLabel[]>[];
      for (let key in LocaleCode){
        if (key == LocaleCode.en) {
          list.push({
            value: key,
            // label: PreferenceStore.i18n.t('core.word', 'word.enum.LocaleCode.'+key),
            label: (<i18nModel>i18nBundles['en']).core.word['word.enum.LocaleCode.en'],
          });
        } else if (key == LocaleCode.zh) {
          list.push({
            value: key,
            label: (<i18nModel>i18nBundles['zh']).core.word['word.enum.LocaleCode.zh'],
          });
        }
      }
      return list;
    },
    isMorningTime(): boolean {
      return (this.hourOfDay >= 6 && this.hourOfDay <= 11);
    },
    isDayTime(): boolean {
      return (this.hourOfDay > 11 && this.hourOfDay <= 19);
    },
    isNightTime(): boolean {
      return (this.hourOfDay > 19 || this.hourOfDay < 6);
    },
  },
  data(){
    return {
      postInProgress: ref(false),
      username: ref(debug ? 'user1001':''),
      password: ref(debug ? 'pass1234' :''),
      hourOfDay: ref(dayjs().hour()),
      // hourOfDay: ref(8),
      // hourOfDay: ref(12),
      // hourOfDay: ref(20),
      locale: localeRef,
      isDarkTheme: isDarkThemeRef,
      timer: ref(0),
    };
  },
  mounted() {
    localeRef.value = this.PreferenceStore.locale;
    isDarkThemeRef.value = this.PreferenceStore.darkTheme;
    
    watch(localeRef, (value: LocaleCode, prev: LocaleCode)=>{
      if (debug) logger?.log('locale changed to', value);
      this.PreferenceStore.setLocale(value);
    })

    watch(isDarkThemeRef, (value, pref)=>{
      if (debug) logger?.log('darkTheme change to:', value);
      this.PreferenceStore.setTheme(value);
    });

    // update 'hourOfDay' by a timer
    this.timer = BrowserApiUtil.createRepeatedTimerJob(
      ()=>new Promise((resolve, reject)=>{
        this.hourOfDay = dayjs().hour();
        // this.hourOfDay = dayjs().second() % 24;
        if (debug) logger?.log('check hourOfDay:', this.hourOfDay);  
      }), 
      'LoginViewTimeCheck', 10_000
    );
  },
  unmounted(){
    if (this.timer) {
      BrowserApiUtil.removeRepeatedTimerJob(this.timer);
      this.timer = 0;
    }
  },
  methods: {
    async doLogin(){
      try {
        this.postInProgress = true;
        await this.iAuthProvider.login({ 
          username: this.username,
          password: this.password,
        });

        // clear fields after login successfully
        this.username = '';
        this.password = '';
        
        this.$router.push('/'); // home

      } catch (err) {
        await this.iMessageService.errorMsg(this, err,
          this.i18n.message['sentence.login.failed'],
        );
      } finally {
        this.postInProgress = false;
      }

    },
    async doLogout(){
      await this.iAuthProvider.logout();
    },
    changeLocale(locale: LocaleCode){
      this.PreferenceStore.setLocale(locale);
    },
  },
};
</script>

<style scoped>
main.LoginViewBase {
  width: 100%;
  height: 100%;
}

div.my.antd-solo-card.holder.LoginView {
  padding-top: 25%;
  margin-left: calc(100% - 32em);
  margin-right: calc(2% + 0.8em);
}

div.my.LoginView.wrapper {
  background-color: rgba(255, 255, 255, 0.62);
}
div.view-wrapper.dark div.my.LoginView.wrapper {
  background-color: rgba(0, 0, 0, 0.62);
}

div.my.LoginView {
  background-color: transparent;
}

main.morningBG {
  background-image: url('/images/morning.jpg');
  background-position: -700px 0px;
  background-size: 220%;
}
main.dayTimeBG {
  background-image: url('/images/afternoon.jpg');
  background-position: 0px 0px;
  background-size: 180%;
}
main.nightTimeBG {
  background-image: url('/images/night.jpg');
  background-position: -240px 0px;
  background-size: 180%;
}

@media screen and (min-width: 1400px) {
  main.morningBG {
    background-size: 180%;
  }
  main.dayTimeBG {
    background-size: 140%;
  }
  main.nightTimeBG {
    background-size: 140%;
  }
}

@media screen and (max-width: 600px) {
  div.my.antd-solo-card.holder.LoginView {
    padding-top: 0.2em;
    margin-left: auto;
    margin-right: auto;
  }

  main.morningBG {
    background-size: 400%;
  }
  main.dayTimeBG {
    background-size: 360%;
  }
  main.nightTimeBG {
    background-size: 360%;
  }
}
</style>
