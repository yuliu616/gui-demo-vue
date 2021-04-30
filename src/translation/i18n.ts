import { GuiConfig } from "@/model/GuiConfig";
import { en } from './en';
import { zh } from './zh';

let i18n = en;

if (GuiConfig.lang == 'zh') {
  i18n = zh;
}

export { i18n };
