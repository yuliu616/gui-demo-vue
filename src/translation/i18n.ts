import { GuiConfig } from "@/model/GuiConfig";
import { LocaleCode } from "@/model/Locale";
import { ObjectHelper } from "@/util/ObjectHelper";
import { en } from './i18n.en';
import { zh } from './i18n.zh';

let base = {

  pathToBundle: <{[_:string]: any}|null>null,

  /**
   * method to translate a i18n value
   * (RECOMMEND to use static look up instead)
   * @param pack any keys under the i18n object (or path using dot notation).
   * @param value key to be looked up in the pack, for example: 'action.ok'
   * @returns 
   */
  t: function(pack: string, value: string): string {
    if (!this.pathToBundle) {
      // console.log('initialize pathToBundle');
      let leafOfPath: {[_:string]: any} = {};
      ObjectHelper.traverseObjectGraph(this, 
      (pathSoFar, it)=>{
        // leaf = i18n bundle (key/value pair for translation)
        if (typeof it == 'object'){
          let keys = Object.keys(it);
          if (keys.length > 0) {
            if (typeof it[keys[0]] == 'string') {
              return true;
            }
          }
        }
        return false;
      }, 
      (pathSoFar, it)=>{
        leafOfPath[pathSoFar] = it;
      });
      this.pathToBundle = leafOfPath;
      // console.log('this.pathToBundle =', this.pathToBundle);
    }

    let targetPack: any = this.pathToBundle[pack];
    if (targetPack) {
      return <string>targetPack[value] || value;
    } else {
      // fallback
      return value;
    }
  }
}

let i18n = Object.assign(base, en);

if (GuiConfig.locale == LocaleCode.zh) {
  i18n = Object.assign(base, zh);
}

export { i18n };
