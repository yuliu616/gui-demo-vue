import { 
  ERROR_INVALID_VALUE, 
  FailureExplanation,
  ValidationRule
} from './Validation';
import { ValidationUtil } from './ValidationUtil';

export class MinValueRule implements ValidationRule {

  name = 'MinValueRule';

  constructor(private min: any) {
  }

  validate(value: any): FailureExplanation|null {
    // always accept 'empty value'
    if (ValidationUtil.isEmptyValueForRule(typeof this.min, value)) {
      return null;
    }
    // always reject 'nonsense value'
    if (ValidationUtil.isNonSenseValueForRule(typeof this.min, value)) {
      return { reason: ERROR_INVALID_VALUE };
    }
    
    if (value !== null && value < this.min) {
      return { reason: ERROR_INVALID_VALUE };
    } else {
      return null;
    }
  }

}
