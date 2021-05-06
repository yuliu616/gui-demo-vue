import { LocaleCode } from "./Locale";

export interface IGuiConfig {

  /**
   * DEV ? PROD ? etc.
   */
  environmentName: string;
  
  locale: LocaleCode;
  
  /**
   * which logo to use (for ease of distinguish)
   */
  useLogo: 'DEV' | 'PROD';

  /**
   * background color for logo (for ease of distinguish)
   */
  logoBgColor: string;  

  auth: {
    /**
     * repeating interval for trying to refresh auth token.
     * (if a token expires in 60s, you should not refresh it more than 30s)
     */
    tokenRefreshSec: number;
  }

}

export const GuiConfig: IGuiConfig = {

  environmentName: process.env.NODE_ENV,
  locale: LocaleCode.en,
  logoBgColor: process.env.VUE_APP_LOGO_BG_COLOR,
  useLogo: process.env.VUE_APP_LOGO_USE,
  auth: {
    tokenRefreshSec: process.env.VUE_APP_AUTH_REFRESH_SEC || 4,
  },

};
