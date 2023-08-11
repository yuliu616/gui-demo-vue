import { type ModelDef } from "../ModelDef";
import { RegExpTextRule, MaxValueRule, MinValueRule, ValidValueSetRule } from "../validation";

export interface Product {

  id?: string;
  version?: number;
  creationDate?: string;
  lastUpdated?: string;
  name?: string;
  brandId?: string;
  releaseDate?: string;
  weightInKg?: number;
  active?: boolean;

}

export const ProductMeta: ModelDef = {

  fields: {
    creationDate: {
      type: 'dateTime',
      required: false,
      autoFilled: true,
    },
  
    lastUpdated: {
      type: 'dateTime',
      required: false,
      autoFilled: true,
    },

    name: {
      type: 'string',
      required: true,
      autoFilled: false,
      autoTrim: true,
      rules: [
        // for letters, digits, safe symbols and Chinese
        new RegExpTextRule(/^[0-9A-Za-z#\/\-\s\p{Script=Han}]+$/u),
      ],
    },

    brandId: {
      type: 'string',
      required: false,
      autoFilled: false,
      autoTrim: false,
    },

    releaseDate: {
      type: 'date',
      required: false,
      autoFilled: false,
      rules: [
        new RegExpTextRule(/^[12][0-9][0-9][0-9]-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/),
      ],
    },

    weightInKg: {
      type: 'number',
      required: false,
      autoFilled: false,
      rules: [
        new MinValueRule(0.001),
      ]
    },

    active: {
      type: 'boolean',
      required: false,
      autoFilled: true,
    },
  }

}
