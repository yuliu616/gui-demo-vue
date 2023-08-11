<template>
  <div style="text-align: center;">
    -----
    <br/><br/>
    <p>{{ i18n.message['sentence.thisSiteIsForDemoPurpose'] }}</p>
    <p v-if="isDebugEnabled">{{ currentDateText }}</p>
    <div v-if="isDebugEnabled">
      <a-switch v-model:checked="isDarkTheme"
        :checked-children="i18n.word['word.theme.dark']"
        :un-checked-children="i18n.word['word.theme.light']"
      />
      <a-switch v-model:checked="isEnglishLocale"
        :checked-children="i18n.core.word['word.enum.LocaleCode.en']"
        :un-checked-children="i18n.core.word['word.enum.LocaleCode.zh']"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { LocaleCode } from '@/model/LocaleCode';
import type { ILogger } from '@/model/core/ILogger';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { ref, watch } from 'vue';

let debug = !!(+import.meta.env.VITE_Footer_debug);
const logger: ILogger = console;

let isDarkThemeRef = ref(false);
let isEnglishLocaleRef = ref(false);

export default {
  computed: {
    PreferenceStore: ()=>usePreferenceStore(),
    i18n: ()=>usePreferenceStore().i18n,
    currentDateText: ()=>usePreferenceStore().formatter.formatLongDate(new Date()),
  },
  data() {
    return {
      isDarkTheme: isDarkThemeRef, // for debug-use only
      isEnglishLocale: isEnglishLocaleRef, // for debug-use only
      isDebugEnabled: ref(debug),
    };
  },
  mounted() {
    if (debug) {
      // init
      this.isDarkTheme = this.PreferenceStore.darkTheme;
      this.isEnglishLocale = (this.PreferenceStore.locale == LocaleCode.en);

      watch(isDarkThemeRef, (value, pref)=>{
        if (debug) logger?.log('darkTheme change to:', value);
        this.PreferenceStore.setTheme(value);
      });
      watch(isEnglishLocaleRef, (value, pref)=>{
        let locale = value ? LocaleCode.en : LocaleCode.zh;
        if (debug) logger?.log('locale change to:', locale);
        this.PreferenceStore.setLocale(locale);
      });
    }
  },
};
</script>