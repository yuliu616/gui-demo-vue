import { type App } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { 
  faSun,
  faMoon,
  faMountainSun,
  faKey,
  faPerson,
  faPersonDress,
  faCaretDown,
  faPenToSquare,
  faList,
  faXmark,
  faBoxArchive,
  faFileImport,
  faPaperPlane,
  faSpinner,
  faFan,
  faCog,
  faBell,
  faStar,
  faSquare,
  faInfoCircle,
  faBug,
  faHome,
} from '@fortawesome/free-solid-svg-icons';

export function useFontAwesome(vueApp: App): App {
  // specific icons to be installed.
  library.add(
    faSun,
    faMoon,
    faMountainSun,
    faKey,
    faPerson,
    faPersonDress,
    faCaretDown,
    faPenToSquare,
    faList,
    faXmark,
    faBoxArchive,
    faFileImport,
    faPaperPlane,
    faSpinner,
    faFan,
    faCog,
    faBell,
    faStar,
    faSquare,
    faInfoCircle,
    faBug,
    faHome,
  );

  vueApp.component('FontAwesomeIcon', FontAwesomeIcon);
  return vueApp;
}