import { type ModelDef } from "../ModelDef";
import { RegExpTextRule, MaxValueRule, MinValueRule, ValidValueSetRule } from "../validation";
import { Gender } from "./Gender.enum";

export interface People {

  id?: string;
  version?: number;
  creationDate?: string;
  lastUpdated?: string;
  nickname?: string;
  gender?: string;
  dateOfBirth?: string;
  firstName?: string;
  lastName?: string;
  heightInCm?: number;
  weightInKg?: number;
  active?: boolean;

}

export const PeopleMeta: ModelDef = {

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

    nickname: {
      type: 'string',
      required: true,
      autoFilled: false,
      autoTrim: true,
      rules: [
        new RegExpTextRule(/^([A-Za-z]+[A-Za-z-. ]*|\p{Script=Han}+)$/u,
          'ERROR_INVALID_NAME',
        ),
      ],
    },

    gender: {
      type: 'enum',
      required: true,
      autoFilled: false,
      rules: [
        new ValidValueSetRule(Object.keys(Gender)),
      ]
    },

    dateOfBirth: {
      type: 'date',
      required: false,
      autoFilled: false,
      rules: [
        new RegExpTextRule(/^[12][0-9][0-9][0-9]-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/),
        new MinValueRule('1900-01-01'),
        new MaxValueRule('2050-01-01'),
      ],
    },

    firstName: {
      type: 'string',
      required: true,
      autoFilled: false,
      autoTrim: true,
      rules: [
        new RegExpTextRule(/^([A-Za-z]+[A-Za-z-. ]*|\p{Script=Han}+)$/u,
          'ERROR_INVALID_NAME',
        ),
      ],
    },

    lastName: {
      type: 'string',
      required: true,
      autoFilled: false,
      autoTrim: true,
      rules: [
        new RegExpTextRule(/^([A-Za-z]+[A-Za-z-. ]*|\p{Script=Han}+)$/u,
          'ERROR_INVALID_NAME',
        ),
      ],
    },

    heightInCm: {
      type: 'number',
      required: false,
      autoFilled: false,
      rules: [
        new MinValueRule(0, {exclusive: true}, 'ERROR_MUST_BE_POSITIVE'),
        new MinValueRule(10, null, 'ERROR_TOO_SHORT_FOR_A_HUMAN'),
        new MaxValueRule(500),
      ],
    },

    weightInKg: {
      type: 'number',
      required: false,
      autoFilled: false,
      rules: [
        new MinValueRule(0, {exclusive: true}, 'ERROR_MUST_BE_POSITIVE'),
        new MinValueRule(0.01, null, 'ERROR_TOO_LIGHT_FOR_A_HUMAN'),
      ]
    },

    active: {
      type: 'boolean',
      required: false,
      autoFilled: true,
    },
  }

}
