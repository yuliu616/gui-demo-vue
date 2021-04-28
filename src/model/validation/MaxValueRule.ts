import { 
  ERROR_INVALID_VALUE, 
  FailureExplanation,
  ValidationRule
} from './Validation';
import { ValidationUtil } from './ValidationUtil';

export class MaxValueRule implements ValidationRule {

  name = 'MaxValueRule';

  constructor(private max: any) {
  }

  validate(value: any): FailureExplanation|null {
    // always accept 'empty value'
    if (ValidationUtil.isEmptyValueForRule(typeof this.max, value)) {
      return null;
    }
    // always reject 'nonsense value'
    if (ValidationUtil.isNonSenseValueForRule(typeof this.max, value)) {
      return { reason: ERROR_INVALID_VALUE };
    }

    if (value !== null && value > this.max) {
      return { reason: ERROR_INVALID_VALUE };
    } else {
      return null;
    }
  }

}
