/**
 * code for locale varies for libraries,
 * here is the code we use.
 */
export enum LocaleCode {

  /**
   * English
   */
  en = 'en',

  /**
   * Chinese
   */
  zh = 'zh',

  /**
   * Japanese
   */
  ja = 'ja',

}

/**
 * for the provided locale code, return the locale name 
 * used by dayjs. (suitable for calling dayjs.locale())
 * @returns (if no matching found, return en as fallback)
 */
export function getDayJsLocaleName(locale: LocaleCode): string {
  switch (locale) {
    case LocaleCode.en:
      return 'en';
      break;
    case LocaleCode.zh:
      return 'zh-cn';
      break;
    case LocaleCode.ja:
      return 'ja';
      break;
  }

  return 'en';
}
