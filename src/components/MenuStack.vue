<template>
  <a-menu mode="inline" class="my app-stack-menu" 
    v-model:openKeys="menuOpened" 
    @click="onMenuItemClick"
    :theme="(PreferenceStore.darkTheme ? 'dark':'light')"
  >
  <a-sub-menu>
    <template #title>
      <img 
        class="home-logo" 
        :style="{ backgroundColor: homeLogoBGColor }"
        src="/images/logo.png" />
      {{ i18n.message['sentence.systemName'] }}
    </template>
    <template v-for="menuItem in filterMenuItems(MenuStore.menuRoot)" 
      :key="menuItem.code">

        <a-menu-item v-if="!menuItem.children"
        :key="menuItem.code">
          <RouterLink :to="menuItem.targetPath!">
            <font-awesome-icon v-if="menuItem.icon" 
              :icon="menuItem.icon" style="margin-right: 0.4em;" />
            {{ menuItem.title }}
          </RouterLink>
        </a-menu-item>

        <a-sub-menu v-if="menuItem.children" :key="menuItem.code">
          <template #title>
            {{ menuItem.title }}
          </template>

          <template v-for="subItem in filterMenuItems(menuItem.children)"
          :key="subItem.code">
            <a-menu-item v-if="!subItem.isDivider" :key="subItem.code">
              <RouterLink v-if="subItem.targetPath" :to="subItem.targetPath">
                <font-awesome-icon v-if="subItem.icon" 
                  :icon="subItem.icon" style="margin-right: 0.4em;" />
                {{ subItem.title }}
              </RouterLink>
              <div v-if="!subItem.targetPath">
                <font-awesome-icon v-if="subItem.icon" 
                  :icon="subItem.icon" style="margin-right: 0.4em;" />
                {{ subItem.title }}
              </div>
            </a-menu-item>
            <a-menu-divider v-if="subItem.isDivider" />
          </template>
        </a-sub-menu>

    </template>

    <a-sub-menu key="systemMenu">
      <template #title>
        {{ i18n.word['word.core.systemMenu'] }}
      </template>
      <template v-for="subItem in filterMenuItems(MenuStore.sysMenuRoot.children)"
      :key="subItem.code">
        <a-menu-item v-if="!subItem.isDivider" :key="subItem.code">
          <RouterLink v-if="subItem.targetPath" :to="subItem.targetPath">
            <font-awesome-icon v-if="subItem.icon" 
              :icon="subItem.icon" style="margin-right: 0.4em;" />
            {{ subItem.title }}
          </RouterLink>
          <div v-if="!subItem.targetPath">
            <font-awesome-icon v-if="subItem.icon" 
              :icon="subItem.icon" style="margin-right: 0.4em;" />
            {{ subItem.title }}
          </div>
        </a-menu-item>
        <a-menu-divider v-if="subItem.isDivider" />
      </template>
    </a-sub-menu>

  </a-sub-menu>
  </a-menu>
</template>

<script lang="ts">
import type { ILogger } from '@/model/core/ILogger';
import { AuthProvider } from '@/service/AuthProvider';
import { MessageService } from '@/service/MessageService';
import { useMenuStore, type MenuItem } from '@/stores/MenuStore';
import { usePreferenceStore } from '@/stores/PreferenceStore';
import { ref } from 'vue';

let debug = !!(+import.meta.env.VITE_MenuBar_debug);
const logger: ILogger = console;

export default {
  computed: {
    iMessageService: ()=>MessageService(),
    PreferenceStore: ()=>usePreferenceStore(),
    MenuStore: ()=>useMenuStore(),
    i18n: ()=>usePreferenceStore().i18n,
    iAuthProvider: ()=>AuthProvider(),
    homeLogoBGColor: ()=>import.meta.env.VITE_LOGO_BG_COLOR,
  },
  data() {
    return {
      menuOpened: <string[]>[],
    };
  },
  methods: {
    filterMenuItems(list?: MenuItem[]): MenuItem[] {
      if (list) {
        return list.filter(it=>{
          if (!debug && it.debugUseOnly) {
            return false;
          } else if (this.PreferenceStore.darkTheme && 
          it.code == 'switchToDarkTheme') {
            return false;
          } else if (!this.PreferenceStore.darkTheme && 
          it.code == 'switchToLightTheme') {
            return false;
          } else {
            return true;
          }
        });
      } else {
        return [];
      }
    },
    async onMenuItemClick(event: {item : any, key : string, keyPath: string}) {
      let mappedMenuItem = this.MenuStore.itemOfKeyMap[event.key];
      let code = event.key;
      if (debug) logger?.log('onMenuItemClick ', code);
      if (debug) logger?.log('mappedMenuItem:', mappedMenuItem);
      if (code == 'logout') {
        this.iAuthProvider.logout();
        this.$router.push('/login');
      } else if (code == 'switchToDarkTheme') {
        this.PreferenceStore.setTheme(true);
      } else if (code == 'switchToLightTheme') {
        this.PreferenceStore.setTheme(false);
      }
      this.menuOpened = [];
    },
  },
};
</script>