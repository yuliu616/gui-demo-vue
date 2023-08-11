<template>
  <header v-if="AuthStore.loggedIn">
    <MenuBar />
    <MenuStack />
  </header>

  <a-config-provider :locale="locale">
    <div :class="{ loggedIn: AuthStore.loggedIn, dark: darkTheme, light: !darkTheme, }"
      class="view-wrapper"
    >
      <RouterView />
    </div>
    <PageFooter v-if="AuthStore.loggedIn" />
  </a-config-provider>
</template>

<script lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore';
import { useMenuStore, type MenuItem } from '@/stores/MenuStore';
import PageFooter from '@/components/PageFooter.vue';
import MenuBar from './components/MenuBar.vue';
import MenuStack from './components/MenuStack.vue';
import { NativeDomUtil } from './util/NativeDomUtil';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { LocaleCode } from './model/LocaleCode';
import en_US from 'ant-design-vue/es/locale/en_US';
import zh_CN from 'ant-design-vue/es/locale/zh_CN';
// import ja_JP from 'ant-design-vue/es/locale/ja_JP';
import { ref } from 'vue';
import type { ILogger } from './model/core/ILogger';

const logger: ILogger = console;

export default {
  components: {
    RouterLink,
    RouterView,
    MenuBar,
    MenuStack,
    PageFooter,
  },
  computed: {
    PreferenceStore: ()=>usePreferenceStore(),
    MenuStore: ()=>useMenuStore(),
    i18n: ()=>usePreferenceStore().i18n,
    AuthStore: ()=>useAuthStore(),
  },
  data() {
    return {
      darkTheme: ref(false),
      localeInEffect: usePreferenceStore().locale,
      locale: en_US, // for Antd
      // locale: zh_CN, // for Antd
      // locale: ja_JP, // for Antd
    };
  },
  created() {
    this.setPageTitle();
  },
  mounted() {
    this.darkTheme = this.PreferenceStore.darkTheme;
    this.onThemeChange();
    this.PreferenceStore.$subscribe((mutation, state)=>{
      if (state.darkTheme !== this.darkTheme) {
        this.darkTheme = state.darkTheme;
        this.onThemeChange();
      }
      if (state.locale !== this.localeInEffect) {
        this.localeInEffect = state.locale;
        this.onLocaleChange(state.locale);
      }
    });
    this.PreferenceStore.$subscribe((mutation, state)=>{
      if (this.MenuStore.locale != state.locale) {
        this.MenuStore.setTranslationBundle(state.locale, state.i18n);
      }
    });

    if (!this.AuthStore.loggedIn) {
      this.$router.push('/login');
    }
  },
  methods: {
    setPageTitle(){
      NativeDomUtil.changePageTitle(this.i18n.message['sentence.systemName']);
    },
    onThemeChange() {
      // logger?.log('theme changed', this.darkTheme);
      NativeDomUtil.changeBodyForeBackColor(
        this.PreferenceStore.colorPalette.fgColor,
        this.PreferenceStore.colorPalette.bgColor,
      );
    },
    onLocaleChange(locale: LocaleCode) {
      // logger?.log('locale changed', this.localeForTitle);
      this.setPageTitle();
      if (locale == LocaleCode.en) {
        this.locale = en_US;
      } else if (locale == LocaleCode.zh) {
        this.locale = zh_CN;
      } else {
        logger?.warn('unrecognized locale for Antd:', locale);
        this.locale = en_US;
      }
    }
  },
};
</script>

<style scoped>
div.view-wrapper.loggedIn {
  padding: 2em;
  width: 100%;
  height: fit-content;
}
div.view-wrapper {
  width: 100%;
  height: 100%;
}
</style>
