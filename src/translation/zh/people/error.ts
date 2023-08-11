import { error as generalError } from '../error';

let scopedError = {
  'ERROR_INVALID_NAME': '名字可以是中文或者英语（但不可以混合）',
  'ERROR_TOO_SHORT_FOR_A_HUMAN': '怎么矮也不能矮成这样吧',
  'ERROR_TOO_LIGHT_FOR_A_HUMAN': '怎么瘦也有限度吧',
  'TOO_MANY_WIFE': '可惜男人不可以娶{0}个媳妇',
};
const merged = Object.assign({}, generalError, scopedError);

export { merged as error };
