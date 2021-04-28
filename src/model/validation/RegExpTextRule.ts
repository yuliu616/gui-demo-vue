import { 
  ERROR_INVALID_FORMAT,
  FailureExplanation,
  ValidationRule 
} from './Validation';
import { ValidationUtil } from './ValidationUtil';

export class RegExpTextRule implements ValidationRule {

  name = 'RegExpTextRule';
  
  constructor(private pattern: RegExp) {
  }

  validate(value: any): FailureExplanation|null {
    // always accept 'empty value'
    if (ValidationUtil.isEmptyValueForRule('string', value)) {
      return null;
    }
    // always reject 'nonsense value'
    if (ValidationUtil.isNonSenseValueForRule('string', value)) {
      return { reason: ERROR_INVALID_FORMAT };
    }

    if (!this.pattern.test(value)) {
      return { reason: ERROR_INVALID_FORMAT };
    } else {
      return null;
    }
  }

}
