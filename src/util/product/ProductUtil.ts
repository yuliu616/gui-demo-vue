import type { Product } from "@/model/product/Product";
import type { i18nModel } from "@/translation/i18n";
import { StringUtil } from "../StringUtil";

export class ProductUtil {

  /**
   * get a simple string presentation to describe this 
   * record (like 'Mr. chan').
   * @returns null if no any suitable string
   */
  public static stringPresentationFor(product: Product, i18n: i18nModel): string|null {
    if (!product) {
      return null;
    } else if (product.name) {
      return product.name;
    } else {
      return StringUtil.formatString('{0} {1}',
        i18n.product.model.Product['model.name'],
        product.id,
      );
    }
  }

}
