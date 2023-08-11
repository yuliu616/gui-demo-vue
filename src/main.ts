import './assets/main.css';
import 'ant-design-vue/dist/antd.min.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import { useFontAwesome } from './fontAwesomeSetup';
import { usePreferenceStore } from './stores/PreferenceStore';
import { LocaleCode } from './model/LocaleCode';
import { useAxios } from './axiosSetup';
import dayjs from 'dayjs';

import App from './App.vue';
import router from './router'; // import router related codes.

// localize dayjs
import 'dayjs/locale/en'; // en_US
import 'dayjs/locale/zh-cn';
import { useAuthStore } from './stores/AuthStore';
import { useMessageStore } from './stores/MessageStore';
import { useMenuStore } from './stores/MenuStore';
import { AuthProvider } from './service/AuthProvider';
// import 'dayjs/locale/ja';
dayjs.locale('en'); // en_US
// dayjs.locale('zh-cn');
// dayjs.locale('ja');

const app = createApp(App);

// enable plugins: router, state management(pinia).
app.use(createPinia());
app.use(router);
app.use(Antd);
useFontAwesome(app);
useAxios(app);

// init for stores (if any)
useAuthStore().init();
useMessageStore().init();
usePreferenceStore().init();
useMenuStore().init();

if (useAuthStore().loggedIn) {
  AuthProvider().startTokenRefreshRepeatedJob();
}

app.mount('#app');
